<?php

namespace App\Http\Responses\Auth;

class ResetPasswordResponse
{
    public function __construct(
        public string $message = 'Password has been reset successfully'
    ) {}
}
