'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Notify from '../../../components/Notify'
import { GetSaleLogs } from '../../../api/SaleLogs/SaleLogHelperApi'

export const GetAllSaleLogs = createAsyncThunk('SaleLog/GetAllSalelogs', async (data) => {
  try {
    const response = await GetSaleLogs(data)
    return response
  } catch (error) {
    throw Error('Failed to fetch logs')
  }
})

const initialState = {
  salelogs: null,
  loading: false,
  error: null,
  saleLogsFetched: false,
}

export const SaleLogSlice = createSlice({
  name: 'Salelogs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(GetAllSaleLogs.pending, (state) => {
        state.loading = true
        state.saleLogsFetched = false
      })

      .addCase(GetAllSaleLogs.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.saleLogsFetched = true
        state.salelogs = action.payload?.data?.items || []
      })

      .addCase(GetAllSaleLogs.rejected, (state, action) => {
        state.loading = false
        state.saleLogsFetched = true
        state.error = action.payload || action.error.message
        state.salelogs = []
      })
  },
})

export const {} = SaleLogSlice.actions

export const AllSalelogs = (state) => state.AllSalelogs

export default SaleLogSlice.reducer
