import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Donation, DONATION_TYPES } from "@/types/donation"

interface DonationCardProps {
  donation: Donation
}

export function DonationCard({ donation }: DonationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{donation.name}</CardTitle>
        <CardDescription>{donation.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-bold">{donation.amount} BARK</span>
          </div>
          <div className="flex justify-between">
            <span>Type:</span>
            <span>{DONATION_TYPES.find(t => t.value === donation.donationType)?.label}</span>
          </div>
          <div className="flex justify-between">
            <span>Recipient:</span>
            <span className="truncate" title={donation.recipientAddress}>
              {donation.recipientAddress.slice(0, 6)}...{donation.recipientAddress.slice(-4)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Recurring:</span>
            <span>{donation.isRecurring ? `Yes (${donation.recurringFrequency})` : 'No'}</span>
          </div>
          <div className="flex justify-between">
            <span>Created:</span>
            <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}