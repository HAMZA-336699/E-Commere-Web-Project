<?php

namespace App\Http\Controllers\Api;

use App\Events\ProductCreated;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $brand = $request->string('brand')->toString();
        $featured = $request->query('featured');

        $products = Product::with('images')
            ->when($brand, fn ($query) => $query->where('brand', $brand))
            ->when($request->has('featured'), fn ($query) => $query->where('is_featured', $request->boolean('featured')))
            ->latest()
            ->paginate(12);

        return response()->json($products->through(fn (Product $product) => new ProductResource($product)));
    }

    public function show(Product $product): ProductResource
    {
        $product->load('images');

        return new ProductResource($product);
    }

    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = DB::transaction(function () use ($request): Product {
            $product = Product::create($request->safe()->except('images'));

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $product->images()->create([
                        'path' => $image->store('products', 'public'),
                    ]);
                }
            }

            event(new ProductCreated($product));

            return $product;
        });

        return response()->json([
            'message' => 'Product created successfully.',
            'product' => new ProductResource($product->load('images')),
        ], 201);
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        DB::transaction(function () use ($request, $product): void {
            $product->update($request->safe()->except(['images', 'existing_image_ids']));

            if ($request->filled('existing_image_ids')) {
                $keepIds = $request->input('existing_image_ids', []);
                $product->images()
                    ->whereNotIn('id', $keepIds)
                    ->get()
                    ->each(function ($image): void {
                        Storage::disk('public')->delete($image->path);
                        $image->delete();
                    });
            }

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $product->images()->create([
                        'path' => $image->store('products', 'public'),
                    ]);
                }
            }
        });

        return response()->json([
            'message' => 'Product updated successfully.',
            'product' => new ProductResource($product->fresh()->load('images')),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        DB::transaction(function () use ($product): void {
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image->path);
            }

            $product->images()->delete();
            $product->delete();
        });

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }

    public function stats(): JsonResponse
    {
        $productsByBrand = Product::select('brand', DB::raw('count(*) as total'))
            ->groupBy('brand')
            ->pluck('total', 'brand');

        $priceRanges = [
            'Under 200k' => Product::where('price', '<', 200000)->count(),
            '200k - 350k' => Product::whereBetween('price', [200000, 350000])->count(),
            'Above 350k' => Product::where('price', '>', 350000)->count(),
        ];

        return response()->json([
            'total_products' => Product::count(),
            'total_categories' => Product::distinct('brand')->count('brand'),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'by_brand' => $productsByBrand,
            'by_price_range' => $priceRanges,
            'recent_orders' => Order::latest()->limit(6)->get([
                'id',
                'customer_name',
                'product_name',
                'status',
                'created_at',
            ]),
        ]);
    }
}
