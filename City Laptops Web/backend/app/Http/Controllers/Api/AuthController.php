<?php

namespace App\Http\Controllers\Api;

use App\Notifications\AdminPasswordResetNotification;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Throwable;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $adminEmail = (string) config('admin.email');
        $isAllowedAdmin = Str::lower($data['email']) === Str::lower($adminEmail);

        if (! $isAllowedAdmin) {
            throw ValidationException::withMessages([
                'email' => ['Only configured admin account can log in.'],
            ]);
        }

        $user = User::where('email', $adminEmail)->where('is_admin', true)->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials provided.'],
            ]);
        }

        $token = $user->createToken('city-laptops-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $adminEmail = (string) config('admin.email');
        if (Str::lower($data['email']) !== Str::lower($adminEmail)) {
            return response()->json([
                'message' => 'If this account exists, a reset link has been sent.',
            ]);
        }

        $user = User::where('email', $adminEmail)->where('is_admin', true)->first();
        if (! $user) {
            return response()->json([
                'message' => 'Admin account is not configured yet.',
            ], 422);
        }

        $token = Password::broker()->createToken($user);
        try {
            $user->notify(new AdminPasswordResetNotification($token, $adminEmail));
        } catch (Throwable $exception) {
            Log::warning('Admin reset email delivery failed.', [
                'email' => $adminEmail,
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'Reset request created, but email delivery failed. Please check SMTP app password.',
            ], 422);
        }

        return response()->json([
            'message' => 'Password reset link sent to admin email.',
        ]);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'confirmed', 'min:8'],
        ]);

        $adminEmail = (string) config('admin.email');
        if (Str::lower($data['email']) !== Str::lower($adminEmail)) {
            return response()->json([
                'message' => 'Invalid admin email for reset.',
            ], 422);
        }

        $status = Password::broker()->reset(
            $data,
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => __($status),
            ], 422);
        }

        return response()->json([
            'message' => 'Password has been reset successfully.',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
