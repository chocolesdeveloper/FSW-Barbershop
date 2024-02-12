"use client";

import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { initialLetters } from "../utils/initialLetters";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export function Header() {
  const { data, status } = useSession();

  function handleSignInClick() {
    signIn("google");
  }

  function handleSignOutClick() {
    signOut();
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <Image
          src="/logo.png"
          alt="FSW Barber"
          width={120}
          height={22}
          className="h-[22px] w-auto"
        />

        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <MenuIcon size={18} />
            </Button>
          </SheetTrigger>

          <SheetContent className="p-0">
            <SheetHeader className="border-b border-secondary p-5 text-left">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            {data?.user ? (
              <div className="flex items-center justify-between px-5 py-6">
                <div className="flex items-center gap-3 ">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {initialLetters(data.user.name ?? "")}
                    </AvatarFallback>

                    <AvatarImage
                      src={data.user.image ?? ""}
                      alt={`Imagem de perdil de ${data.user?.name}`}
                    />
                  </Avatar>

                  <h2 className="font-bold">{data.user.name}</h2>
                </div>

                <Button
                  onClick={handleSignOutClick}
                  variant="ghost"
                  size="icon"
                >
                  <LogOutIcon className="text-destructive" size={18} />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 px-5 py-6">
                <div className="flex items-center gap-3">
                  <UserIcon />
                  <h2 className="font-bold">Olá, faça seu login!</h2>
                </div>

                <Button
                  onClick={handleSignInClick}
                  variant="secondary"
                  className="flex items-center justify-start gap-2"
                >
                  <LogInIcon size={18} />
                  Fazer login
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-3 px-5">
              <Button variant="outline" className="justify-start gap-2" asChild>
                <Link href="/">
                  <HomeIcon size={18} />
                  Início
                </Link>
              </Button>

              {data?.user && (
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  asChild
                >
                  <Link href="/bookings">
                    <CalendarIcon size={18} />
                    Agendamentos
                  </Link>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}
