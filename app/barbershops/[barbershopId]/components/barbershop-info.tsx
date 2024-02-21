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
    router.replace("/");
  }
  return (
    <div className="mt-10">
      <div className="relative h-[250px] w-full lg:hidden">
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
          sizes="110vw"
          className="object-cover opacity-85"
        />
      </div>

      <div className="border-b border-secondary px-5 pb-6 pt-3 lg:border-none lg:px-0 lg:pt-0">
        <Image
          src={barbershop.imageUrl}
          alt={barbershop.name}
          width={758}
          height={487}
          className="hidden w-full object-cover opacity-85 lg:block"
        />
        <div className="flex items-center justify-between lg:mt-5 ">
          <div>
            <h1 className="text-xl font-bold lg:mb-3 lg:text-4xl ">
              {barbershop.name}
            </h1>
            <div className="my-2 flex items-center gap-1">
              <MapPinIcon
                className="fill-primary/40 stroke-primary"
                size={18}
              />
              <p className="text-sm lg:text-xl">{barbershop.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-lg py-3 lg:flex-col lg:bg-secondary lg:px-5">
            <StarIcon
              className="fill-primary/40 stroke-primary lg:hidden"
              size={18}
            />
            <div className="flex items-center gap-2 lg:flex-col">
              <p className="flex items-center gap-2 text-sm lg:text-2xl">
                <StarIcon className="hidden fill-primary/40 stroke-primary lg:block" />
                5,0
              </p>
              <p className="text-sm lg:text-base">(899 avaliaçoes)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
