'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Notify from '@/components/Notify'
import { ForgotUserPass, LoginUser, RegisterUser, ResetUserPass } from '../../../api/Authentication/AuthHelperApi'

export const Registration = createAsyncThunk('Auth/Registration', async (data, { rejectWithValue }) => {
  try {
    const response = await RegisterUser(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Something went wrong' })
  }
})

export const Login = createAsyncThunk('Auth/Login', async (data, { rejectWithValue }) => {
  try {
    const response = await LoginUser(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Something went wrong' })
  }
})

export const ForgotPassword = createAsyncThunk('Auth/ForgotPassword', async (data, { rejectWithValue }) => {
  try {
    const response = await ForgotUserPass(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Something went wrong' })
  }
})

export const ResetPassword = createAsyncThunk('Auth/ResetPassword', async (data, { rejectWithValue }) => {
  try {
    const response = await ResetUserPass(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Reset failed' })
  }
})

const initialState = {
  devices: [],
  loading: false,
  error: null,
  twoFactorRequired: false,
  tempToken: null,
  twoFactorProvider: null,
}

export const Authentication = createSlice({
  name: 'allUser',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(Registration.pending, (state) => {
        state.loading = true
      })
      .addCase(Registration.fulfilled, (state, action) => {
        state.loading = false
        Notify('success', action.payload?.message || 'User registered successfully')
      })
      .addCase(Registration.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error.message
        Notify('error', action.payload?.message || 'Registration failed')
      })

    builder
      .addCase(ForgotPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(ForgotPassword.fulfilled, (state, action) => {
        state.loading = false
        Notify('success', action.payload?.message || 'Reset link sent — check your inbox')
      })
      .addCase(ForgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error.message
        Notify('error', action.payload?.message || 'Something went wrong')
      })

    builder
      .addCase(ResetPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(ResetPassword.fulfilled, (state, action) => {
        state.loading = false
        Notify('success', action.payload?.message || 'Password reset successfully')
      })
      .addCase(ResetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error.message
        Notify('error', action.payload?.message || 'Reset failed — link may have expired')
      })

    builder
      .addCase(Login.pending, (state) => {
        state.loading = true
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload?.requiresTwoFactor) {
          state.twoFactorRequired = true
          state.tempToken = action.payload.tempToken ?? null
          state.twoFactorProvider = action.payload.provider ?? null
        } else if (typeof window !== 'undefined') {
          state.twoFactorRequired = false
          state.tempToken = null
          state.twoFactorProvider = null
          localStorage.setItem('token', action.payload?.token)
          document.cookie = `token=${action.payload?.token}; path=/; sameSite=lax;`
        }
      })
      .addCase(Login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error.message
        Notify('error', action.payload?.message || 'Login failed')
      })
  },
})

export const {} = Authentication.actions

export const allUser = (state) => state.allUser

export default Authentication.reducer
