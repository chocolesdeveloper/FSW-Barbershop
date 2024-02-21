import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getServerSession } from "next-auth";

import { BookingItem } from "../components/booking-item";
import { Header } from "../components/header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { prismaClient } from "../lib/prisma";
import { authOptions } from "../utils/authOptions";
import { BarbershopItem } from "./components/barbershop-item";
import { Search } from "./components/search";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const [barbershops, recommededBarberShops, confirmedBookings] =
    await Promise.all([
      prismaClient.barbershop.findMany(),
      prismaClient.barbershop.findMany({
        orderBy: {
          id: "asc",
        },
      }),
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

      <div
        className="absolute inset-0 top-24 -z-10 hidden h-[482px] lg:block"
        style={{
          background: "url(bg-home.png) no-repeat center/cover",
        }}
      />

      <div className="container">
        <div className="flex items-center gap-32 overflow-hidden px-5 lg:h-[482px] lg:px-32">
          <div className="flex w-full flex-col lg:min-w-[440px] lg:gap-11">
            <div className="mt-6 lg:mt-0">
              <h2 className="text-xl font-bold">
                {session?.user?.name
                  ? `Olá, ${session?.user.name.split(" ")[0]}!`
                  : "Olá, vamos agendar um corte?"}
              </h2>
              <p className="text-sm capitalize">{today}</p>
            </div>

            <div className="mt-6 ">
              <Search />
            </div>

            <div className="mt-6">
              {confirmedBookings.length > 0 && (
                <>
                  <h2 className="mb-3 text-xs font-bold uppercase leading-4 text-gray-400">
                    agendamentos
                  </h2>
                  <div className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    <Carousel className="w-full">
                      <CarouselContent className="flex  gap-6 px-5">
                        {confirmedBookings.map((booking) => (
                          <BookingItem key={booking.id} booking={booking} />
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="relative mt-20 hidden min-w-[620px] lg:block">
            <h2 className="mb-3 px-5 text-xs font-bold uppercase leading-4 text-gray-400">
              RECOMENDADOS
            </h2>
            <Carousel>
              <CarouselContent className="flex gap-6">
                {recommededBarberShops.map((barbershop) => (
                  <CarouselItem key={barbershop.id} className="max-w-[200px]">
                    <BarbershopItem barbershop={barbershop} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext />
              <CarouselPrevious />
            </Carousel>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="mb-3 px-5 text-xs font-bold uppercase leading-4 text-gray-400">
            Barbearias
          </h2>
          <div className="flex gap-4 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
            <Carousel>
              <CarouselContent className="flex gap-2 lg:gap-6">
                {barbershops.map((barbershop) => (
                  <CarouselItem
                    key={barbershop.id}
                    className="max-w-[200px] px-2"
                  >
                    <BarbershopItem barbershop={barbershop} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>

        <div className="mb-[4.5rem] mt-6">
          <h2 className="mb-3 px-5 text-xs font-bold uppercase leading-4 text-gray-400">
            Populares
          </h2>
          <div className="flex gap-4 overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
            <Carousel>
              <CarouselContent className="flex gap-2 lg:gap-6">
                {recommededBarberShops.map((barbershop) => (
                  <CarouselItem
                    key={barbershop.id}
                    className="max-w-[200px] px-2"
                  >
                    <BarbershopItem barbershop={barbershop} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
}
