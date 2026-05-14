'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Notify from '../../../components/Notify'
import {
  AllProducts,
  PostProducts,
  UpdateProducts,
  DeleteProduct,
  GetSingleByIdProducts,
  PostBulkUpsertProduct,
  GetProductBySingleId,
} from '../../../api/products/productHelperApi'
import { GetAllMachineProducts } from '../../../api/GetVmSplash/GetVmSplashHelperApi'

export const GetAllProduct = createAsyncThunk('Product/AllProduct', async () => {
  try {
    const response = await AllProducts()
    const _response = {
      data: response.data,
      status: response.status,
    }
    return _response
  } catch (error) {
    throw Error('Failed to fetch Product')
  }
})

export const PostProduct = createAsyncThunk('Product/postProduct', async (data, { rejectWithValue }) => {
  try {
    const response = await PostProducts(data)
    return response.data
  } catch (error) {
    return rejectWithValue('Failed to post product')
  }
})

export const PostProductBulkUpsert = createAsyncThunk('Product/postProductBulkUpsert', async (data, { rejectWithValue }) => {
  try {
    const response = await PostBulkUpsertProduct(data)
    return response.data
  } catch (error) {
    return rejectWithValue('Failed to post product')
  }
})

export const GetSingleProduct = createAsyncThunk('Product/SingleProductById', async (data, { rejectWithValue }) => {
  try {
    const response = await GetProductBySingleId(data)
    return response.data
  } catch (error) {
    return rejectWithValue('Failed to get single product')
  }
})

export const UpdatedProduct = createAsyncThunk('Product/UpdateProduct', async (data, { rejectWithValue }) => {
  try {
    const response = await UpdateProducts(data)
    return response.data
  } catch (error) {
    return rejectWithValue('Failed to update Product')
  }
})

export const DeleteProductData = createAsyncThunk('Product/DeleteProduct', async (data, { rejectWithValue }) => {
  try {
    const response = await DeleteProduct(data)
    return response.data
  } catch (error) {
    return rejectWithValue('Failed to delete product')
  }
})

export const GetMachineProducts = createAsyncThunk('Product/AllMachineProducts', async (data, { rejectWithValue }) => {
  try {
    const response = await GetAllMachineProducts(data)
    return response.data
  } catch (error) {
    return rejectWithValue('Failed to get machine products')
  }
})

const initialState = {
  product: [],
  singleProduct: [],
  machineProducts: [],
  loading: false,
  loadingproducts: false,
  error: null,
}

export const ProductSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(PostProduct.pending, (state) => {
        state.loading = true
      })
      .addCase(PostProduct.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload?.statusCode === '201') {
          state.error = null
          state.product.unshift(action.payload.data)
          Notify('success', action.payload.message)
        }
      })
      .addCase(PostProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })

    builder
      .addCase(PostProductBulkUpsert.pending, (state) => {
        state.loading = true
      })
      .addCase(PostProductBulkUpsert.fulfilled, (state, action) => {
        state.loading = false
        console.log('PostProductBulkUpsert--', action.payload)
        if (action.payload?.statusCode === '200') {
          state.error = null
          Notify('success', action.payload.message)
        }
      })
      .addCase(PostProductBulkUpsert.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })

    builder
      .addCase(UpdatedProduct.pending, (state) => {
        state.loading = true
      })
      .addCase(UpdatedProduct.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload?.statusCode === '200') {
          state.product = state.product.map((item) => (item.dpid === action.payload.data.dpid ? action.payload.data : item))
          Notify('success', action.payload.message)
        }
      })
      .addCase(UpdatedProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || action.error.message
      })

    builder
      .addCase(GetAllProduct.pending, (state) => {
        state.loading = true
      })
      .addCase(GetAllProduct.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.product = action.payload?.data.data
      })
      .addCase(GetAllProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

    builder
      .addCase(GetSingleProduct.pending, (state) => {
        state.loading = true
      })
      .addCase(GetSingleProduct.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.singleProduct = action.payload?.data
      })
      .addCase(GetSingleProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

    builder
      .addCase(DeleteProductData.pending, (state) => {
        state.loading = true
      })
      .addCase(DeleteProductData.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload?.statusCode === '204') {
          state.error = null
          const deletedId = action.meta.arg
          state.product = state.product.filter((item) => item.dpid !== deletedId)
          Notify('success', action.payload.message)
        }
      })
      .addCase(DeleteProductData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

       builder
      .addCase(GetMachineProducts.pending, (state) => {
        state.loadingproducts = true
        state.error = null
        state.machineProducts = []
      })
      .addCase(GetMachineProducts.fulfilled, (state, action) => {
        state.loadingproducts = false
        state.machineProducts = action.payload?.data || []
      })
      .addCase(GetMachineProducts.rejected, (state, action) => {
        state.loadingproducts = false
        state.error = action.error.message
        state.machineProducts = []
      })
  },
})

export const {} = ProductSlice.actions

export const allProducts = (state) => state.allProducts

export default ProductSlice.reducer
