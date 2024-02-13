"use server";

import { prismaClient } from "@/app/lib/prisma";

interface saveBookingProps {
  barbershopId: string;
  serviceId: string;
  userId: string;
  date: Date;
}

export async function saveBooking(params: saveBookingProps) {
  await prismaClient.booking.create({
    data: {
      barbershopId: params.barbershopId,
      serviceId: params.serviceId,
      userId: params.userId,
      date: params.date,
    },
  });
}
