'use client'
import { loginInstance } from '../axiosConfig'

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID

export const RegisterUser = async (data) => {
  const response = await loginInstance.post(`Auth/register?clientId=${clientId}`, data)
  return response.data
}

export const LoginUser = async (data) => {
  const response = await loginInstance.post(`Auth/login?clientId=${clientId}`, data)
  return response.data
}

export const ForgotUserPass = async (data) => {
  const response = await loginInstance.post('users/reset-password-simple', data)
  return response.data
}
