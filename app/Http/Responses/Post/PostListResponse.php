<?php

namespace App\Http\Responses\Post;

class PostListResponse
{
    public function __construct(
        /** @var PostResource[] */
        public array $data
    ) {}
}
