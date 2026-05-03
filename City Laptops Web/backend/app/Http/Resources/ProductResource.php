<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'brand' => $this->brand,
            'model' => $this->model,
            'price' => (float) $this->price,
            'specs' => $this->specs,
            'description' => $this->description,
            'is_featured' => (bool) $this->is_featured,
            'images' => $this->images,
            'created_at' => $this->created_at,
        ];
    }
}
