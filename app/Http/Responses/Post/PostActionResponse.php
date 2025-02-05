<?php

namespace App\Http\Responses\Post;

use App\Http\Responses\BaseResponse;

class PostActionResponse extends BaseResponse
{
    public function __construct(
        string $message,
        public ?int $likes_count = null
    ) {
        parent::__construct($message);
    }
}
