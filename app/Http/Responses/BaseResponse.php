<?php

namespace App\Http\Responses;

class BaseResponse
{
    public function __construct(
        public ?string $message = null
    ) {}
}
