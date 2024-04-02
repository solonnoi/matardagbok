import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { foodName, calories, protein } = req.body;
    const result = await prisma.foodEntry.create({
      data: {
        foodName,
        calories: Number(calories),
        protein: Number(protein),
      }, // Add a comma here
    });
    console.log('Food entry created');
    return res.json(result);
  } else if (req.method === 'GET') {
    const foodEntries = await prisma.foodEntry.findMany();
    return res.json(foodEntries);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
