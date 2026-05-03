<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminTableController extends Controller
{
    public function products(Request $request): JsonResponse
    {
        $query = Product::query()->select(['id', 'name', 'brand', 'model', 'price', 'created_at']);

        return $this->respond($request, $query);
    }

    public function orders(Request $request): JsonResponse
    {
        $query = Order::query()->select([
            'id',
            'customer_name',
            'customer_email',
            'customer_phone',
            'product_name',
            'city',
            'status',
            'created_at',
        ]);

        return $this->respond($request, $query);
    }

    public function orderItems(Request $request): JsonResponse
    {
        $query = OrderItem::query()->select([
            'id',
            'order_id',
            'product_name',
            'product_brand',
            'product_model',
            'quantity',
            'unit_price',
            'line_total',
            'created_at',
        ]);

        return $this->respond($request, $query);
    }

    public function customers(Request $request): JsonResponse
    {
        $query = DB::table('orders')
            ->select([
                DB::raw('MIN(id) as id'),
                'customer_email',
                DB::raw('MAX(customer_name) as customer_name'),
                DB::raw('MAX(customer_phone) as customer_phone'),
                DB::raw('MAX(city) as city'),
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('MAX(created_at) as last_order_at'),
            ])
            ->groupBy('customer_email');

        return $this->respond($request, $query);
    }

    public function admins(Request $request): JsonResponse
    {
        $query = User::query()
            ->where('is_admin', true)
            ->select(['id', 'name', 'email', 'created_at']);

        return $this->respond($request, $query);
    }

    private function respond(Request $request, EloquentBuilder|Builder $query): JsonResponse
    {
        if ($request->boolean('datatable') && class_exists('Yajra\\DataTables\\Facades\\DataTables')) {
            /** @var class-string $dataTables */
            $dataTables = 'Yajra\\DataTables\\Facades\\DataTables';

            return $dataTables::of($query)->toJson();
        }

        return response()->json([
            'data' => $query->latest('id')->get(),
        ]);
    }
}
