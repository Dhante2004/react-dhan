<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ContactController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $messages = $this->messages();
        $messages[] = [
            'id' => (string) str()->uuid(),
            'name' => $validated['name'],
            'email' => $validated['email'],
            'message' => $validated['message'],
            'created_at' => now()->toIso8601String(),
        ];

        Storage::disk('local')->put('contact-messages.json', json_encode($messages, JSON_PRETTY_PRINT));

        return response()->json([
            'success' => true,
            'message' => 'Thanks, your message has been received.',
        ], 201);
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'messages' => array_reverse($this->messages()),
        ]);
    }

    private function messages(): array
    {
        if (!Storage::disk('local')->exists('contact-messages.json')) {
            return [];
        }

        return json_decode(Storage::disk('local')->get('contact-messages.json'), true) ?: [];
    }
}
