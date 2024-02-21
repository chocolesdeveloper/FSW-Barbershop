import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { Header } from "@/app/components/header";
import { prismaClient } from "@/app/lib/prisma";
import { authOptions } from "@/app/utils/authOptions";

import { About } from "../../components/about";
import { BarbershopInfo } from "./components/barbershop-info";
import { ServiceItem } from "./components/service-item";

interface BarbershopDetailsPageProps {
  params: {
    barbershopId?: string;
  };
}

export default async function BarbershopDetailsPage({
  params,
}: BarbershopDetailsPageProps) {
  const session = await getServerSession(authOptions);
  if (!params.barbershopId) {
    return redirect("/");
  }

  const barbershop = await prismaClient.barbershop.findUnique({
    where: {
      id: params.barbershopId,
    },
    include: {
      services: true,
    },
  });

  if (!barbershop) {
    return redirect("/");
  }

  return (
    <div>
      <div className="hidden lg:block">
        <Header />
      </div>

      <div className="container flex gap-10 lg:px-32">
        <div className="w-full lg:min-w-[758px]">
          <BarbershopInfo barbershop={barbershop} />
          <div className="grid gap-2 px-4 py-6 lg:grid-cols-2 lg:px-0">
            {barbershop.services.map((service) => (
              <ServiceItem
                service={service}
                barbershop={barbershop}
                key={service.id}
                isAuthenticated={!!session?.user}
              />
            ))}
          </div>
        </div>

        <div className="hidden flex-1 xl:block">
          <About barbershop={barbershop} />
        </div>
      </div>
    </div>
  );
}
