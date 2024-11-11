import { Check } from "lucide-react";

export function FinishConfigurationMessage() {
  return (
    <div className="bg-white rounded-3xl p-6 py-12 flex flex-col items-center gap-6 justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-skin-primary flex items-center justify-center">
          <Check size={70} color="#FFF" />
        </div>

        <h4 className="text-3xl font-semibold text-skin-primary text-center">Configuração concluída com sucesso!</h4>
      </div>

      <span className="max-w-xl text-lg text-foreground/70 text-center">
        Parabéns! A configuração foi finalizada e tudo está pronto para uso. Agora você pode aproveitar todas as
        funcionalidades disponíveis e explorar o que preparamos para você.
      </span>
    </div>
  );
}
