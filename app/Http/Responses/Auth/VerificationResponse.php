<?php

namespace App\Http\Responses\Auth;

class VerificationResponse
{
    public function __construct(
        public string $message,
        public bool $verified = true
    ) {}
}
