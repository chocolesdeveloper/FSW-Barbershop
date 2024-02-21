"use client";

import { Booking, Prisma } from "@prisma/client";
import { format, isAfter, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import { cancelBoooking } from "../actions/cancel-booking";
import { initialLetters } from "../utils/initialLetters";
import { BookingInfo } from "./booking-info";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: true;
      barbershop: true;
    };
  }>;
}

export function BookingItem({ booking }: BookingItemProps) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const isBookingConfirmed = isFuture(booking.date);

  async function handleCancelClick() {
    try {
      setIsDeleteLoading(true);

      await cancelBoooking(booking.id);

      toast.success("Reserva cancelada com sucesso!");
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleteLoading(false);
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className="min-w-full">
          <CardContent className="flex p-0">
            <div className="flex flex-[3] flex-col gap-2 py-5 pl-5">
              <Badge
                variant={isBookingConfirmed ? "default" : "secondary"}
                className="w-fit"
              >
                {isBookingConfirmed ? "Confirmado" : "Finalizado"}
              </Badge>
              <h2 className="font-bold">{booking.service.name}</h2>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={booking.barbershop.imageUrl} />

                  <AvatarFallback>
                    {initialLetters(booking.barbershop.name)}
                  </AvatarFallback>
                </Avatar>

                <h3 className="text-sm">{booking.barbershop.name}</h3>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center border-l border-solid border-secondary pl-3">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", {
                  locale: ptBR,
                })}
              </p>
              <p className="text-2xl">{format(booking.date, "dd")}</p>
              <p className="text-sm">{format(booking.date, "HH':'mm")}</p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      <SheetContent className="px-0 lg:min-w-[650px]">
        <SheetHeader className="border-b border-secondary px-5 pb-6 text-left">
          <SheetTitle>Informarções da Reserva</SheetTitle>
        </SheetHeader>

        <div className="mx-auto px-5 lg:w-[80%]">
          <div className="relative mt-6 h-[180px]">
            <Image
              src="/barbershop-map.png"
              alt={booking.barbershop.name}
              fill
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute bottom-4 left-0 w-full px-5">
              <Card>
                <CardContent className="flex gap-2 p-3">
                  <Avatar>
                    <AvatarImage src={booking.barbershop.imageUrl} />
                  </Avatar>

                  <div>
                    <h2 className="font-bold">{booking.barbershop.name}</h2>
                    <h3 className="truncate text-xs">
                      {booking.barbershop.address}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Badge
            variant={isBookingConfirmed ? "default" : "secondary"}
            className="my-3"
          >
            {isBookingConfirmed ? "Confirmado" : "Finalizado"}
          </Badge>

          <BookingInfo booking={booking} />

          <SheetFooter className="mt-3 flex-row gap-3">
            <SheetClose asChild>
              <Button variant="secondary" className="w-full">
                Voltar
              </Button>
            </SheetClose>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={!isBookingConfirmed || isDeleteLoading}
                  variant="destructive"
                  className="w-full"
                >
                  {isDeleteLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-2 w-4 animate-spin" />
                      Cancelando Reserva
                    </div>
                  ) : (
                    <>Cancelar Reservar</>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Deseja mesmo cancelar essa reserva?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Uma vez cancelada não será possível reverter essa ação.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="w-full flex-row items-end gap-3 px-5">
                  <AlertDialogCancel className="w-full">
                    Voltar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={isDeleteLoading || !isBookingConfirmed}
                    className="w-full"
                    onClick={handleCancelClick}
                  >
                    {isDeleteLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-2 w-4 animate-spin" />
                        Cancelando Reserva
                      </div>
                    ) : (
                      <>Confirmar</>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
