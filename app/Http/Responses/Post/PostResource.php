<?php

namespace App\Http\Responses\Post;

class PostResource
{
    public function __construct(
        public int $id,
        public string $title,
        public string $content,
        public string $author,
        public int $likes_count,
        public bool $is_liked,
        public bool $is_author,
        public string $created_at
    ) {}
}
