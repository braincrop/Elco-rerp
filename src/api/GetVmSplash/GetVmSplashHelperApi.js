import { socketInstance } from '../axiosConfig'

const apiKey = process.env.NEXT_PUBLIC_API_KEY
export const GetAllVmSplash = async (ip) => {
  try {
    const response = await socketInstance.get(`v1/VmSplash/GetSplashPath/${ip}`,{
        headers: {
          "Content-Type": "application/json",
           "x-api-key": apiKey,
        },
    })
    console.log("Response:", response)
  } catch (error) {
    throw error
  }
}

export const GetAllMachineProducts = async (ip) => {
  // console.log("Getting machine products for IP:", ip)
  try {
    const response = await socketInstance.get(`v1/MachineSync/GetAllRestaurantItemsByIp/${ip}`,{
        headers: {
           "x-api-key": apiKey,
        },
    })
    return response
  } catch (error) {
    throw error
  }
}