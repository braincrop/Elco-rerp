'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Notify from '@/components/Notify'
import { DeleteUser, GetAllUser, GetSingleUser, RegisterUser, UpdateUser } from '../../../api/UserManagement/UserManagementHelperApi'
import { AssignRole } from '@/api/Roles/RoleHelperApi'

export const AllUser = createAsyncThunk('UserManagement/AllUser', async (_, { rejectWithValue }) => {
  try {
    const response = await GetAllUser()
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Something went wrong' })
  }
})

export const GetUser = createAsyncThunk('UserManagement/GetSingleUser', async (data, { rejectWithValue }) => {
  try {
    const response = await GetSingleUser(data)
    return response.data
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Something went wrong' })
  }
})


export const PostUser = createAsyncThunk('UserManagement/PostUser', async (data, { rejectWithValue }) => {
  try {
    const response = await RegisterUser(data)
    return response
  } catch (error) {
    return rejectWithValue('Failed to post users')
  }
})

export const UpdatedUserInfo = createAsyncThunk('UserManagement/UpdateUserInfo', async (data, { rejectWithValue }) => {
  try {
    const response = await UpdateUser(data)
    return response
  } catch (error) {
    return rejectWithValue('Failed to update UserInfo')
  }
})

export const DeleteUserInfo = createAsyncThunk('UserManagement/Delete', async (data, { rejectWithValue }) => {
  try {
    const response = await DeleteUser(data)
    return response
  } catch (error) {
    return rejectWithValue('Failed to delete User')
  }
})

const initialState = {
  users: [],
  singleUser: [],
  loading: false,
  error: null,
}

export const UserManagement = createSlice({
  name: 'UserManagement',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(AllUser.pending, (state) => {
        state.loading = true
      })
      .addCase(AllUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.data
      })
      .addCase(AllUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error.message
      })

       builder
      .addCase(GetUser.pending, (state) => {
        state.loading = true
      })
      .addCase(GetUser.fulfilled, (state, action) => {
        state.loading = false
        state.singleUser = action.payload.data
      })
      .addCase(GetUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error.message
      })

    builder
      .addCase(PostUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(PostUser.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload?.statusCode === '201') {
          state.error = null
          state.users.unshift(action.payload.data)
          Notify('success', action.payload.message)
        }
      })
      .addCase(PostUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || action.error?.message || 'Something went wrong'
        Notify('error', state.error)
      })

    builder
      .addCase(UpdatedUserInfo.pending, (state) => {
        state.loading = true
      })
      .addCase(UpdatedUserInfo.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload?.statusCode === '200') {
          state.users = state.users.map((item) => (item.id === action.payload.data.id ? action.payload.data : item))
          Notify('success', action.payload.message)
        }
      })
      .addCase(UpdatedUserInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
        Notify('error', action.payload?.message || 'Something went wrong')
      })
    builder
      .addCase(DeleteUserInfo.pending, (state) => {
        state.loading = true
      })
      .addCase(DeleteUserInfo.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload?.statusCode === '204') {
          state.error = null
          const deletedId = action.meta.arg
          state.users = state.users.filter((item) => item.id !== deletedId)
          Notify('success', action.payload.message)
        }
      })
      .addCase(DeleteUserInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
        Notify('error', action.payload?.message || 'Something went wrong')
      })
  },
})

export const {} = UserManagement.actions

export const AllUserManagement = (state) => state.AllUserManagement

export default UserManagement.reducer
