export interface Product {
    id: string
    name: string
    description: string
    price: number
    stock: number
  }
  
  export interface SalesData {
    date: string
    sales: number
  }
  
  export interface MerchantData {
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    averageOrderValue: number
    salesData: SalesData[]
  }