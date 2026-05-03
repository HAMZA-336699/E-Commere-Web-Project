<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'brand',
        'model',
        'price',
        'specs',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'specs' => 'array',
        ];
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }
}
