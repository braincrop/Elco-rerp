import { axiosInstance, loginInstance } from '../axiosConfig'

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID

export const Fetch2FAStatusApi = async () => {
  const response = await axiosInstance.get('Auth/2fa/status')
  return response.data
}

export const Setup2FAApi = async (data) => {
  const response = await axiosInstance.post('Auth/2fa/setup', data)
  return response.data
}

export const Verify2FAApi = async (data) => {
  const response = await axiosInstance.post('Auth/2fa/verify', data)
  return response.data
}

export const Disable2FAApi = async (data) => {
  const response = await axiosInstance.post('Auth/2fa/disable', data)
  return response.data
}

export const GetBackupCodesApi = async () => {
  const response = await axiosInstance.get('Auth/2fa/backup-codes')
  return response.data
}

export const RegenBackupCodesApi = async (data) => {
  const response = await axiosInstance.post('Auth/2fa/backup-codes/regenerate', data)
  return response.data
}

export const TwoFactorLoginApi = async (data) => {
  const response = await loginInstance.post(`Auth/2fa/login?clientId=${clientId}`, data)
  return response.data
}

export const SendEmailOTPApi = async () => {
  const response = await axiosInstance.post('Auth/2fa/send-code')
  return response.data
}
