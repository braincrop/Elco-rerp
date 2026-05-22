import { axiosInstance } from '../axiosConfig'

export const GetConnectionsApi = async () => {
  const response = await axiosInstance.get('Auth/social/connections')
  return response.data
}

export const GetConnectUrlApi = async (provider) => {
  const response = await axiosInstance.get(`Auth/social/connect/${provider}`)
  return response.data
}

export const DisconnectProviderApi = async (provider) => {
  const response = await axiosInstance.delete(`Auth/social/disconnect/${provider}`)
  return response.data
}
