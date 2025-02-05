<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class TrackLastActiveToken
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->currentAccessToken()) {
            $token = $request->user()->currentAccessToken();
            $token->last_used_ip = $request->ip();
            $token->save();
        }

        return $next($request);
    }
}
