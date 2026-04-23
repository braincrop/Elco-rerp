'use client'
import { axiosInstance } from '../axiosConfig'

export const AllVendiSplashMachine = async () => {
  try {
    const response = await axiosInstance.get('v1/VmSplash')
    return response
  } catch (error) {
    throw error
  }
}

export const PostVendiSplashMachine = async (data) => {
  try {
    const response = await axiosInstance.post('v1/VmSplash', data)
    return response
  } catch (error) {
    throw error
  }
}

export const AssignVmSplashToDevice = async (data) => {
  try {
    const response = await axiosInstance.post('v1/VmSplash/assign-devices', data)
    return response
  } catch (error) {
    throw error
  }
}


export const UpdateVendiSplashMachine = async (data) => {
  const { id, updatedData } = data

  try {
    const response = await axiosInstance.put(`v1/VmSplash/${id}`, {
      ...updatedData,
    })
    return response
  } catch (error) {
    throw error
  }
}

export const DeleteVendingSplashMachine = async (id) => {
  try {
    const response = await axiosInstance.delete(`v1/VmSplash/${id}`)
    return response
  } catch (error) {
    throw error
  }
}
