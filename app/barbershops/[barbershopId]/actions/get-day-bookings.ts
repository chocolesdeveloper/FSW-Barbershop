"use server";

import { endOfDay, startOfDay } from "date-fns";

import { prismaClient } from "@/app/lib/prisma";

export async function getDayBookings(date: Date, barbershopId: string) {
  const bookings = await prismaClient.booking.findMany({
    where: {
      barbershopId,
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
    },
  });

  return bookings;
}
