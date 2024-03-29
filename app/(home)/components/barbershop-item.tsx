"use client";

import { Barbershop } from "@prisma/client";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Header } from "@/app/components/header";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

interface BarbershopItemProps {
  barbershop: Barbershop;
}

export function BarbershopItem({ barbershop }: BarbershopItemProps) {
  const router = useRouter();

  function handleBookingClick(barbershopId: string) {
    router.push(`barbershops/${barbershopId}`);
  }

  return (
    <>
      <Card className="min-w-[167px] max-w-full rounded-2xl lg:min-w-52">
        <CardContent className="p-1">
          <div className="relative">
            <Badge
              variant="secondary"
              className="absolute left-1 top-1 z-50 flex w-fit items-center gap-1 bg-[#221C3DB2] opacity-70"
            >
              <StarIcon size={12} className="fill-primary text-primary" />
              <span className="text-xs">5,0</span>
            </Badge>
            <Image
              src={barbershop.imageUrl}
              alt={barbershop.name}
              width={159}
              height={159}
              className="h-[159px] w-full rounded-lg object-cover"
            />
          </div>

          <div className="p-1">
            <h2 className="truncate font-bold">{barbershop.name}</h2>
            <p className="mt-2 truncate text-sm text-gray-400">
              {barbershop.address}
            </p>

            <Button
              variant="secondary"
              className="mt-3 w-full"
              onClick={() => handleBookingClick(barbershop.id)}
            >
              Reservar
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
