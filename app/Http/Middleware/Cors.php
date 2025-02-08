<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    public function handle(Request $request, Closure $next)
    {
        $allowedOrigins = ['*']; // Or your specific origins: ['http://localhost:3000', 'https://yourdomain.com']
        $allowedMethods = ['*']; // Or specific methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        $allowedHeaders = ['*']; // Or specific headers: ['Content-Type', 'Authorization']

        $response = $next($request);

        // Handle Preflight (OPTIONS) Request
        if ($request->method() === 'OPTIONS') {
            $response = response('', 200);
        }

        $response->headers->set('Access-Control-Allow-Origin', implode(',', $allowedOrigins)); // Use implode for multiple origins
        $response->headers->set('Access-Control-Allow-Methods', implode(',', $allowedMethods));
        $response->headers->set('Access-Control-Allow-Headers', implode(',', $allowedHeaders));

        // Optional: Set other CORS headers if needed
        // $response->headers->set('Access-Control-Allow-Credentials', 'true'); // If using credentials (cookies, auth)
        // $response->headers->set('Access-Control-Max-Age', 3600); // Cache preflight response

        return $response;
    }
}

