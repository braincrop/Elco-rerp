'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Notify from '@/components/Notify'
import {
  Fetch2FAStatusApi,
  Setup2FAApi,
  Verify2FAApi,
  Disable2FAApi,
  GetBackupCodesApi,
  RegenBackupCodesApi,
  TwoFactorLoginApi,
  SendEmailOTPApi,
} from '../../../api/TwoFactor/TwoFactorHelperApi'

export const Fetch2FAStatus = createAsyncThunk('twoFactor/fetchStatus', async (_, { rejectWithValue }) => {
  try {
    return await Fetch2FAStatusApi()
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to fetch 2FA status' })
  }
})

// provider: 'Authenticator' | 'Email'
export const InitSetup2FA = createAsyncThunk('twoFactor/initSetup', async (provider, { rejectWithValue }) => {
  try {
    return await Setup2FAApi({ provider })
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to start 2FA setup' })
  }
})

// data: { code, provider }
export const ConfirmSetup2FA = createAsyncThunk('twoFactor/confirmSetup', async (data, { rejectWithValue }) => {
  try {
    return await Verify2FAApi(data)
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Invalid code' })
  }
})

export const Disable2FA = createAsyncThunk('twoFactor/disable', async (data, { rejectWithValue }) => {
  try {
    return await Disable2FAApi(data)
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to disable 2FA' })
  }
})

export const FetchBackupCodes = createAsyncThunk('twoFactor/fetchBackupCodes', async (_, { rejectWithValue }) => {
  try {
    return await GetBackupCodesApi()
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to fetch backup codes' })
  }
})

export const RegenBackupCodes = createAsyncThunk('twoFactor/regenBackupCodes', async (data, { rejectWithValue }) => {
  try {
    return await RegenBackupCodesApi(data)
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to regenerate backup codes' })
  }
})

export const CompleteTwoFactorLogin = createAsyncThunk('twoFactor/completeLogin', async (data, { rejectWithValue }) => {
  try {
    return await TwoFactorLoginApi(data)
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Invalid code' })
  }
})

export const SendEmailOTP = createAsyncThunk('twoFactor/sendEmailOTP', async (_, { rejectWithValue }) => {
  try {
    return await SendEmailOTPApi()
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to send OTP' })
  }
})

const initialState = {
  enabled: false,
  activatedAt: null,
  provider: null,
  loading: false,
  error: null,
  setupData: null,
  backupCodes: [],
  twoFactorRequired: false,
  tempToken: null,
}

export const TwoFactorSlice = createSlice({
  name: 'twoFactor',
  initialState,
  reducers: {
    clearSetupData(state) {
      state.setupData = null
    },
    clearTwoFactorAuth(state) {
      state.twoFactorRequired = false
      state.tempToken = null
    },
  },
  extraReducers(builder) {
    builder
      .addCase(Fetch2FAStatus.pending, (state) => { state.loading = true })
      .addCase(Fetch2FAStatus.fulfilled, (state, action) => {
        state.loading = false
        state.enabled = action.payload?.enabled ?? false
        state.activatedAt = action.payload?.activatedAt ?? null
        state.provider = action.payload?.provider ?? null
      })
      .addCase(Fetch2FAStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

    builder
      .addCase(InitSetup2FA.pending, (state) => { state.loading = true })
      .addCase(InitSetup2FA.fulfilled, (state, action) => {
        state.loading = false
        state.setupData = action.payload
      })
      .addCase(InitSetup2FA.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
        Notify('error', action.payload?.message || '2FA setup failed')
      })

    builder
      .addCase(ConfirmSetup2FA.pending, (state) => { state.loading = true })
      .addCase(ConfirmSetup2FA.fulfilled, (state, action) => {
        state.loading = false
        state.enabled = true
        state.setupData = null
        state.backupCodes = action.payload?.backupCodes ?? []
        state.provider = action.meta.arg?.provider ?? null
        Notify('success', 'Two-factor authentication enabled')
      })
      .addCase(ConfirmSetup2FA.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
        Notify('error', action.payload?.message || 'Invalid verification code')
      })

    builder
      .addCase(Disable2FA.pending, (state) => { state.loading = true })
      .addCase(Disable2FA.fulfilled, (state) => {
        state.loading = false
        state.enabled = false
        state.activatedAt = null
        state.provider = null
        Notify('success', 'Two-factor authentication disabled')
      })
      .addCase(Disable2FA.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
        Notify('error', action.payload?.message || 'Failed to disable 2FA')
      })

    builder
      .addCase(FetchBackupCodes.pending, (state) => { state.loading = true })
      .addCase(FetchBackupCodes.fulfilled, (state, action) => {
        state.loading = false
        state.backupCodes = action.payload?.codes ?? []
      })
      .addCase(FetchBackupCodes.rejected, (state, action) => {
        state.loading = false
        Notify('error', action.payload?.message || 'Failed to fetch backup codes')
      })

    builder
      .addCase(RegenBackupCodes.pending, (state) => { state.loading = true })
      .addCase(RegenBackupCodes.fulfilled, (state, action) => {
        state.loading = false
        state.backupCodes = action.payload?.codes ?? []
        Notify('success', 'Backup codes regenerated')
      })
      .addCase(RegenBackupCodes.rejected, (state, action) => {
        state.loading = false
        Notify('error', action.payload?.message || 'Failed to regenerate backup codes')
      })

    builder
      .addCase(CompleteTwoFactorLogin.pending, (state) => { state.loading = true })
      .addCase(CompleteTwoFactorLogin.fulfilled, (state, action) => {
        state.loading = false
        state.twoFactorRequired = false
        state.tempToken = null
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload?.token)
          document.cookie = `token=${action.payload?.token}; path=/; sameSite=lax;`
        }
      })
      .addCase(CompleteTwoFactorLogin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
        Notify('error', action.payload?.message || 'Invalid authentication code')
      })

    builder
      .addCase(SendEmailOTP.pending, (state) => { state.loading = true })
      .addCase(SendEmailOTP.fulfilled, (state) => {
        state.loading = false
        Notify('success', 'OTP sent to your email')
      })
      .addCase(SendEmailOTP.rejected, (state, action) => {
        state.loading = false
        Notify('error', action.payload?.message || 'Failed to send OTP')
      })
  },
})

export const { clearSetupData, clearTwoFactorAuth } = TwoFactorSlice.actions
export const selectTwoFactor = (state) => state.twoFactor
export default TwoFactorSlice.reducer
