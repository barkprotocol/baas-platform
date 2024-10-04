import { Metadata } from 'next'
import CommerceDashboard from './commerce-dashboard'

export const metadata: Metadata = {
  title: 'Commerce Dashboard | BARK BaaS Platform',
  description: 'Manage your products, inventory, and sales on the BARK BaaS Platform.',
}

export default function CommercePage() {
  return <CommerceDashboard />
}