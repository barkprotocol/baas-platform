// Define an interface for a donation campaign
export interface DonationCampaign {
    id: string; // Unique identifier for the campaign
    title: string; // Title of the donation campaign
    description: string; // Description of the campaign
    targetAmount: number; // Target amount to be raised for the campaign
    currentAmount: number; // Current amount raised
    startDate: Date; // Start date of the campaign
    endDate: Date; // End date of the campaign
    status: CampaignStatus; // Current status of the campaign (e.g., ACTIVE, COMPLETED, CANCELLED)
    creatorId: string; // ID of the user who created the campaign
    metadata?: string; // Optional metadata related to the campaign
  }
  
  // Define possible statuses for a donation campaign
  export enum CampaignStatus {
    ACTIVE = "ACTIVE", // The campaign is currently active and accepting donations
    COMPLETED = "COMPLETED", // The campaign has reached its target or end date
    CANCELLED = "CANCELLED", // The campaign has been cancelled
  }
  
  // Define an interface for a donation transaction
  export interface DonationTransaction {
    id: string; // Unique identifier for the transaction
    campaignId: string; // ID of the campaign associated with this transaction
    donorId: string; // ID of the donor making the donation
    amount: number; // Amount donated
    transactionDate: Date; // Date of the transaction
    status: TransactionStatus; // Current status of the transaction (e.g., PENDING, COMPLETED, FAILED)
  }
  
  // Define possible statuses for a donation transaction
  export enum TransactionStatus {
    PENDING = "PENDING", // The transaction is pending confirmation
    COMPLETED = "COMPLETED", // The transaction has been completed successfully
    FAILED = "FAILED", // The transaction has failed
  }
  
  // Define an interface for donor information
  export interface Donor {
    id: string; // Unique identifier for the donor
    name: string; // Name of the donor
    email: string; // Email of the donor
    totalDonated: number; // Total amount donated by the donor
    donationHistory: DonationTransaction[]; // List of past donation transactions
  }
  
  // Example usage of the DonationCampaign interface
  const exampleCampaign: DonationCampaign = {
    id: "campaign_001",
    title: "Support BARK Protocol",
    description: "BARK project development.",
    targetAmount: 5000,
    currentAmount: 1500,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    status: CampaignStatus.ACTIVE,
    creatorId: "user_123",
    metadata: "Campaign for the BARK community",
  };
  
  // Example usage of the DonationTransaction interface
  const exampleTransaction: DonationTransaction = {
    id: "transaction_001",
    campaignId: "campaign_001",
    donorId: "user_456",
    amount: 100,
    transactionDate: new Date(),
    status: TransactionStatus.COMPLETED,
  };
  
  // Example usage of the Donor interface
  const exampleDonor: Donor = {
    id: "user_456",
    name: "John Doe",
    email: "john.doe@example.com",
    totalDonated: 250,
    donationHistory: [exampleTransaction],
  };
  