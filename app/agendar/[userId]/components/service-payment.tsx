import { toast } from "sonner";
import { useState } from "react";
import { Copy } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { PaymentPreference } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { useUploadThing } from "@/lib/uploadthing";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";

interface ServicePaymentProps {
  paymentPreference: PaymentPreference | null | undefined;
}

export function ServicePayment({ paymentPreference }: ServicePaymentProps) {
  const [receipt, setReceipt] = useState<null | File[]>(null);

  const { startUplaod, isUploading, routeConfig } = useUploadThing(
    "sendPixReceipt",
    {
      onClientUploadComplete: (res) => {
        console.log(res[0].serverData.receiptUrl);

        //TODO: executar função para criar schedule com o resto das informações do form
      },
      onUploadError: (error) => {
        console.error(error.data);

        toast.error(
          "Ocorreu um erro ao enviar o comprovante, tente novamente mais tarde",
        );
      },
    },
  );

  const fileTypes = routeConfig ? Object.keys(routeConfig) : [];

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: (acceptedFiles) => {
      setReceipt(acceptedFiles);
    },
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  function handleCancelImage() {
    setReceipt(null);
  }

  return (
    <div className="w-full max-w-4xl bg-white rounded-3xl p-6 mt-10">
      <h2 className="text-2xl font-semibold text-skin-primary">
        Pagamento do serviço
      </h2>

      {paymentPreference && paymentPreference === "before_after" && (
        <div className="w-full flex flex-col gap-4 mt-10">
          <span className="text-xl font-semibold text-center">
            Quando deseja realizar o pagamento?
          </span>

          <ToggleGroup type="single" className="w-full">
            <ToggleGroupItem
              value="before"
              variant="outline"
              size="xl"
              className="w-full"
            >
              Agora
            </ToggleGroupItem>

            <ToggleGroupItem
              value="after"
              variant="outline"
              size="xl"
              className="w-full"
            >
              Depois
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      <div className="w-full flex flex-col gap-6 mt-10">
        <div className="w-full flex flex-col items-center gap-2">
          <span className="text-xl font-semibold text-center">
            Escaneie o QR Code do Pix
          </span>

          <div className="w-full aspect-square max-w-56">
            <QRCodeCanvas
              value="https://reactjs.org/"
              className="!w-full !h-full"
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-between gap-1">
          <div className="w-full h-px bg-skin-primary" />

          <span className="text-skin-primary text-lg text-center">OU</span>

          <div className="w-full h-px bg-skin-primary" />
        </div>

        <div className="w-full flex flex-col items-center gap-4">
          <div className="w-full flex flex-col items-center gap-2">
            <span className="text-xl font-semibold text-center">
              Copie o código Pix
            </span>

            <Textarea
              value="https://reactjs.org/"
              disabled
              className="resize-none disabled:opacity-100 disabled:border-skin-primary"
            />
          </div>

          <Button size="xl" className="w-full">
            <Copy />
            Copiar
          </Button>
        </div>

        <div className="w-full flex flex-col items-center gap-2">
          <span className="text-lg font-medium text-center">
            Para confirmar seu agendamento, por favor, realize a transferência
            via PIX para a chave indicada e envie o comprovante abaixo.
          </span>

          <div
            className="w-full rounded-xl border-2 border-dashed border-skin-primary/40 aspect-video"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {/* TODO: mudar ordem para aparecer resumo antes e criar o resto do design para envio de arquivo */}
          </div>
        </div>
      </div>
    </div>
  );
}
