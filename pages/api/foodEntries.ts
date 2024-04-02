import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const foodEntries = await prisma.foodEntry.findMany({
      where: {
        dateCreated: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
    return res.json(foodEntries);
  } else if (req.method === 'POST') {
    // Create a new food entry
    const { foodName, calories, protein } = req.body;
    const result = await prisma.foodEntry.create({
      data: {
        foodName,
        calories,
        protein,
        // dateCreated is automatically set to now()
      },
    });
    return res.json(result);
  }
  

  // Method Not Allowed handling
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
