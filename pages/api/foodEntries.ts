// pages/api/foodEntries.ts
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await getFoods(req, res);
  } else if (req.method === 'POST') {
    await postFoods(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getFoods(req: NextApiRequest, res: NextApiResponse) {
  const { date } = req.query;

  if (date) {
    const dateObj = new Date(date as string);
    dateObj.setHours(0, 0, 0, 0);
    const nextDay = new Date(dateObj);
    nextDay.setDate(dateObj.getDate() + 1);

    const foodEntries = await prisma.foodEntry.findMany({
      where: {
        dateCreated: {
          gte: dateObj,
          lt: nextDay,
        },
      },
    });
    res.json(foodEntries);
  } else {
    const datesWithEntries = await prisma.foodEntry.findMany({
      select: {
        dateCreated: true,
      },
    });
    const uniqueDates = datesWithEntries.map(entry => entry.dateCreated.toISOString().split('T')[0]);
    res.json(Array.from(new Set(uniqueDates)));
  }
}

async function postFoods(req: NextApiRequest, res: NextApiResponse) {
  const { foodName, calories, protein } = req.body;
  try {
    const result = await prisma.foodEntry.create({
      data: { foodName, calories, protein },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "There was a problem creating the food entry." });
  }
}

async function removeFood(req:NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  try {
    const result = await prisma.foodEntry.delete({
      where: { id: Number(id) },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "There was a problem deleting the food entry." });
  } 
}
