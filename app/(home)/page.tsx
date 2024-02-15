import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]/route";
import { BookingItem } from "../components/booking-item";
import { Header } from "../components/header";
import { prismaClient } from "../lib/prisma";
import { BarbershopItem } from "./components/barbershop-item";
import { Search } from "./components/search";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [barbershops, confirmedBookings] = await Promise.all([
    prismaClient.barbershop.findMany(),
    session?.user
      ? await prismaClient.booking.findMany({
          where: {
            userId: session.user.id,
            date: {
              gte: new Date(),
            },
          },
          include: {
            service: true,
            barbershop: true,
          },
        })
      : Promise.resolve([]),
  ]);

  const today = format(new Date(), "iiii',' d 'de' MMMM", {
    locale: ptBR,
  });

  return (
    <>
      <Header />

      <div className="mt-6 px-5">
        <h2 className="text-xl font-bold">
          {session?.user?.name
            ? `Olá, ${session?.user.name.split(" ")[0]}!`
            : "Olá, vamos agendar um corte?"}
        </h2>
        <p className="text-sm capitalize">{today}</p>
      </div>

      <div className="mt-6 px-5">
        <Search />
      </div>

      <div className="mt-6">
        {confirmedBookings.length > 0 && (
          <>
            <h2 className="mb-3 px-5 text-xs font-bold uppercase leading-4 text-gray-400">
              agendamentos
            </h2>
            <div className="flex gap-3 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
              {confirmedBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-6">
        <h2 className="mb-3 px-5 text-xs font-bold uppercase leading-4 text-gray-400">
          Barbearias
        </h2>
        <div className="flex gap-4 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem barbershop={barbershop} key={barbershop.id} />
          ))}
        </div>
      </div>

      <div className="mb-[4.5rem] mt-6">
        <h2 className="mb-3 px-5 text-xs font-bold uppercase leading-4 text-gray-400">
          Populares
        </h2>
        <div className="flex gap-4 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => (
            <BarbershopItem barbershop={barbershop} key={barbershop.id} />
          ))}
        </div>
      </div>
    </>
  );
}
