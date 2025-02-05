<?php

namespace App\Http\Responses\Auth;

class SessionResponse
{
    public function __construct(
        public array $sessions,
        public string $message = 'Sessions retrieved successfully'
    ) {}
}
