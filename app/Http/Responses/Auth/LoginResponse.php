<?php

namespace App\Http\Responses\Auth;

class LoginResponse
{
    public function __construct(
        public string $token,
        public string $message = 'Logged in successfully'
    ) {}
}
