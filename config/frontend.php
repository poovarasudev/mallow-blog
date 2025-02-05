<?php

return [
    'url' => env('FRONTEND_URL', 'http://localhost:3000'),
    'password_reset_url' => env('FRONTEND_PASSWORD_RESET_URL', env('FRONTEND_URL', 'http://localhost:3000').'/reset-password'),
];
