import { createNestServer } from '../src/main';
import { NowRequest, NowResponse } from '@vercel/node';

// Cache the server instance across invocations for better performance
let cachedServer: any = null;

// Vercel serverless function handler
export default async (req: NowRequest, res: NowResponse) => {
  if (!cachedServer) {
    // Create and cache the NestJS server instance
    cachedServer = await createNestServer();
  }
  // Pass the request and response to the Express server
  return cachedServer(req, res);
}; 