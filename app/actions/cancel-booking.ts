"use server";

import { revalidatePath } from "next/cache";

import { prismaClient } from "../lib/prisma";

export async function cancelBoooking(bookingId: string) {
  await prismaClient.booking.delete({
    where: {
      id: bookingId,
    },
  });

  revalidatePath("/");
  revalidatePath("/bookings");
}
