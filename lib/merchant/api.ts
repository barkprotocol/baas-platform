import { MerchantData, Product } from './types'

// These are mock API calls. In a real application, you would make actual API requests.

export async function fetchMerchantData(walletAddress: string): Promise<MerchantData> {
  // Simulated API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalProducts: 10,
        totalOrders: 50,
        totalRevenue: 100,
        averageOrderValue: 2,
        salesData: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          sales: Math.floor(Math.random() * 10)
        }))
      })
    }, 1000)
  })
}

export async function fetchMerchantProducts(walletAddress: string): Promise<Product[]> {
  // Simulated API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1',

 name: 'Product 1', description: 'Description 1', price: 1, stock: 10 },
        { id: '2', name: 'Product 2', description: 'Description 2', price: 2, stock: 20 },
        { id: '3', name: 'Product 3', description: 'Description 3', price: 3, stock: 30 },
      ])
    }, 1000)
  })
}