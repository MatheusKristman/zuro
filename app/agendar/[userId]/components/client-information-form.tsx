import PhoneInput from "react-phone-number-input";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { ScheduleStore } from "@/stores/schedule-store";

import "react-phone-number-input/style.css";
import { ChangeEvent } from "react";

export function ClientInformationForm() {
  const {
    fullName,
    setFullName,
    cpf,
    setCpf,
    email,
    setEmail,
    tel,
    setTel,
    message,
    setMessage,
    error,
  } = ScheduleStore();

  function handleCpf(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(/[^0-9]/g, "").substring(0, 14);
    const formatted = value.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      "$1.$2.$3-$4",
    );

    setCpf(formatted);
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl p-6 mt-10">
      <h2 className="text-2xl font-semibold text-skin-primary">
        Preencha os dados
      </h2>

      <div className="w-full flex flex-col gap-4 mt-10 sm:flex-row">
        <div className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-col gap-2">
            <Label className="font-bold text-slate-600" htmlFor="fullName">
              Nome Completo*
            </Label>

            <Input
              id="fullName"
              placeholder="Insira o nome completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            {error.fullName && (
              <span className="text-sm text-destructive">{error.fullName}</span>
            )}
          </div>

          <div className="w-full flex flex-col gap-2">
            <Label className="font-bold text-slate-600" htmlFor="fullName">
              CPF*
            </Label>

            <Input
              id="fullName"
              placeholder="Insira o seu CPF"
              value={cpf}
              onChange={handleCpf}
              maxLength={14}
            />

            {error.cpf && (
              <span className="text-sm text-destructive">{error.cpf}</span>
            )}
          </div>

          <div className="w-full flex flex-col gap-2">
            <Label className="font-bold text-slate-600" htmlFor="email">
              E-mail*
            </Label>

            <Input
              id="email"
              type="email"
              placeholder="Insira o seu e-mail de contato"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error.email && (
              <span className="text-sm text-destructive">{error.email}</span>
            )}
          </div>

          <div className="w-full flex flex-col gap-2">
            <Label className="font-bold text-slate-600" htmlFor="tel">
              Telefone*
            </Label>

            <PhoneInput
              id="tel"
              defaultCountry="BR"
              value={tel}
              onChange={setTel}
              limitMaxLength
              smartCaret={false}
              className="flex h-12 w-full rounded-xl border border-skin-primary/40 bg-background px-3 py-2 text-sm ring-0 ring-offset-0 outline-none transition file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-within:ring-0 focus-within:border-skin-primary disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Insira o seu telefone de contato"
            />

            {error.tel && (
              <span className="text-sm text-destructive">{error.tel}</span>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col gap-2">
          <Label className="font-bold text-slate-600" htmlFor="message">
            Mensagem
          </Label>

          <Textarea
            id="message"
            placeholder="Insira a sua mensagem"
            className="resize-none sm:!h-full"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
