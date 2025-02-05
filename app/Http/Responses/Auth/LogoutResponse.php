<?php

namespace App\Http\Responses\Auth;

class LogoutResponse
{
    public function __construct(
        public string $message = 'Logged out successfully'
    ) {}
}
