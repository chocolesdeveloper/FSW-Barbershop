import { isFuture, isPast } from "date-fns";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]/route";
import { BookingItem } from "../components/booking-item";
import { Header } from "../components/header";
import { prismaClient } from "../lib/prisma";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const [confirmedBookings, finishedBookings] = await Promise.all([
    prismaClient.booking.findMany({
      where: {
        userId: session.user.id,
        date: {
          gt: new Date(),
        },
      },
      include: {
        service: true,
        barbershop: true,
      },
    }),
    prismaClient.booking.findMany({
      where: {
        userId: session.user.id,
        date: {
          lt: new Date(),
        },
      },
      include: {
        service: true,
        barbershop: true,
      },
    }),
  ]);

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        <h2 className="mb-3 mt-6 text-sm font-bold uppercase text-gray-400">
          Confirmados
        </h2>

        <div className="flex flex-col gap-3">
          {confirmedBookings.map((booking) => (
            <BookingItem booking={booking} key={booking.id} />
          ))}
        </div>

        <h2 className="mb-3 mt-6 text-sm font-bold uppercase text-gray-400">
          Finalizados
        </h2>

        <div className="flex flex-col gap-3">
          {finishedBookings.map((booking) => (
            <BookingItem booking={booking} key={booking.id} />
          ))}
        </div>
      </div>
    </>
  );
}
