import { MenuIcon } from "lucide-react";
import Image from "next/image";

import { SideMenu } from "./side-menu";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function Header() {
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
            <SideMenu />
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
}
