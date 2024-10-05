import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

export async function createProduct(data: any) {
  const response = await axios.post(`${API_BASE_URL}/products`, data)
  return response.data
}

export async function updateInventory(data: any) {
  const response = await axios.put(`${API_BASE_URL}/inventory`, data)
  return response.data
}

export async function setupStorefront(data: any) {
  const response = await axios.post(`${API_BASE_URL}/storefront`, data)
  return response.data
}

export async function importCSV(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await axios.post(`${API_BASE_URL}/import-csv`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export async function fetchSalesData() {
  const response = await axios.get(`${API_BASE_URL}/sales`)
  return response.data
}

export async function fetchProducts() {
  const response = await axios.get(`${API_BASE_URL}/products`)
  return response.data
}

export async function updateProductQuantity(productId: string, newQuantity: number) {
  const response = await axios.put(`${API_BASE_URL}/products/${productId}/quantity`, { quantity: newQuantity })
  return response.data
}