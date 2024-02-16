"use client";

import { Barbershop, Booking, Service } from "@prisma/client";
import { format, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import colors from "tailwindcss/colors";

import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";

import { getDayBookings } from "../actions/get-day-bookings";
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
  const router = useRouter();

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);

  useEffect(() => {
    async function refreshAvailableHours() {
      if (!date) {
        return;
      }

      const _dayBookings = await getDayBookings(date, barbershop.id);
      setDayBookings(_dayBookings);
    }

    refreshAvailableHours();
  }, [date, barbershop.id]);

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

      setHour(undefined);
      setDate(undefined);

      toast("Agendamento realizado com sucesso!", {
        description: `Seu angedamento na ${barbershop.name} foi marcado para ${format(newDate, "dd'/'LL 'ás' HH':'mm")}`,
        action: {
          label: "Visualizar",
          onClick: () => {
            router.push("/bookings");
          },
        },
        style: {
          backgroundColor: colors.emerald["100"],
        },
      });
    } catch (err) {
      console.error(err);

      setLoading(false);
      toast.error("Não foi possível realizar o agendamento!", {
        style: {
          backgroundColor: colors.red["300"],
        },
      });
    } finally {
      setLoading(false);
    }
  }

  const timeList = useMemo(() => {
    if (!date) {
      return [];
    }

    const currentHour = new Date().getHours();
    const currentMinute = new Date().getMinutes();

    return generateDayTimeList(date).filter((time) => {
      const timeHour = Number(time.split(":")[0]);
      const timeMinutes = Number(time.split(":")[1]);

      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const timeToCheckInMinutes = timeHour * 60 + timeMinutes;

      const isTimeAfterCurrent = timeToCheckInMinutes > currentTimeInMinutes;

      if (!isTimeAfterCurrent) {
        return false;
      }

      const booking = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();

        return bookingHour === timeHour && bookingMinutes === timeMinutes;
      });

      if (!booking) {
        return true;
      }

      return false;
    });
  }, [date, dayBookings]);

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
                  <SheetClose className="w-full">
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
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
