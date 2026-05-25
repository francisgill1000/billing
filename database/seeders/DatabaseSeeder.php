<?php

namespace Database\Seeders;

use App\Models\CompanySetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Production-safe seeder. Seeds ONLY the admin user from env vars
     * and ensures a CompanySetting row exists. For local sample data,
     * run `php artisan db:seed --class=DemoDataSeeder` after this.
     */
    public function run(): void
    {
        $email = env('Admin_EMAIL', 'admin@billing.test');
        $password = env('Admin_PASSWORD', 'password');

        $admin = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => env('Admin_NAME', 'Admin'),
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ]
        );

        CompanySetting::firstOrCreate(['user_id' => $admin->id], []);
    }
}
