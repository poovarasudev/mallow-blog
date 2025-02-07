import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  verifyEmailRequest,
  verifyEmailSuccess,
  verifyEmailFailure,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFailure,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFailure,
} from '../slices/authSlice';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthResponse,
} from '@/types/api';

function* login(action: PayloadAction<LoginRequest>) {
  try {
    const response: { data: AuthResponse } = yield call(api.post, '/login', action.payload);
    yield put(loginSuccess(response.data));
  } catch (error: any) {
    yield put(loginFailure(error.response?.data?.message || 'Login failed'));
  }
}

function* register(action: PayloadAction<RegisterRequest>) {
  try {
    const response: { data: AuthResponse } = yield call(api.post, '/register', action.payload);
    yield put(registerSuccess(response.data));
  } catch (error: any) {
    yield put(registerFailure(error.response?.data?.message || 'Registration failed'));
  }
}

function* verifyEmail(action: PayloadAction<{ id: string; hash: string }>) {
  try {
    yield call(api.get, `/email/verify/${action.payload.id}/${action.payload.hash}`);
    yield put(verifyEmailSuccess());
  } catch (error: any) {
    yield put(verifyEmailFailure(error.response?.data?.message || 'Email verification failed'));
  }
}

function* forgotPassword(action: PayloadAction<ForgotPasswordRequest>) {
  try {
    yield call(api.post, '/forgot-password', action.payload);
    yield put(forgotPasswordSuccess());
  } catch (error: any) {
    yield put(forgotPasswordFailure(error.response?.data?.message || 'Failed to send reset link'));
  }
}

function* resetPassword(action: PayloadAction<ResetPasswordRequest>) {
  try {
    yield call(api.post, '/reset-password', action.payload);
    yield put(resetPasswordSuccess());
  } catch (error: any) {
    yield put(resetPasswordFailure(error.response?.data?.message || 'Failed to reset password'));
  }
}

export function* watchAuth() {
  yield takeLatest(loginRequest.type, login);
  yield takeLatest(registerRequest.type, register);
  yield takeLatest(verifyEmailRequest.type, verifyEmail);
  yield takeLatest(forgotPasswordRequest.type, forgotPassword);
  yield takeLatest(resetPasswordRequest.type, resetPassword);
}