import { axiosLocal,axiosInstance } from '../axiosConfig'

export const GetSaleLogs = async (data) => {
    console.log('data---', data)
  try {
    const response = await axiosInstance.get('SalesLog/search',{
      params: {
        ...data,
      },
    })
    return response.data
  } catch (error) {
    throw error
  }
}