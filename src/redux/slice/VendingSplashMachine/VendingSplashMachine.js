import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Notify from '../../../components/Notify'
import {
  AllVendiSplashMachine,
  PostVendiSplashMachine,
  UpdateVendiSplashMachine,
  DeleteVendingSplashMachine,
  AssignVmSplashToDevice,
} from '../../../api/VendingSplashMachine/VendingSplashHelperApi'

export const GetAllVendiMachine = createAsyncThunk('VendiMachine/AllVendiMachine', async () => {
  try {
    const response = await AllVendiSplashMachine()
    const _response = {
      data: response.data,
      status: response.status,
    }
    return _response
  } catch (error) {
    throw Error('Failed to fetch VendiMachine')
  }
})

export const PostVendiMachine = createAsyncThunk('VendiMachine/postVendiMachine', async (data, { rejectWithValue }) => {
  try {
    const response = await PostVendiSplashMachine(data)
    return response.data
  } catch (error) {
    return rejectWithValue('Failed to post VendiMachine')
  }
})

export const AssignVendiMachineToDevice = createAsyncThunk('VendiMachine/assignVendiMachineToDevice', async (data, { rejectWithValue }) => {
  try {
    const response = await AssignVmSplashToDevice(data)
    return response.data
  } catch (error) {
    return rejectWithValue('Failed to assign VendiMachine to device')
  }
})

export const UpdatedVendiMachine = createAsyncThunk('VendiMachine/UpdateVendiMachine', async (data, { rejectWithValue }) => {
  try {
    const response = await UpdateVendiSplashMachine(data)
    return response.data
  } catch (error) {
    return rejectWithValue('Failed to update VendiMachine')
  }
})

export const DeleteVendiMachine = createAsyncThunk('VendiMachine/DeleteVendiMachine', async (data, { rejectWithValue }) => {
  try {
    const response = await DeleteVendingSplashMachine(data)
    return response.data
  } catch (error) {
    return rejectWithValue('Failed to delete VendiMachine')
  }
})

const initialState = {
  VendiMachine: [],
  loading: false,
  error: null,
}

export const VendiSplashMachineSlice = createSlice({
  name: 'Vendi Splash Machine ',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PostVendiMachine.pending, (state) => {
        state.loading = true
      })
      .addCase(PostVendiMachine.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload?.statusCode === '201') {
          state.error = null
          state.VendiMachine.unshift(action.payload.data)
          Notify('success', action.payload.message)
        }
      })
      .addCase(PostVendiMachine.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })

    builder
      .addCase(AssignVendiMachineToDevice.pending, (state) => {
        state.loading = true
      })
      .addCase(AssignVendiMachineToDevice.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload?.statusCode === '200') {
          state.error = null
          Notify('success', action.payload.message)
        }
      })
      .addCase(AssignVendiMachineToDevice.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })

    builder
      .addCase(UpdatedVendiMachine.pending, (state) => {
        state.loading = true
      })
      .addCase(UpdatedVendiMachine.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload?.statusCode === '200') {
          state.VendiMachine = state.VendiMachine.map((item) => (item.vmSplashId === action.payload.data.vmSplashId ? action.payload.data : item))
          Notify('success', action.payload.message)
        }
      })
      .addCase(UpdatedVendiMachine.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })

    builder
      .addCase(GetAllVendiMachine.pending, (state) => {
        state.loading = true
      })
      .addCase(GetAllVendiMachine.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.VendiMachine = action.payload?.data.data
      })
      .addCase(GetAllVendiMachine.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
    builder
      .addCase(DeleteVendiMachine.pending, (state) => {
        state.loading = true
      })
      .addCase(DeleteVendiMachine.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload?.statusCode === '204') {
          state.error = null
          const deletedId = action.meta.arg
          state.VendiMachine = state.VendiMachine.filter((item) => item.vmSplashId !== deletedId)
          Notify('success', action.payload.message)
        }
      })
      .addCase(DeleteVendiMachine.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })
  },
})

export const {} = VendiSplashMachineSlice.actions
export const allVendiSplashMachine = (state) => state.allVendiSplashMachine
export default VendiSplashMachineSlice.reducer
