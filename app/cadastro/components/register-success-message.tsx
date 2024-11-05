import { motion } from "framer-motion";

const animation = {
  hidden: {
    x: 100,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    x: -100,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: "easeIn",
    },
  },
};

export function RegisterSuccessMessage() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      exit="exit"
      variants={animation}
      className="w-full flex flex-col items-center gap-6"
    >
      <h2 className="text-3xl font-bold text-center text-slate-800 capitalize !leading-tight">
        Cadastro realizado com sucesso
      </h2>

      <div className="flex flex-col gap-4">
        <p className="text-lg font-medium text-center text-slate-600 !leading-tight">
          Em breve, você receberá uma <strong>senha temporária</strong> em seu{" "}
          <strong>e-mail</strong> para acessar a plataforma de agendamento.
        </p>

        <p className="text-lg font-medium text-center text-slate-600 !leading-tight">
          Verifique sua caixa de entrada (e a pasta de spam, se necessário) e
          siga as instruções para o primeiro acesso.
        </p>
      </div>
    </motion.div>
  );
}
