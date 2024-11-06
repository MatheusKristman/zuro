import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PaymentPreference() {
  return (
    <div className="bg-white rounded-3xl p-6">
      <h3 className="text-3xl font-bold text-skin-primary mb-4">Preferência de Pagamento</h3>

      <div className="flex flex-col gap-2 mb-4">
        <h4 className="text-xl font-semibold">Quando pretende receber os pagamentos</h4>

        {/* TODO: adicionar variant dinamicamente de acordo com o que estiver selecionado */}
        <div className="grid grid-cols-1 grid-rows-[auto] gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Button size="xl">Receber Antes e Depois</Button>

          <Button variant="outline" size="xl">
            Receber Antes
          </Button>

          <Button variant="outline" size="xl">
            Receber Depois
          </Button>
        </div>
      </div>

      {/* TODO: aparecer somente se o valor antes e depois ou sempre antes */}
      <div className="flex flex-col gap-2">
        <h4 className="text-xl font-semibold">Chave Pix</h4>

        <Input placeholder="Insira a sua chave pix" />
      </div>
    </div>
  );
}
