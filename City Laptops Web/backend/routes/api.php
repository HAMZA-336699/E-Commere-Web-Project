<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminTableController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::post('/contact', [ContactController::class, 'store']);

    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::middleware('admin')->group(function (): void {
            Route::post('/products', [ProductController::class, 'store']);
            Route::post('/products/{product}', [ProductController::class, 'update']);
            Route::delete('/products/{product}', [ProductController::class, 'destroy']);
            Route::get('/dashboard/stats', [ProductController::class, 'stats']);

            Route::get('/orders', [OrderController::class, 'index']);
            Route::post('/orders/{order}/status', [OrderController::class, 'updateStatus']);

            Route::get('/table/products', [AdminTableController::class, 'products']);
            Route::get('/table/orders', [AdminTableController::class, 'orders']);
            Route::get('/table/order-items', [AdminTableController::class, 'orderItems']);
            Route::get('/table/customers', [AdminTableController::class, 'customers']);
            Route::get('/table/admins', [AdminTableController::class, 'admins']);

            Route::get('/order-items', [AdminTableController::class, 'orderItems']);
            Route::get('/customers', [AdminTableController::class, 'customers']);
            Route::get('/admins', [AdminTableController::class, 'admins']);
        });
    });
});
