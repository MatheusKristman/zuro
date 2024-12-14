import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Copy, FileCheck2, Loader2, Upload } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { PaymentPreference } from "@prisma/client";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc-client";
import { useUploadThing } from "@/lib/uploadthing";
import { ScheduleStore } from "@/stores/schedule-store";

interface ServicePaymentProps {
  paymentPreference: PaymentPreference | null | undefined;
  userId: string;
  pixCode: string | null | undefined;
}

export function ServicePayment({
  paymentPreference,
  userId,
  pixCode,
}: ServicePaymentProps) {
  const router = useRouter();

  const [receipt, setReceipt] = useState<null | File[]>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>(
    paymentPreference ?? "",
  );
  const [pixKey] = useState<string>(pixCode ?? "");

  const {
    isConclude,
    setIsConclude,
    date,
    service,
    time,
    fullName,
    email,
    tel,
    message,
  } = ScheduleStore();

  const { mutate: submitSchedule, isPending } =
    trpc.scheduleRouter.submitSchedule.useMutation({
      onSuccess: () => {
        router.push(`/agendar/${userId}?step=4`);
      },
      onError: (err) => {
        console.error(err.data);

        toast.error(
          "Ocorreu um erro ao finalizar o agendamento, tente novamente mais tarde",
        );
      },
    });

  const { startUpload, isUploading, routeConfig } = useUploadThing(
    "sendPixReceipt",
    {
      onClientUploadComplete: (res) => {
        submitSchedule({
          date: format(date!, "yyyy-MM-dd"),
          email,
          message,
          time,
          fullName,
          tel,
          paymentMethod: paymentMethod as "before" | "after",
          receiptUrl: res[0].serverData.receiptUrl,
          serviceId: service,
          userId,
        });
      },
      onUploadError: (error) => {
        console.error(error.message);

        if (error.message === "Invalid config: FileSizeMismatch") {
          toast.error(
            "Arquivo que está sendo enviado é muito grande, o arquivo deve ter no máximo 4MB",
          );
        } else {
          toast.error(
            "Ocorreu um erro ao enviar o comprovante, tente novamente mais tarde",
          );
        }
      },
    },
  );

  const pending = isUploading || isPending;
  const fileTypes = routeConfig ? Object.keys(routeConfig) : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setReceipt(acceptedFiles);
    },
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  useEffect(() => {
    console.log({ paymentPreference, paymentMethod });
  }, [paymentPreference, paymentMethod]);

  useEffect(() => {
    if (isConclude) {
      if (paymentMethod === "before") {
        if (receipt) {
          startUpload(receipt);
        } else {
          toast.error("Envie o comprovante para concluir o processo");
        }
      } else {
        submitSchedule({
          date: format(date!, "yyyy-MM-dd"),
          email,
          message,
          time,
          fullName,
          tel,
          paymentMethod: paymentMethod as "before" | "after",
          receiptUrl: "",
          serviceId: service,
          userId,
        });
      }

      setIsConclude(false);
    }
  }, [isConclude, setIsConclude, startUpload]);

  function copyToClipboard() {
    if (!navigator.clipboard) {
      // Fallback para navegadores que não suportam o Clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = pixKey;
      textArea.style.position = "fixed"; // Evita que o textarea afete o layout
      textArea.style.opacity = "0"; // Torna invisível
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        toast.success("Código do pix copiado com sucesso!");
      } catch (err) {
        console.error("Erro ao copiar o código do pix: ", err);
        toast.error("Não foi possível copiar o código do pix.");
      }

      document.body.removeChild(textArea);
    } else {
      // Uso moderno do Clipboard API
      navigator.clipboard.writeText(pixKey).then(
        () => toast.success("Código do pix copiado com sucesso!"),
        (err) => {
          console.error("Erro ao copiar o código do pix: ", err);
          toast.error("Não foi possível copiar o código do pix.");
        },
      );
    }
  }

  function handleCancelFile() {
    setReceipt(null);
  }

  return (
    <div className="relative w-full max-w-4xl bg-white rounded-3xl p-6 mt-10">
      <div
        className={cn(
          "absolute z-40 top-0 bottom-0 left-0 right-0 w-full h-full rounded-3xl bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-fade-in",
          {
            hidden: !isPending && !isUploading,
          },
        )}
      >
        <Loader2 size={70} className="animate-spin text-skin-primary" />

        <span className="text-2xl text-center text-skin-primary font-semibold">
          Enviando comprovante...
        </span>
      </div>

      <h2 className="text-2xl font-semibold text-skin-primary text-center sm:text-left">
        Pagamento do serviço
      </h2>

      {paymentPreference && paymentPreference === "before_after" && (
        <div className="w-full flex flex-col gap-4 mt-10">
          <span className="text-xl font-semibold text-center sm:text-left">
            Quando deseja realizar o pagamento?
          </span>

          <ToggleGroup
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            type="single"
            className="w-full"
          >
            <ToggleGroupItem
              value="before"
              variant="outline"
              size="xl"
              className="w-full"
              disabled={pending}
            >
              Agora
            </ToggleGroupItem>

            <ToggleGroupItem
              value="after"
              variant="outline"
              size="xl"
              className="w-full"
              disabled={pending}
            >
              Depois
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      {(paymentPreference === "before" || paymentMethod === "before") && (
        <div className="w-full flex flex-col gap-6 mt-10">
          <div className="w-full flex flex-col gap-6 sm:flex-row">
            <div className="w-full flex flex-col items-center gap-2">
              <span className="text-xl font-semibold text-center">
                Escaneie o QR Code do Pix
              </span>

              <div className="w-full aspect-square max-w-56">
                <QRCodeCanvas value={pixKey} className="!w-full !h-full" />
              </div>
            </div>

            <div className="w-full flex items-center justify-between gap-1 sm:flex-col sm:w-fit">
              <div className="w-full h-px bg-skin-primary sm:w-px sm:h-full" />

              <span className="text-skin-primary text-lg text-center">OU</span>

              <div className="w-full h-px bg-skin-primary sm:w-px sm:h-full" />
            </div>

            <div className="w-full flex flex-col items-center gap-4">
              <div className="w-full flex flex-col items-center gap-2">
                <span className="text-xl font-semibold text-center">
                  Copie o código Pix
                </span>

                <Textarea
                  value={pixKey}
                  disabled
                  className="resize-none disabled:opacity-100 disabled:border-skin-primary"
                />
              </div>

              <Button
                disabled={pending}
                onClick={copyToClipboard}
                size="xl"
                className="w-full"
              >
                <Copy />
                Copiar
              </Button>
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-2">
            <span className="text-lg font-medium text-center max-w-sm">
              Para confirmar seu agendamento, por favor, realize a transferência
              via PIX para a chave indicada e envie o comprovante abaixo.
            </span>

            <div
              className="w-full rounded-xl border-2 border-dashed border-skin-primary/40 aspect-video flex flex-col gap-2 items-center justify-center max-w-xs"
              {...getRootProps()}
            >
              <input disabled={pending} {...getInputProps()} />
              {receipt ? (
                <>
                  <FileCheck2 size={30} className="text-skin-primary" />

                  <span className="text-sm text-skin-primary text-center max-w-40">
                    {receipt[0].name}
                  </span>
                </>
              ) : (
                <>
                  <Upload size={30} className="text-skin-primary" />

                  <span className="text-sm text-skin-primary text-center max-w-40">
                    Arraste ou clique para enviar o arquivo
                  </span>
                </>
              )}
            </div>

            {receipt && (
              <Button
                disabled={pending}
                variant="destructive"
                size="xl"
                onClick={handleCancelFile}
                className="w-full max-w-xs"
              >
                Deletar arquivo
              </Button>
            )}
          </div>
        </div>
      )}

      {(paymentPreference === "after" || paymentMethod === "after") && (
        <div className="w-full mt-10 p-4 bg-black/10 rounded-xl">
          <p className="block font-medium text-center">
            Após realizar o agendamento, não se esqueça de efetuar o pagamento{" "}
            <strong>diretamente com o profissional</strong>. Isso garante a
            confirmação e a realização do serviço com toda a segurança e
            qualidade que você merece!
          </p>
        </div>
      )}
    </div>
  );
}
