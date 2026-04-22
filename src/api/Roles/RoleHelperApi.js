import { axiosInstance } from '../axiosConfig'

export const AllRole = async () => {
  try {
    const response = await axiosInstance.get('roles')
    return response
  } catch (error) {
    throw error
  }
}
export const PostRole = async (data) => {
  try {
    const response = await axiosInstance.post('roles', data)
    return response
  } catch (error) {
    throw error
  }
}

export const AssignRole = async (data) => {
  try {
    const response = await axiosInstance.post('roles/assign', data)
    return response
  } catch (error) {
    throw error
  }
}


export const GetRoleById = async (data) => {
  try {
    const response = await axiosInstance.get(`roles/${data}`)
    return response
  } catch (error) {
    throw error
  }
}


export const UpdateRole = async (data) => {
  const { id, updatedData } = data
  try {
    const response = await axiosInstance.put(`roles/${id}`,{
        ...updatedData
    })
    return response
  } catch (error) {
    throw error
  }
}

export const DeleteRole = async (id) => {
  try {
    const response = await axiosInstance.delete(`roles/${id}`)
    return response
  } catch (error) {
    throw error
  }
}
