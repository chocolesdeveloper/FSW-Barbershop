import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { BookingItem } from "../components/booking-item";
import { Header } from "../components/header";
import { prismaClient } from "../lib/prisma";
import { BarbershopItem } from "./components/barbershop-item";
import { Search } from "./components/search";

export default async function Home() {
  const barbershops = await prismaClient.barbershop.findMany();

  const today = format(new Date(), "iiii',' d 'de' MMMM", {
    locale: ptBR,
  });

  return (
    <>
      <Header />

      <div className="mt-6 px-5">
        <h2 className="text-xl font-bold">Olá William!</h2>
        <p className="text-sm capitalize">{today}</p>
      </div>

      <div className="mt-6 px-5">
        <Search />
      </div>

      <div className="mt-6 px-5">
        <h2 className="mb-3 text-xs font-bold uppercase leading-4 text-gray-400">
          agendamentos
        </h2>
        {/* <BookingItem /> */}
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
