import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Img,
  Text,
  Hr,
  Link,
} from "@react-email/components";

const imageUrl =
  process.env.NODE_ENV === "production"
    ? `${process.env.NEXT_PUBLIC_BASEURL}/assets/images/logo.svg`
    : "/static/logo.svg";

interface Props {
  service: string;
  date: string;
  name: string;
  clientName: string;
  time: string;
}

export default function ProfessionalScheduleCancelNotification({
  service,
  date,
  name,
  clientName,
  time,
}: Props) {
  return (
    <Html style={html}>
      <Head />

      <Preview>Confirmação de Cancelamento do Agendamento - Zuro</Preview>

      <Body style={main}>
        <Container style={container}>
          <Img src={imageUrl} alt="Zuro" width="80" height="80" style={image} />

          <Text style={title}>Olá {name ?? "Nome teste"},</Text>

          <Text style={subtitle}>
            Gostaríamos de informar que o seu agendamento foi cancelado com
            sucesso. Abaixo estão os detalhes do agendamento cancelado:
          </Text>

          <ul>
            <li>
              <Text style={paragraph}>
                <strong>Cliente</strong>: {clientName ?? "Nome teste"}
              </Text>
            </li>

            <li>
              <Text style={paragraph}>
                <strong>Serviço</strong>: {service ?? "Serviço teste"}
              </Text>
            </li>

            <li>
              <Text style={paragraph}>
                <strong>Data e Hora</strong>: {date ?? "01/01/2025"} às{" "}
                {time ?? "10:00"}
              </Text>
            </li>
          </ul>

          <Text style={paragraph}>
            Se esta ação foi realizada por engano ou se deseja reagendar, envie
            o link de agendamento para o cliente novamente.
          </Text>

          <Hr style={hrLine} />

          <Text style={linkParagraph}>
            Contato:{" "}
            <Link href="mailto:suporte@zuro.com.br" style={link}>
              suporte@zuro.com.br
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const html = {
  backgroundColor: "#5171e1",
  width: "100%",
  height: "100%",
};

const main = {
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textAlign: "center" as const,
  padding: "50px 20px 50px 20px",
};

const image = {
  margin: "0 auto 20px",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #ddd",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "480px",
  margin: "0 auto",
  padding: "6% 6%",
};

const title = {
  color: "#1e293b",
  fontSize: "18px",
  textAlign: "left" as const,
};

const subtitle = {
  color: "#1e293b",
  fontSize: "16px",
  textAlign: "left" as const,
};

const hrLine = {
  width: "100%",
  marginBottom: "16px !important",
};

const paragraph = {
  color: "#64748b",
  letterSpacing: "0",
  margin: "0",
  textAlign: "left" as const,
};

const linkParagraph = {
  color: "#64748b",
  letterSpacing: "0",
  margin: "0",
  marginTop: "16px",
  textAlign: "center" as const,
};

const link = {
  color: "#444",
  textDecoration: "underline",
};
