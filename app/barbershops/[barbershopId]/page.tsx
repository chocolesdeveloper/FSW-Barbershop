import { getServerSession } from "next-auth";

import { prismaClient } from "@/app/lib/prisma";
import { authOptions } from "@/app/utils/authOptions";

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
    // TODO: Redirect to homepage
    return null;
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
    //TODO: Redirect to homepage
    return null;
  }

  return (
    <div>
      <BarbershopInfo barbershop={barbershop} />
      <div className="flex flex-col gap-2 px-4 py-6">
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
  );
}
