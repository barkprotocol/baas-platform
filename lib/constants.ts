import { PublicKey } from '@solana/web3.js'

export const tokenIcons = {
  SOL: "https://ucarecdn.com/8bcc4664-01b2-4a88-85bc-9ebce234f08b/sol.png",
  USDC: "https://ucarecdn.com/67e17a97-f3bd-46b0-8627-e13b8b939d26/usdc.png",
  BARK: "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png",
}

export const PROGRAM_ID = new PublicKey('BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQq

Mo')

export const IDL = {
  version: "0.1.0",
  name: "bark_blink",
  instructions: [
    {
      name: "createBlink",
      accounts: [
        {
          name: "blink",
          isMut: true,
          isSigner: true,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "description",
          type: "string",
        },
        {
          name: "amount",
          type: "u64",
        },
        {
          name: "token",
          type: "string",
        },
        {
          name: "blinkType",
          type: "string",
        },
        {
          name: "expirationDays",
          type: "u8",
        },
        {
          name: "isRecurring",
          type: "bool",
        },
        {
          name: "recurringFrequency",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "Blink",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "description",
            type: "string",
          },
          {
            name: "amount",
            type: "u64",
          },
          {
            name: "token",
            type: "string",
          },
          {
            name: "blinkType",
            type: "string",
          },
          {
            name: "expirationDays",
            type: "u8",
          },
          {
            name: "isRecurring",
            type: "bool",
          },
          {
            name: "recurringFrequency",
            type: "string",
          },
          {
            name: "creator",
            type: "publicKey",
          },
          {
            name: "createdAt",
            type: "i64",
          },
        ],
      },
    },
  ],
}

export const iconColor = "#D0BFB4"
export const titleIconUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png"