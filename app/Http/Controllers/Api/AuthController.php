<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResendVerificationRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\RevokeTokenRequest;
use App\Http\Responses\Auth\ForgotPasswordResponse;
use App\Http\Responses\Auth\LoginResponse;
use App\Http\Responses\Auth\LogoutResponse;
use App\Http\Responses\Auth\RegisterResponse;
use App\Http\Responses\Auth\ResetPasswordResponse;
use App\Http\Responses\Auth\SessionResponse;
use App\Http\Responses\Auth\VerificationResponse;
use App\Models\User;
use App\Notifications\VerifyEmailNotification;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Send verification email
        $user->notify(new VerifyEmailNotification);

        return response()->json(
            new RegisterResponse(
                message: 'Registration successful. Please check your email for verification.'
            )
        );
    }

    /**
     * Login user and create token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        if (! $user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Please verify your email to proceed further.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(
            new LoginResponse(token: $token)
        );
    }

    /**
     * Verify email address
     */
    public function verifyEmail(Request $request): JsonResponse
    {
        $user = User::find($request->id);

        if (! $user) {
            return response()->json(
                new VerificationResponse(
                    message: 'User not found',
                    verified: false
                ),
                404
            );
        }

        if (! hash_equals(sha1($user->getEmailForVerification()), $request->hash)) {
            return response()->json(
                new VerificationResponse(
                    message: 'Invalid verification link',
                    verified: false
                ),
                400
            );
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json(
                new VerificationResponse(
                    message: 'Email already verified'
                )
            );
        }

        $user->markEmailAsVerified();

        return response()->json(
            new VerificationResponse(
                message: 'Email verified successfully'
            )
        );
    }

    /**
     * Resend verification email
     */
    public function resendVerification(ResendVerificationRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if ($user->hasVerifiedEmail()) {
            return response()->json(
                new VerificationResponse(
                    message: 'Email already verified',
                    verified: true
                )
            );
        }

        $user->notify(new VerifyEmailNotification);

        return response()->json(
            new VerificationResponse(
                message: 'Verification link sent successfully',
                verified: false
            )
        );
    }

    /**
     * Logout user (Revoke the token).
     */
    public function logout(): JsonResponse
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json(
            new LogoutResponse
        );
    }

    /**
     * Get all active sessions for the authenticated user
     */
    public function activeSessions(): JsonResponse
    {
        $tokens = auth()->user()->tokens()
            ->orderBy('last_used_at', 'desc')
            ->get()
            ->map(function ($token) {
                return [
                    'id' => $token->id,
                    'name' => $token->name,
                    'ip_address' => $token->last_used_ip,
                    'last_used' => $token->last_used_at ? Carbon::parse($token->last_used_at)->diffForHumans() : 'Never',
                    'created_at' => Carbon::parse($token->created_at)->diffForHumans(),
                    'is_current_device' => $token->id === auth()->user()->currentAccessToken()->id,
                ];
            });

        return response()->json(
            new SessionResponse(
                sessions: $tokens->toArray()
            )
        );
    }

    /**
     * Revoke a specific token
     */
    public function revokeToken(RevokeTokenRequest $request): JsonResponse
    {
        $token = auth()->user()->tokens()->findOrFail($request->token_id);
        $token->delete();

        return response()->json([
            'message' => 'Session revoked successfully',
        ]);
    }

    /**
     * Revoke all tokens except current
     */
    public function revokeOtherTokens(): JsonResponse
    {
        auth()->user()->tokens()
            ->where('id', '!=', auth()->user()->currentAccessToken()->id)
            ->delete();

        return response()->json([
            'message' => 'All other sessions have been revoked',
        ]);
    }

    /**
     * Send password reset link.
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status !== Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => __($status),
            ], 400);
        }

        return response()->json(
            new ForgotPasswordResponse
        );
    }

    /**
     * Reset password
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => __($status),
            ], 400);
        }

        return response()->json(
            new ResetPasswordResponse
        );
    }
}
