import { prismaClient } from "@/app/lib/prisma";

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
          <ServiceItem service={service} key={service.id} />
        ))}
      </div>
    </div>
  );
}
