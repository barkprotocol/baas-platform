// Define an interface for a Solana Blink action
export interface SolanaBlinkAction {
    id: string; // Unique identifier for the action
    userId: string; // ID of the user performing the action
    actionType: BlinkActionType; // Type of action (e.g., MINT, TRANSFER, etc.)
    targetAddress: string; // Target address for the action (e.g., NFT mint address or token recipient)
    amount?: number; // Amount for token transfers or other numerical actions
    metadata?: string; // Optional metadata related to the action (e.g., token URI for NFTs, crowdfunding details)
    createdAt: Date; // Timestamp when the action was created
    status: ActionStatus; // Current status of the action (e.g., PENDING, COMPLETED, FAILED)
  }
  
  // Define possible action types for the Blinkboard
  export enum BlinkActionType {
    MINT = "MINT",
    TRANSFER = "TRANSFER",
    STAKE = "STAKE",
    UNSTAKE = "UNSTAKE",
    CLAIM = "CLAIM",
    BURN = "BURN",
    DONATE = "DONATE", // New action type for donations
    CROWDFUND = "CROWDFUND", // New action type for crowdfunding
    PAYMENT = "PAYMENT", // New action type for payments
    GIFT = "GIFT", // New action type for gifting
  }
  
  // Define possible statuses for an action
  export enum ActionStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
  }
  
  // Define an interface for user actions history
  export interface UserActionHistory {
    userId: string; // ID of the user whose history is being recorded
    actions: SolanaBlinkAction[]; // List of actions performed by the user
  }
  
  // Define an interface for a notification related to a Blink action
  export interface BlinkActionNotification {
    id: string; // Unique identifier for the notification
    actionId: string; // ID of the action related to this notification
    userId: string; // ID of the user to whom the notification belongs
    message: string; // Notification message (e.g., action completed successfully)
    createdAt: Date; // Timestamp when the notification was created
    read: boolean; // Indicates whether the notification has been read
  }
  
  // Define an interface for Blink action settings or configuration
  export interface BlinkActionSettings {
    maxActionsPerDay: number; // Maximum number of actions a user can perform per day
    actionCooldownPeriod: number; // Cooldown period (in seconds) between actions
  }
  
  // Example usage of the SolanaBlinkAction interface
  const exampleAction: SolanaBlinkAction = {
    id: "action_001",
    userId: "user_123",
    actionType: BlinkActionType.DONATE,
    targetAddress: "BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo", // Example target address
    amount: 10, // Example donation amount
    metadata: "Donation to support BARK Protocol", // Example metadata for donation
    createdAt: new Date(),
    status: ActionStatus.PENDING,
  };
  
  // Example of a crowdfunding action
  const exampleCrowdfundAction: SolanaBlinkAction = {
    id: "action_002",
    userId: "user_456",
    actionType: BlinkActionType.CROWDFUND,
    targetAddress: "BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo", // Example crowdfunding target address
    amount: 50, // Example crowdfunding amount
    metadata: "Funding for community project", // Example metadata for crowdfunding
    createdAt: new Date(),
    status: ActionStatus.PENDING,
  };
  
  // Example of a payment action
  const examplePaymentAction: SolanaBlinkAction = {
    id: "action_003",
    userId: "user_789",
    actionType: BlinkActionType.PAYMENT,
    targetAddress: "BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo", // Example payment target address
    amount: 25, // Example payment amount
    metadata: "Payment for services rendered", // Example metadata for payment
    createdAt: new Date(),
    status: ActionStatus.PENDING,
  };
  
  // Example of a gift action
  const exampleGiftAction: SolanaBlinkAction = {
    id: "action_004",
    userId: "user_321",
    actionType: BlinkActionType.GIFT,
    targetAddress: "BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo", // Example gift target address
    amount: 15, // Example gift amount
    metadata: "Gift to a friend for their birthday", // Example metadata for gift
    createdAt: new Date(),
    status: ActionStatus.PENDING,
  };
  