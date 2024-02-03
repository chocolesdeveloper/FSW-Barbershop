import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

interface BookingItemProps {
  title?: string;
}

export function BookingItem({ title }: BookingItemProps) {
  return (
    <>
      {title && (
        <h2 className="mb-3 text-xs font-bold uppercase leading-4 text-gray-400">
          {title}
        </h2>
      )}

      <Card>
        <CardContent className="flex justify-between p-0 px-5">
          <div className="flex flex-col gap-2 py-5">
            <Badge className="w-fit bg-[#221c3d] text-primary hover:bg-[#221c3d]">
              Confirmado
            </Badge>
            <h2 className="font-bold">Corte de cabelo</h2>

            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png" />

                <AvatarFallback>A</AvatarFallback>
              </Avatar>

              <h3 className="text-sm">Vintage Barber</h3>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-l border-solid border-secondary px-3">
            <p className="text-sm">Feveiro</p>
            <p className="text-2xl">06</p>
            <p className="text-sm">09:45</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
