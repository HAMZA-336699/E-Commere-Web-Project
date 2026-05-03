<?php

namespace App\Listeners;

use App\Events\ProductCreated;
use Illuminate\Support\Facades\Log;

class LogProductCreated
{
    public function handle(ProductCreated $event): void
    {
        Log::info('Product created', [
            'product_id' => $event->product->id,
            'name' => $event->product->name,
            'brand' => $event->product->brand,
            'price' => $event->product->price,
        ]);
    }
}
