<?php

namespace App\Providers;

use App\Events\ProductCreated;
use App\Listeners\LogProductCreated;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        ProductCreated::class => [
            LogProductCreated::class,
        ],
    ];

    public function boot(): void
    {
        //
    }
}
