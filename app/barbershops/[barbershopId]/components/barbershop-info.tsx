"use client";

import { Barbershop } from "@prisma/client";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { SideMenu } from "@/app/components/side-menu";
import { Button } from "@/app/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet";

interface BarbershopInfoProps {
  barbershop: Barbershop;
}

export function BarbershopInfo({ barbershop }: BarbershopInfoProps) {
  const router = useRouter();

  function handleBackClick() {
    router.back();
  }
  return (
    <div>
      <div className="relative h-[250px] w-full">
        <Button
          onClick={handleBackClick}
          size="icon"
          variant="outline"
          className="absolute left-3 top-3 z-50"
        >
          <ChevronLeftIcon />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="absolute right-3 top-3 z-50"
            >
              <MenuIcon size={18} />
            </Button>
          </SheetTrigger>

          <SheetContent className="p-0">
            <SideMenu />
          </SheetContent>
        </Sheet>

        <Image
          src={barbershop.imageUrl}
          alt={barbershop.name}
          fill
          className="object-cover opacity-85"
        />
      </div>

      <div className="border-b border-secondary px-5 pb-6 pt-3">
        <h1 className="text-xl font-bold">{barbershop.name}</h1>
        <div className="my-2 flex items-center gap-1">
          <MapPinIcon className="fill-primary/40 stroke-primary" size={18} />
          <p className="text-sm">{barbershop.address}</p>
        </div>
        <div className="flex items-center gap-1">
          <StarIcon className="fill-primary/40 stroke-primary" size={18} />
          <p className="text-sm">5,0 (899 avaliaçoes)</p>
        </div>
      </div>
    </div>
  );
}
