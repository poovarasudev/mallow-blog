<?php

namespace App\Http\Responses\Post;

class PostDetailResponse
{
    public function __construct(
        public PostResource $data
    ) {}
}
