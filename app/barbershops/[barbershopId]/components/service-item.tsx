import { Service } from "@prisma/client";
import Image from "next/image";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

interface ServiceItemProps {
  service: Service;
}

export function ServiceItem({ service }: ServiceItemProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-3">
        <Image
          src={service.imageUrl}
          alt={service.name}
          width={110}
          height={110}
          className="h-[110px] w-auto rounded-lg object-cover"
        />

        <div className="flex w-full flex-col">
          <h2 className="font-bold">{service.name}</h2>
          <p className="text-sm text-gray-400">{service.description}</p>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm font-bold text-primary">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
            </p>
            <Button variant="secondary">Agendar</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
