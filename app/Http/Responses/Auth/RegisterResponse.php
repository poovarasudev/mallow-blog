<?php

namespace App\Http\Responses\Auth;

class RegisterResponse
{
    public function __construct(
        public string $message = 'Registration successful'
    ) {}
}
