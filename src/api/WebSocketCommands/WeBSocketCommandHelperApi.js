import { axiosInstance, axiosLocal, } from "../axiosConfig"


export const WsUpdateVendiSplash = async (data) => {
  const { id, updatedData } = data
  console.log("updated-data",data)
    const response = await axiosInstance.post(`ws/${id}/update-splash`,{
      ...updatedData
    })
    return response.data
}   

export const WsUpdateproducts = async (data) => {
  const { id, updatedData } = data
   console.log("products-data",data)
    const response = await axiosInstance.post(`ws/${id}/update-specific-product`,{
      ...updatedData
    })
    return response.data
  
}

export const WsBranchCheckout = async (data) => {
  const { id, updatedData } = data
   console.log("updated-data",data)
    const response = await axiosInstance.post(`ws/${id}/checkout`,{
      ...updatedData
    })
    return response.data
}


export const WsUpdateLanguages = async (data) => {
  const { id, updatedData } = data
   console.log("language-data",data)
    const response = await axiosInstance.post(`ws/${id}/update-languages`,{
      ...updatedData
    })
    return response.data
}

