'use client'
import { axiosInstance } from '../axiosConfig'

export const GetAllUser = async () => {
  try {
    const response = await axiosInstance.get('users')
    return response
  } catch (error) {
    throw error
  }
}

export const GetSingleUser = async (id) => {
  try {
    const response = await axiosInstance.get(`users/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

export const RegisterUser = async (data) => {
  try {
    const response = await axiosInstance.post('users', data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const UpdateUser= async (data) => {
  const { id, updatedData } = data
  try {
    const response = await axiosInstance.put(`users/${id}`, {
      ...updatedData,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const DeleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`users/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
