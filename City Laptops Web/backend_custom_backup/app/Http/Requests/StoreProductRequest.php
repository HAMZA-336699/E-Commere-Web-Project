<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'brand' => ['required', Rule::in(['Dell', 'HP'])],
            'model' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'specs' => ['required', 'array'],
            'specs.ram' => ['required', 'string', 'max:50'],
            'specs.ssd' => ['required', 'string', 'max:50'],
            'specs.processor' => ['required', 'string', 'max:100'],
            'specs.display' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
        ];
    }
}
