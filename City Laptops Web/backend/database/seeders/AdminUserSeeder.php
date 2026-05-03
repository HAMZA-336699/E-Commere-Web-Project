<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminEmail = (string) config('admin.email');

        User::where('email', '!=', $adminEmail)->update([
            'is_admin' => false,
        ]);

        User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => (string) config('admin.name'),
                'password' => Hash::make((string) config('admin.password')),
                'is_admin' => true,
            ]
        );
    }
}
