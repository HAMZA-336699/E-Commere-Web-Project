<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminPasswordResetNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly string $token, private readonly string $email)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $base = rtrim((string) env('FRONTEND_RESET_URL', 'http://localhost:5173/admin/reset-password'), '/');
        $resetUrl = $base.'?token='.urlencode($this->token).'&email='.urlencode($this->email);

        return (new MailMessage)
            ->subject('City Laptops Admin Password Reset')
            ->greeting('Hello Admin,')
            ->line('A password reset request was received for your admin account.')
            ->action('Reset Password', $resetUrl)
            ->line('If you did not request this, please ignore this email.');
    }
}
