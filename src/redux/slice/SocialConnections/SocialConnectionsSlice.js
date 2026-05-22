'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Notify from '@/components/Notify'
import {
  GetConnectionsApi,
  GetConnectUrlApi,
  DisconnectProviderApi,
} from '../../../api/SocialConnections/SocialConnectionsHelperApi'

export const FetchConnections = createAsyncThunk('socialConnections/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await GetConnectionsApi()
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Failed to load connected accounts' })
  }
})

export const InitiateConnect = createAsyncThunk('socialConnections/initiate', async (provider, { rejectWithValue }) => {
  try {
    return await GetConnectUrlApi(provider)
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: `Failed to connect ${provider}` })
  }
})

export const DisconnectSocial = createAsyncThunk('socialConnections/disconnect', async (provider, { rejectWithValue }) => {
  try {
    await DisconnectProviderApi(provider)
    return { provider }
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: `Failed to disconnect ${provider}` })
  }
})

const initialState = {
  connections: [],
  loading: false,
  error: null,
}

export const SocialConnectionsSlice = createSlice({
  name: 'socialConnections',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(FetchConnections.pending, (state) => { state.loading = true })
      .addCase(FetchConnections.fulfilled, (state, action) => {
        state.loading = false
        state.connections = action.payload?.connections ?? []
      })
      .addCase(FetchConnections.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message
      })

    builder
      .addCase(InitiateConnect.pending, (state) => { state.loading = true })
      .addCase(InitiateConnect.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload?.redirectUrl && typeof window !== 'undefined') {
          window.location.href = action.payload.redirectUrl
        }
      })
      .addCase(InitiateConnect.rejected, (state, action) => {
        state.loading = false
        Notify('error', action.payload?.message || 'Failed to initiate connection')
      })

    builder
      .addCase(DisconnectSocial.pending, (state) => { state.loading = true })
      .addCase(DisconnectSocial.fulfilled, (state, action) => {
        state.loading = false
        state.connections = state.connections.filter((c) => c.provider !== action.payload.provider)
        Notify('success', 'Account disconnected')
      })
      .addCase(DisconnectSocial.rejected, (state, action) => {
        state.loading = false
        Notify('error', action.payload?.message || 'Failed to disconnect account')
      })
  },
})

export const selectSocialConnections = (state) => state.socialConnections
export default SocialConnectionsSlice.reducer
