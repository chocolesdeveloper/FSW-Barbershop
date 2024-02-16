"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

const formSchema = z.object({
  search: z
    .string({
      required_error: "Campo obrigatório",
    })
    .trim()
    .min(1, "Campo obrigatório"),
});

type SearchType = z.infer<typeof formSchema>;

export function Search() {
  const router = useRouter();

  const form = useForm<SearchType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  function handleSubmit(data: SearchType) {
    router.push(`/barbershops?search=${data.search}`);
  }

  return (
    <div>
      <form
        className="flex items-center gap-2"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Controller
          name="search"
          control={form.control}
          render={({ field }) => (
            <Input placeholder="Busque por uma barbearia..." {...field} />
          )}
        />

        <Button type="submit">
          <SearchIcon size={20} />
        </Button>
      </form>

      <p className="mt-1 pl-2 text-xs text-red-500">
        {form.formState.errors.search?.message}
      </p>
    </div>
  );
}
