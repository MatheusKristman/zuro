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
    ? `${process.env.BASE_URL}/logo.svg`
    : "/static/logo.svg";

interface Props {
  service: string;
  date: string;
  name: string;
  time: string;
  professionalName: string;
}

export default function ClientServiceScheduleNotification({
  service,
  date,
  name,
  time,
  professionalName,
}: Props) {
  return (
    <Html style={html}>
      <Head />

      <Preview>
        Serviço {service ?? "Serviço teste"} agendado para o dia{" "}
        {date ?? "01/01/2025"}
      </Preview>

      <Body style={main}>
        <Container style={container}>
          <Img src={imageUrl} alt="Zuro" width="80" height="80" style={image} />

          <Text style={title}>Olá {name ?? "Nome teste"},</Text>

          <Text style={subtitle}>
            Seu agendamento foi realizado com sucesso! Abaixo estão os detalhes
            do seu atendimento:
          </Text>

          <ul>
            <li>
              <Text style={paragraph}>
                <strong>Profissional</strong>:{" "}
                {professionalName ?? "Profissional teste"}
              </Text>
            </li>

            <li>
              <Text style={paragraph}>
                <strong>Serviço agendado</strong>: {service ?? "Serviço teste"}
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
            Caso precise remarcar ou cancelar o agendamento, entre em contato
            com o profissional.
          </Text>

          <Hr style={hrLine} />

          <Text style={paragraph}>
            Agradecemos por escolher nossos serviços!
          </Text>

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
