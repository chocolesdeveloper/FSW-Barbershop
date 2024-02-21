"use client";

import { Barbershop } from "@prisma/client";
import { Smartphone } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Avatar, AvatarImage } from "@/app/components/ui/avatar";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

const PHONES = [{ phone: "(55) 55555-5555" }, { phone: "(66) 66666-6666" }];

const DAY_OF_THE_WEEK = [
  {
    dayOfWeek: "Segunda-Feira",
    hours: "Fechado",
  },
  {
    dayOfWeek: "Terça-Feira",
    hours: "09:00-21:00",
  },
  {
    dayOfWeek: "Quarta-Feira",
    hours: "09:00-21:00",
  },
  {
    dayOfWeek: "Quinta-Feira",
    hours: "09:00-21:00",
  },
  {
    dayOfWeek: "Sexta-Feira",
    hours: "09:00-21:00",
  },
  {
    dayOfWeek: "Sábado",
    hours: "09:00-21:00",
  },
  {
    dayOfWeek: "Domingo",
    hours: "Fechado",
  },
];

interface AboutProps {
  barbershop: Barbershop;
}

export function About({ barbershop }: AboutProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function handleCopyNumber(phone: string, copiedIndex: number) {
    navigator.clipboard.writeText(phone);
    setCopiedIndex(copiedIndex);
  }

  return (
    <Card className="mt-10 min-w-[386px] p-5">
      <div className="relative mx-auto h-[180px] min-w-[346px] ">
        <Image
          src="/barbershop-map.png"
          alt={barbershop.name}
          fill
          sizes="100vw"
          className="inset-0 h-[180px] object-cover"
        />

        <div className="absolute bottom-4 left-0 w-full px-5">
          <Card>
            <CardContent className="flex gap-2 p-3">
              <Avatar>
                <AvatarImage src={barbershop.imageUrl} />
              </Avatar>

              <div>
                <h2 className="font-bold">{barbershop.name}</h2>
                <h3 className="truncate text-xs">{barbershop.address}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-5 border-b border-secondary pb-5">
        <h2>SOBRE NÓS</h2>
        <p className="text-sm text-gray-400">
          Bem-vindo à Vintage Barber, onde tradição encontra estilo. Nossa
          equipe de mestres barbeiros transforma cortes de cabelo e barbas em
          obras de arte. Em um ambiente acolhedor, promovemos confiança, estilo
          e uma comunidade unida.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-b border-secondary py-5">
        {PHONES.map(({ phone }, index) => (
          <div key={`${phone} - ${index}`} className="item-center flex gap-2">
            <Smartphone />
            <span>{phone}</span>
            <Button
              variant="secondary"
              className="ml-auto"
              onClick={() => handleCopyNumber(phone, index)}
            >
              {copiedIndex === index ? "Copiado" : "Copiar"}
            </Button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 border-b border-secondary py-5">
        {DAY_OF_THE_WEEK.map((day) => (
          <div
            key={day.dayOfWeek}
            className="flex items-center justify-between"
          >
            <p className="text-gray-400">{day.dayOfWeek}</p>
            <p>{day.hours}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between py-5">
        <span>Em parceria com</span>

        <Image
          src="/logo.png"
          alt="Logo"
          width={130}
          height={22}
          className="h-auto w-[130px] object-cover"
        />
      </div>
    </Card>
  );
}
