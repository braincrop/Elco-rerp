'use client'
import { loginInstance,axiosInstance } from '../axiosConfig'

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

export const ResetUserPass = async (data) => {
  console.log('ResetUserPass data:', data);
  const response = await loginInstance.post(`Auth/ResetPassword/${data.email}/${data.encodedToken}`, data.body)
  return response.data
}

export const Send2FACode = async (data) => {
  console.log('Send2FACode data:', data);
  const response = await loginInstance.post(`Auth/SendEmailTwoFactorOTP/${data}`)
  return response.data
}

export const SendPasswordLink = async (data) => {
  const response = await loginInstance.post(`/Auth/SendResetPasswordLink/${data.email}`)
  return response.data
}

export const Manage2FAType = async (data) => {
  console.log('Manage2FAType data:', data);
  const response = await axiosInstance.post('/Auth/Manage2FA', data)
  return response.data
}

export const Enable2FAAuth = async (data) => {
  console.log('Manage2FAType data:', data);
  const response = await axiosInstance.post('/Auth/Enable2FA', data)
  return response.data
}

