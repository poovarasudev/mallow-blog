<?php

namespace App\Http\Responses\Auth;

class ForgotPasswordResponse
{
    public function __construct(
        public string $message = 'Password reset link sent to your email'
    ) {}
}
