'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Notify from '../../../components/Notify'
import {
  WsBranchCheckout,
  WsUpdateCategories,
  WsUpdateLanguages,
  WsUpdateproducts,
  WsUpdateVendiSplash,
} from '../../../api/WebSocketCommands/WeBSocketCommandHelperApi'

export const PostUpdateVendiSplash = createAsyncThunk('Ws/postWsUpdateVendi', async (data, { rejectWithValue }) => {
  try {
    const response = await WsUpdateVendiSplash(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Something went wrong' })
  }
})

export const PostWsUpdateproducts = createAsyncThunk('Ws/postWsProduct', async (data, { rejectWithValue }) => {
  try {
    const response = await WsUpdateproducts(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Something went wrong' })
  }
})

export const PostWsBranchCheckout = createAsyncThunk('Ws/postWsBranchCheckout', async (data, { rejectWithValue }) => {
  try {
    const response = await WsBranchCheckout(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Something went wrong' })
  }
})

export const PostWsUpdateLanguages = createAsyncThunk('Ws/postWsUpdateLanguage', async (data, { rejectWithValue }) => {
  try {
    const response = await WsUpdateLanguages(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Something went wrong' })
  }
})

export const PostWsUpdateCategories = createAsyncThunk('Ws/postWsUpdateCategory', async (data, { rejectWithValue }) => {
  try {
    const response = await WsUpdateCategories(data)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Something went wrong' })
  }
})

const initialState = {
  ws: [],
  Wsloading: false,
  error: null,
}

export const WebSocketCommandSlice = createSlice({
  name: 'Role',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PostUpdateVendiSplash.pending, (state) => {
        state.Wsloading = true
      })
      .addCase(PostUpdateVendiSplash.fulfilled, (state, action) => {
        state.Wsloading = false
        if (action.payload?.statusCode === '200') {
          state.error = null
          Notify('success', action.payload.message)
        }
      })
      .addCase(PostUpdateVendiSplash.rejected, (state, action) => {
        state.Wsloading = false
        state.error = action.payload?.message || action.error.message
        Notify('error', action.payload?.message || 'Something went wrong')
      })

    builder
      .addCase(PostWsUpdateproducts.pending, (state) => {
        state.Wsloading = true
      })
      .addCase(PostWsUpdateproducts.fulfilled, (state, action) => {
        state.Wsloading = false
        if (action.payload?.statusCode === '200') {
          state.error = null
          Notify('success', action.payload.message)
        }
      })
      .addCase(PostWsUpdateproducts.rejected, (state, action) => {
        state.Wsloading = false
        state.error = action.payload?.message || action.error.message
        Notify('error', action.payload?.message || 'Something went wrong')
      })

    builder
      .addCase(PostWsBranchCheckout.pending, (state) => {
        state.Wsloading = true
      })
      .addCase(PostWsBranchCheckout.fulfilled, (state, action) => {
        state.Wsloading = false
        if (action.payload?.statusCode === '200') {
          state.error = null
          Notify('success', action.payload.message)
        }
      })
      .addCase(PostWsBranchCheckout.rejected, (state, action) => {
        state.Wsloading = false
        state.error = action.payload?.message || action.error.message
        Notify('error', action.payload?.message || 'Something went wrong')
      })

    builder
      .addCase(PostWsUpdateLanguages.pending, (state) => {
        state.Wsloading = true
      })
      .addCase(PostWsUpdateLanguages.fulfilled, (state, action) => {
        state.Wsloading = false
        if (action.payload?.statusCode === '200') {
          state.error = null
          Notify('success', action.payload.message)
        }
      })
      .addCase(PostWsUpdateLanguages.rejected, (state, action) => {
        state.Wsloading = false
        state.error = action.payload?.message || action.error.message
        Notify('error', action.payload?.message || 'Something went wrong')
      })

    builder
      .addCase(PostWsUpdateCategories.pending, (state) => {
        state.Wsloading = true
      })
      .addCase(PostWsUpdateCategories.fulfilled, (state, action) => {
        state.Wsloading = false
        Notify('success', 'Category updated successfully')
        // if (action.payload?.statusCode === '200') {
        //   state.error = null
        // }
      })
      .addCase(PostWsUpdateCategories.rejected, (state, action) => {
        state.Wsloading = false
        state.error = action.payload?.message || action.error.message
        Notify('error', action.payload?.message || 'Something went wrong')
      })
  },
})

export const {} = WebSocketCommandSlice.actions

export const AllWebSocketCommandSlice = (state) => state.AllWebSocketCommandSlice

export default WebSocketCommandSlice.reducer
