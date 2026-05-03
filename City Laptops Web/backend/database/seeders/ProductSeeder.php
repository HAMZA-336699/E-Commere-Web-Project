<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Dell XPS 15 Creator Edition',
                'brand' => 'Dell',
                'model' => 'XPS 15 9530',
                'price' => 429999,
                'specs' => [
                    'ram' => '32GB DDR5',
                    'ssd' => '1TB NVMe',
                    'processor' => 'Intel Core i9 13th Gen',
                    'display' => '15.6" OLED 3.5K',
                ],
                'description' => 'Premium ultrabook for creators with brilliant OLED display and high-performance internals.',
            ],
            [
                'name' => 'Dell Inspiron 14 Everyday Pro',
                'brand' => 'Dell',
                'model' => 'Inspiron 14 7430',
                'price' => 238500,
                'specs' => [
                    'ram' => '16GB DDR5',
                    'ssd' => '512GB NVMe',
                    'processor' => 'Intel Core i7 13th Gen',
                    'display' => '14" FHD+ IPS',
                ],
                'description' => 'Reliable daily driver with excellent battery life and lightweight aluminum build.',
            ],
            [
                'name' => 'HP Spectre x360 Flagship',
                'brand' => 'HP',
                'model' => 'Spectre x360 14',
                'price' => 389900,
                'specs' => [
                    'ram' => '16GB LPDDR5',
                    'ssd' => '1TB NVMe',
                    'processor' => 'Intel Core Ultra 7',
                    'display' => '13.5" 3K2K OLED Touch',
                ],
                'description' => 'Elegant 2-in-1 premium laptop with pen support and top-tier display quality.',
            ],
            [
                'name' => 'HP Victus Gaming 15',
                'brand' => 'HP',
                'model' => 'Victus 15-fa1093dx',
                'price' => 279000,
                'specs' => [
                    'ram' => '16GB DDR4',
                    'ssd' => '1TB NVMe',
                    'processor' => 'Intel Core i5 13th Gen',
                    'display' => '15.6" FHD 144Hz',
                ],
                'description' => 'Strong value gaming laptop with high refresh display and efficient cooling profile.',
            ],
        ];

        foreach ($products as $data) {
            Product::create($data);
        }
    }
}
