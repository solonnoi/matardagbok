import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
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
      return res.json(foodEntries);
    } else {
      const datesWithEntries = await prisma.foodEntry.findMany({
        select: {
          dateCreated: true,
        },
      });
      const uniqueDates = datesWithEntries.map(entry => entry.dateCreated.toISOString().split('T')[0]);
      console.log(uniqueDates);
      return res.json(Array.from(new Set(uniqueDates)));
    }
  } else if (req.method === 'POST') {
    const { foodName, calories, protein } = req.body;
    const result = await prisma.foodEntry.create({
      data: { foodName, calories, protein },
    });
    return res.json(result);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
