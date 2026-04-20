import { axiosInstance } from '../axiosConfig'

export const GetTranslationData = async () => {
  try {
    const response = await axiosInstance.get('translations/base')
    return response.data
  } catch (error) {
    throw error
  }
}

export const GetSingleTranslation = async (data) => {
  try {
    const response = await axiosInstance.get(`translations/${data}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const GetAllTranslation = async () => {
  try {
    const response = await axiosInstance.get('translations')
    return response.data
  } catch (error) {
    throw error
  }
}

export const PostTanslation = async (data) => {
  try {
    const response = await axiosInstance.post('translations', data)
    return response.data
  } catch (error) {
    throw error
  }
}

export const PostAssignTranslation = async (data) => {
  try {
    const response = await axiosInstance.post('translations/assign-to-branches', data)
    return response.data
  } catch (error) {
    throw error
  }
}


export const UpdateTranlsation= async (data) => {
  const { id, updatedData } = data
  try {
    const response = await axiosInstance.put(`translations/${id}`, {
      ...updatedData,
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const DeleteTranslation = async (id) => {
  try {
    const response = await axiosInstance.delete(`translations/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}
