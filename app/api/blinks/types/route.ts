import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb'; // Adjust the import based on your database connection method
import { Action, Currency } from '@/types/actionboard'; // Import your Action and Currency types

// Define the response types for the API
type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

// Define the request types for creating a blink
type CreateBlinkRequest = {
  userId: string; // User's ID to associate the blink
  amount: number;  // Amount to blink
};

// Connect to the database (or your data source)
const connectDB = async () => {
  const db = await connectToDatabase();
  return db;
};

// API Route for handling Blink actions
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<any>>
) {
  const db = await connectDB();

  switch (req.method) {
    case 'POST':
      // Handle creating a blink
      const { userId, amount }: CreateBlinkRequest = req.body;
      try {
        const result = await db.collection('blinks').insertOne({ userId, amount, createdAt: new Date() });
        res.status(201).json({ success: true, data: result });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create blink' });
      }
      break;

    case 'GET':
      // Handle fetching blink history
      const { userId: queryUserId } = req.query;
      try {
        const history = await db.collection('blinks').find({ userId: queryUserId }).toArray();
        res.status(200).json({ success: true, data: history });
      } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch blink history' });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET']);
      res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
      break;
  }
}
