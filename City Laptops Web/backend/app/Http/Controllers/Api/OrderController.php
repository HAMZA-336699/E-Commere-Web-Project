<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Notifications\OrderPlacedNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $product = Product::findOrFail($request->integer('product_id'));

        $order = DB::transaction(function () use ($request, $product): Order {
            $order = Order::create([
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_brand' => $product->brand,
                'product_model' => $product->model,
                'unit_price' => $product->price,
                'customer_name' => $request->string('customer_name')->toString(),
                'customer_email' => $request->string('customer_email')->toString(),
                'customer_phone' => $request->string('customer_phone')->toString(),
                'city' => $request->string('city')->toString(),
                'address' => $request->string('address')->toString(),
                'notes' => $request->input('notes'),
                'status' => 'pending',
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_brand' => $product->brand,
                'product_model' => $product->model,
                'quantity' => 1,
                'unit_price' => $product->price,
                'line_total' => $product->price,
            ]);

            return $order;
        });

        $admin = User::where('email', config('admin.email'))->where('is_admin', true)->first();
        if ($admin) {
            try {
                $admin->notify(new OrderPlacedNotification($order));
            } catch (Throwable $exception) {
                Log::warning('Order email notification failed.', [
                    'order_id' => $order->id,
                    'error' => $exception->getMessage(),
                ]);
            }
        }

        return response()->json([
            'message' => 'Order placed successfully. We will contact you soon.',
            'order' => new OrderResource($order),
        ], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $status = $request->string('status')->toString();

        $orders = Order::query()
            ->when($status, fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate(20);

        return response()->json($orders->through(fn (Order $order) => new OrderResource($order)));
    }

    public function updateStatus(Request $request, Order $order): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'string', 'in:pending,confirmed,dispatched,delivered,cancelled'],
        ]);

        $order->update(['status' => $data['status']]);

        return response()->json([
            'message' => 'Order status updated successfully.',
            'order' => new OrderResource($order),
        ]);
    }
}
