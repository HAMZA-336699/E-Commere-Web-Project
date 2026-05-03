<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'brand' => ['sometimes', 'required', Rule::in(['Dell', 'HP'])],
            'model' => ['sometimes', 'required', 'string', 'max:255'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'specs' => ['sometimes', 'required', 'array'],
            'specs.ram' => ['required_with:specs', 'string', 'max:50'],
            'specs.ssd' => ['required_with:specs', 'string', 'max:50'],
            'specs.processor' => ['required_with:specs', 'string', 'max:100'],
            'specs.display' => ['required_with:specs', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'existing_image_ids' => ['nullable', 'array'],
            'existing_image_ids.*' => ['integer', 'exists:product_images,id'],
        ];
    }
}
