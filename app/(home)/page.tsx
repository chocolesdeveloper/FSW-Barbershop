import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { BookingItem } from "../components/booking-item";
import { Header } from "../components/header";
import { Search } from "./components/search";

export default function Home() {
  const today = format(new Date(), "iiii',' d 'de' MMMM", {
    locale: ptBR,
  });

  return (
    <>
      <Header />

      <div className="mt-6 px-5">
        <h2 className="text-xl font-bold">Olá William!</h2>
        <p className="text-sm capitalize">{today}</p>
      </div>

      <div className="mt-6 px-5">
        <Search />
      </div>

      <div className="mt-6 px-5">
        <BookingItem title="AGENDAMENTOS" />
      </div>
    </>
  );
}
