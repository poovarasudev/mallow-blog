import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post, CreatePostRequest } from '@/types/api';

interface PostsState {
    posts: Post[];
    currentPost: Post | null;
    loading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}

const initialState: PostsState = {
    posts: [],
    currentPost: null,
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        fetchPostsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchPostsSuccess: (state, action: PayloadAction<{ posts: Post[]; hasMore: boolean }>) => {
            state.loading = false;
            state.posts = state.page === 1
                ? action.payload.posts
                : [...state.posts, ...action.payload.posts];
            state.hasMore = action.payload.hasMore;
            state.page += 1;
            state.error = null;
        },
        fetchPostsFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetPosts: (state) => {
            state.posts = [];
            state.page = 1;
            state.hasMore = true;
            state.loading = false;
            state.error = null;
        },
        fetchPostRequest: (state, action: PayloadAction<number>) => {
            state.loading = true;
            state.error = null;
        },
        fetchPostSuccess: (state, action: PayloadAction<Post>) => {
            state.loading = false;
            state.currentPost = action.payload;
            state.error = null;
        },
        fetchPostFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        createPostRequest: (state, action: PayloadAction<CreatePostRequest>) => {
            state.loading = true;
            state.error = null;
        },
        createPostSuccess: (state, action: PayloadAction<Post>) => {
            state.loading = false;
            state.posts = [action.payload, ...state.posts];
            state.error = null;
        },
        createPostFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        likePostRequest: (state, action: PayloadAction<number>) => {
            state.loading = true;
            state.error = null;
        },
        likePostSuccess: (state, action: PayloadAction<{ id: number; liked: boolean }>) => {
            state.loading = false;
            state.posts = state.posts.map(post =>
                post.id === action.payload.id
                    ? {
                        ...post,
                        is_liked: action.payload.liked,
                        likes_count: action.payload.liked
                            ? post.likes_count + 1
                            : post.likes_count - 1,
                    }
                    : post
            );
            if (state.currentPost?.id === action.payload.id) {
                state.currentPost = {
                    ...state.currentPost,
                    is_liked: action.payload.liked,
                    likes_count: action.payload.liked
                        ? state.currentPost.likes_count + 1
                        : state.currentPost.likes_count - 1,
                };
            }
            state.error = null;
        },
        likePostFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchPostsRequest,
    fetchPostsSuccess,
    fetchPostsFailure,
    resetPosts,
    fetchPostRequest,
    fetchPostSuccess,
    fetchPostFailure,
    createPostRequest,
    createPostSuccess,
    createPostFailure,
    likePostRequest,
    likePostSuccess,
    likePostFailure,
} = postsSlice.actions;

export default postsSlice.reducer;
