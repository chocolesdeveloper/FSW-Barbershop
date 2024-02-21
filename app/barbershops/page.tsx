import { redirect } from "next/navigation";

import { BarbershopItem } from "../(home)/components/barbershop-item";
import { Search } from "../(home)/components/search";
import { Header } from "../components/header";
import { prismaClient } from "../lib/prisma";

interface BarbershopPageProps {
  searchParams: {
    search?: string;
  };
}

export default async function BarbershopPage({
  searchParams,
}: BarbershopPageProps) {
  if (!searchParams) {
    return redirect("/");
  }

  const barbershops = await prismaClient.barbershop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: "insensitive",
      },
    },
  });

  return (
    <>
      <Header />

      <div className="lg:container">
        <div className="flex flex-col gap-6 px-5 py-6">
          <Search search={searchParams.search} />
          <h1 className="font-bol text-xs uppercase text-gray-400 lg:text-lg">
            Resultados para &quot;{searchParams.search}&quot;
          </h1>

          <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {barbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
