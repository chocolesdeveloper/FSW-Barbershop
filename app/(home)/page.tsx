import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Header } from "../components/header"

export default function Home() {
  const today = format(new Date(), "iiii',' d 'de' MMMM", {
    locale: ptBR,
  })

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h2 className="text-xl font-bold">Olá William!</h2>
        <p className="capitalize text-sm">{today}</p>
      </div>
    </>
  )
}
