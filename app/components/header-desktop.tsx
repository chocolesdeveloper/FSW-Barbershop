"use client";

import { CalendarIcon, DoorOpenIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { initialLetters } from "../utils/initialLetters";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export function HeaderDesktop() {
  const { data } = useSession();

  function handleSignInClick() {
    signIn("google");
  }

  function handleSignOutClick() {
    signOut();
  }

  return (
    <div className="flex items-center">
      <Button variant="ghost" className="justify-start gap-2" asChild>
        <Link href="/bookings">
          <CalendarIcon size={18} />
          Agendamentos
        </Link>
      </Button>

      {data?.user ? (
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-3 ">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {initialLetters(data?.user.name ?? "")}
              </AvatarFallback>

              <AvatarImage
                src={data?.user && data.user.image!}
                alt={`Imagem de perdil de ${data?.user?.name}`}
              />
            </Avatar>

            <h2 className="font-bold">{data?.user.name}</h2>
          </div>

          <Button onClick={handleSignOutClick} variant="ghost" size="icon">
            <LogOutIcon className="text-destructive" size={18} />
          </Button>
        </div>
      ) : (
        <Button className="flex items-center gap-2" onClick={handleSignInClick}>
          <DoorOpenIcon />
          Entrar
        </Button>
      )}
    </div>
  );
}
