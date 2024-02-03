import { MenuIcon } from "lucide-react"
import Image from "next/image"

import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

export function Header() {
  return (
    <Card>
      <CardContent className="flex justify-between items-center p-5">
        <Image src="/logo.png" alt="FSW Barber" width={120} height={22} />
        <Button size="icon" variant="outline">
          <MenuIcon size={18} />
        </Button>
      </CardContent>
    </Card>
  )
}
