'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Notify from '@/components/Notify'
import { ForgotUserPass, LoginUser, RegisterUser, ResetUserPass, SendPasswordLink } from '../../../api/Authentication/AuthHelperApi'

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

export const ResetUserPassword = createAsyncThunk('Auth/ResetPassword', async (data, { rejectWithValue }) => {
  try {
    const response = await ResetUserPass(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Something went wrong' })
  }
})

export const SendPasswordLi = createAsyncThunk('Auth/SendPasswordLink', async (data, { rejectWithValue }) => {
  try {
    const response = await SendPasswordLink(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Something went wrong' })
  }
})

const initialState = {
  devices: [],
  loading: false,
  error: null,
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
        Notify('success', action.payload?.message || 'Forgot password successfully')
      })
      .addCase(ForgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error.message
        Notify('error', action.payload?.message || 'Something went wrong')
      })

       builder
      .addCase(ResetUserPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(ResetUserPassword.fulfilled, (state, action) => {
        state.loading = false
        Notify('success', action.payload?.message || 'Reset password successfully')
      })
      .addCase(ResetUserPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error.message
        Notify('error', action.payload?.message || 'Something went wrong')
      })

       builder
      .addCase(SendPasswordLi.pending, (state) => {
        state.loading = true
      })
      .addCase(SendPasswordLi.fulfilled, (state, action) => {
        state.loading = false
        Notify('success', action.payload?.message || 'Reset password successfully')
      })
      .addCase(SendPasswordLi.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error.message
        Notify('error', action.payload?.message || 'Something went wrong')
      })



    builder
      .addCase(Login.pending, (state) => {
        state.loading = true
      })
      .addCase(Login.fulfilled, (state, action) => {
        state.loading = false
        if(typeof window !== 'undefined'){
           localStorage.setItem('token', action.payload?.token)
           document.cookie = `token=${action.payload?.token}; path=/; sameSite=lax;`
        }
        // console.log('dataa--', action.payload)
        //  Notify('success', action.payload?.message || 'Login successfully')
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
