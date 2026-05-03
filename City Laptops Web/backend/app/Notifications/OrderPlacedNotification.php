<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderPlacedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly Order $order)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Order Received - City Laptops')
            ->greeting('New order alert!')
            ->line('A new order has been placed on City Laptops website.')
            ->line('Order ID: #'.$this->order->id)
            ->line('Product: '.$this->order->product_name.' ('.$this->order->product_model.')')
            ->line('Customer: '.$this->order->customer_name.' ('.$this->order->customer_phone.')')
            ->line('City: '.$this->order->city)
            ->line('Please log in to the admin panel to process this order.');
    }
}
