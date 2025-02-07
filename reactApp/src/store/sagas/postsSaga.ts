import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import {
  fetchPostsRequest,
  fetchPostsSuccess,
  fetchPostsFailure,
  fetchPostRequest,
  fetchPostSuccess,
  fetchPostFailure,
  createPostRequest,
  createPostSuccess,
  createPostFailure,
  likePostRequest,
  likePostSuccess,
  likePostFailure,
} from '../slices/postsSlice';
import { Post, CreatePostRequest } from '@/types/api';

function* fetchPosts() {
  try {
    const response: { data: Post[] } = yield call(api.get, '/posts');
    yield put(fetchPostsSuccess(response.data));
  } catch (error: any) {
    yield put(fetchPostsFailure(error.response?.data?.message || 'Failed to fetch posts'));
  }
}

function* fetchPost(action: PayloadAction<number>) {
  try {
    const response: { data: Post } = yield call(api.get, `/posts/${action.payload}`);
    yield put(fetchPostSuccess(response.data));
  } catch (error: any) {
    yield put(fetchPostFailure(error.response?.data?.message || 'Failed to fetch post'));
  }
}

function* createPost(action: PayloadAction<CreatePostRequest>) {
  try {
    const response: { data: Post } = yield call(api.post, '/posts', action.payload);
    yield put(createPostSuccess(response.data));
  } catch (error: any) {
    yield put(createPostFailure(error.response?.data?.message || 'Failed to create post'));
  }
}

function* likePost(action: PayloadAction<number>) {
  try {
    const response: { data: { liked: boolean } } = yield call(api.post, `/posts/${action.payload}/like`);
    yield put(likePostSuccess({ id: action.payload, liked: response.data.liked }));
  } catch (error: any) {
    yield put(likePostFailure(error.response?.data?.message || 'Failed to like post'));
  }
}

export function* watchPosts() {
  yield takeLatest(fetchPostsRequest.type, fetchPosts);
  yield takeLatest(fetchPostRequest.type, fetchPost);
  yield takeLatest(createPostRequest.type, createPost);
  yield takeLatest(likePostRequest.type, likePost);
}