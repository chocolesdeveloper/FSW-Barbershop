"use client";

import { Barbershop, Service } from "@prisma/client";
import { format, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useMemo, useState } from "react";

import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";

import { saveBooking } from "../actions/save-booking";
import { generateDayTimeList } from "./helpers/hours";

interface ServiceItemProps {
  barbershop: Barbershop;
  service: Service;
  isAuthenticated?: boolean;
}

export function ServiceItem({
  service,
  isAuthenticated,
  barbershop,
}: ServiceItemProps) {
  const { data } = useSession();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hour, setHour] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  function handleHourClick(hour: string) {
    setHour(hour);
  }

  function handleDateClick(date: Date | undefined) {
    setDate(date);
    setHour(undefined);
  }

  function handleBookingClick() {
    if (!isAuthenticated) {
      signIn("google");
    }
  }

  async function handleBookingSubmit() {
    try {
      setLoading(true);

      if (!(hour && date && data?.user)) {
        return;
      }

      const dateHour = Number(hour?.split(":")[0]);
      const dateMinutes = Number(hour?.split(":")[1]);
      const newDate = setMinutes(setHours(date, dateHour), dateMinutes);

      await saveBooking({
        serviceId: service.id,
        barbershopId: barbershop.id,
        date: newDate,
        userId: data.user.id,
      });
    } catch (err) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  const timeList = useMemo(() => {
    return date ? generateDayTimeList(date) : [];
  }, [date]);

  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-3">
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" onClick={handleBookingClick}>
                  Reservar
                </Button>
              </SheetTrigger>

              <SheetContent className="flex flex-col overflow-y-auto p-0 pb-4 [&::-webkit-scrollbar]:hidden">
                <SheetHeader className="border-b border-secondary px-5 py-6 text-left">
                  <SheetTitle>Fazer Reserva</SheetTitle>
                </SheetHeader>

                <div className="flex w-full flex-1 flex-col">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateClick}
                    fromDate={new Date()}
                    classNames={{
                      month: "w-full",
                      head_cell: "w-full mt-3",
                      cell: "w-full",
                    }}
                    className="mt-6 capitalize"
                  />
                  {/* Mostrar lista de horario se tiver vaga selecionada */}
                  {date && (
                    <div className="flex gap-2 overflow-x-auto border-t border-secondary px-5 py-6 [&::-webkit-scrollbar]:hidden">
                      {timeList.map((time) => (
                        <Button
                          key={time}
                          variant={time === hour ? "default" : "outline"}
                          className="rounded-full"
                          onClick={() => handleHourClick(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-secondary px-5 py-6">
                    <Card>
                      <CardContent className="flex flex-col gap-3 p-3">
                        <div className="flex justify-between">
                          <h2 className="font-bold">{service.name}</h2>
                          <h3 className="text-sm font-bold">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </h3>
                        </div>

                        {date && (
                          <div className="flex justify-between text-sm">
                            <h3 className="text-gray-400">Data</h3>
                            <h4 className="capitalize">
                              {format(date, "dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </h4>
                          </div>
                        )}

                        {hour && (
                          <div className="flex justify-between text-sm">
                            <h3 className="text-gray-400">Horário</h3>
                            <h4 className="capitalize">{hour}</h4>
                          </div>
                        )}

                        <div className="flex justify-between text-sm">
                          <h3 className="text-gray-400">Barbearia</h3>
                          <h4 className="capitalize">{barbershop.name}</h4>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <SheetFooter className="px-5">
                  <Button
                    onClick={handleBookingSubmit}
                    disabled={!(hour && date) || loading}
                    className="w-full"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-2 w-4 animate-spin" />
                        Finalizando agendamento
                      </div>
                    ) : (
                      <>Confirmar reserva</>
                    )}
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
