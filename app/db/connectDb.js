import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10, // Reuse connections
  connectTimeoutMS: 10000, // 10s timeout for initial connection
  socketTimeoutMS: 20000, // 20s timeout for operations
};

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // Preserve connection across hot reloads in development
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Create new connection for each request in production
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;