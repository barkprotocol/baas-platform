import { MongoClient, Db } from '@/lib/mongodb';

// Define a URI for connecting to the BARK MongoDB database
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bark_protocol_db'; // Replace with correct MongoDB URI
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Type for global MongoDB client promise
interface Global {
  _mongoClientPromise?: Promise<MongoClient>;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Check if we are running in development or production
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable for the MongoClient
  if (!(global as Global)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as Global)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as Global)._mongoClientPromise;
} else {
  // In production mode, create a new MongoClient for each request
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a function that returns the connected MongoDB client
export const connectToDatabase = async (): Promise<Db> => {
  const client = await clientPromise;
  const db = client.db('bark_protocol_db'); // Specify your database name here
  return db;
};

// Optional: Cleanup function to close the MongoDB client
export const closeDatabaseConnection = async () => {
  if (client) {
    await client.close();
  }
};
