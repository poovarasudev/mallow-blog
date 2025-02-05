<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Post\StorePostRequest;
use App\Http\Requests\Post\UpdatePostRequest;
use App\Http\Responses\Post\PostActionResponse;
use App\Http\Responses\Post\PostDetailResponse;
use App\Http\Responses\Post\PostListResponse;
use App\Http\Responses\Post\PostResource;
use App\Models\Post;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    private function toPostResource(Post $post): PostResource
    {
        return new PostResource(
            id: $post->id,
            title: $post->title,
            content: $post->content,
            author: $post->user->name,
            likes_count: $post->likes_count ?? $post->likes()->count(),
            is_liked: $post->isLikedBy(auth()->user()),
            is_author: $post->user_id === auth()->id(),
            created_at: $post->created_at->diffForHumans()
        );
    }

    /**
     * List all posts
     *
     * Get a list of all posts with optional filters.
     *
     * @queryParam my_posts boolean Filter posts by the authenticated user. Example: true
     * @queryParam sort string Sort posts by most liked posts first. Use 'most_liked' to sort by likes count. Example: most_liked
     *
     * @response PostListResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = Post::with(['user', 'likes'])
            ->withCount('likes')
            ->when($request->boolean('my_posts'), function ($query) {
                $query->where('user_id', auth()->id());
            })
            ->when($request->get('sort') === 'most_liked', function ($query) {
                $query->orderByDesc('likes_count');
            }, function ($query) {
                $query->latest();
            });

        $posts = $query->get()->map(fn ($post) => $this->toPostResource($post));

        return response()->json(new PostListResponse(
            data: $posts->toArray()
        ));
    }

    /**
     * Create a new post
     *
     * @response 201 PostActionResponse
     * @response 422 {
     *   "message": "The given data was invalid.",
     *   "errors": {
     *     "title": ["The title field is required."],
     *     "content": ["The content field is required."]
     *   }
     * }
     */
    public function store(StorePostRequest $request): JsonResponse
    {
        Post::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json(
            new PostActionResponse(message: 'Post created successfully'),
            201
        );
    }

    /**
     * Get a specific post
     *
     * @response PostDetailResponse
     * @response 404 {
     *   "message": "Post not found"
     * }
     */
    public function show(int $id): JsonResponse
    {
        try {
            $post = Post::findOrFail($id);

            return response()->json(new PostDetailResponse(
                data: $this->toPostResource($post)
            ));
        } catch (ModelNotFoundException) {
            return response()->json([
                'message' => 'Post not found',
            ], 404);
        }
    }

    /**
     * Update a post
     *
     * @response PostActionResponse
     * @response 403 {
     *   "message": "Unauthorized"
     * }
     * @response 404 {
     *   "message": "Post not found"
     * }
     * @response 422 {
     *   "message": "The given data was invalid.",
     *   "errors": {
     *     "title": ["The title field is required."],
     *     "content": ["The content field is required."]
     *   }
     * }
     */
    public function update(UpdatePostRequest $request, int $id): JsonResponse
    {
        try {
            $post = Post::findOrFail($id);

            if ($post->user_id !== auth()->id()) {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 403);
            }

            $post->update($request->validated());

            return response()->json(
                new PostActionResponse(message: 'Post updated successfully')
            );
        } catch (ModelNotFoundException) {
            return response()->json([
                'message' => 'Post not found',
            ], 404);
        }
    }

    /**
     * Delete a post
     *
     * @response PostActionResponse
     * @response 403 {
     *   "message": "Unauthorized"
     * }
     * @response 404 {
     *   "message": "Post not found"
     * }
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $post = Post::findOrFail($id);

            if ($post->user_id !== auth()->id()) {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 403);
            }

            $post->delete();

            return response()->json(
                new PostActionResponse(message: 'Post deleted successfully')
            );
        } catch (ModelNotFoundException) {
            return response()->json([
                'message' => 'Post not found',
            ], 404);
        }
    }

    /**
     * Like or unlike a post
     *
     * @response PostActionResponse
     * @response 403 {
     *   "message": "You cannot like your own post"
     * }
     * @response 404 {
     *   "message": "Post not found"
     * }
     */
    public function like(int $id): JsonResponse
    {
        try {
            $post = Post::findOrFail($id);

            if ($post->user_id === auth()->id()) {
                return response()->json([
                    'message' => 'You cannot like your own post',
                ], 403);
            }

            if ($post->isLikedBy(auth()->user())) {
                $post->likes()->where('user_id', auth()->id())->delete();
                $message = 'Post unliked successfully';
            } else {
                $post->likes()->create(['user_id' => auth()->id()]);
                $message = 'Post liked successfully';
            }

            return response()->json(new PostActionResponse(
                message: $message,
                likes_count: $post->likes()->count()
            ));
        } catch (ModelNotFoundException) {
            return response()->json([
                'message' => 'Post not found',
            ], 404);
        }
    }
}
