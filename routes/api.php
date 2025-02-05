<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use Illuminate\Support\Facades\Route;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Password reset routes
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Email verification routes
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->name('verification.verify');
Route::post('/email/resend-verification', [AuthController::class, 'resendVerification'])
    ->middleware('throttle:6,1')
    ->name('verification.send');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Session management routes with prefix
    Route::prefix('sessions')->group(function () {
        Route::get('', [AuthController::class, 'activeSessions']);
        Route::post('/{token_id}/revoke', [AuthController::class, 'revokeToken']);
        Route::post('/revoke-all-except-current', [AuthController::class, 'revokeOtherTokens']);
    });
});

// Post routes
Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::apiResource('posts', PostController::class);
    Route::post('posts/{post}/like', [PostController::class, 'like']);
});
