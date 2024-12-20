import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Img,
  Text,
  Hr,
  Section,
  Button,
  Link,
} from "@react-email/components";

const imageUrl =
  process.env.NODE_ENV === "production"
    ? `${process.env.BASE_URL}/zuro-email.png`
    : "/static/zuro-email.png";

interface Props {
  service: string;
  date: string;
  name: string;
  clientName: string;
  clientContact: string;
  time: string;
  message: string | null;
  url: string;
}

export default function ProfessionalServiceSchedulesNotification({
  service,
  date,
  name,
  clientName,
  clientContact,
  time,
  message,
  url,
}: Props) {
  return (
    <Html lang="ptBR" style={html}>
      <Head />

      <Preview>
        Serviço {service ?? "Serviço teste"} agendado para o dia{" "}
        {date ?? "01/01/2025"}
      </Preview>

      <Body style={main}>
        <Container style={container}>
          <Img src={imageUrl} alt="Zuro" width="80" height="80" style={image} />

          <Text style={title}>Olá {name ?? "Nome teste"},</Text>

          <Text style={subtitle}>Esperamos que esteja tudo bem com você.</Text>

          <Text style={subtitle}>
            Gostaríamos de informar que você recebeu um novo agendamento de um
            cliente através de nossa plataforma. Abaixo estão os detalhes do
            agendamento:
          </Text>

          <ul>
            <li>
              <Text style={paragraph}>
                <strong>Nome do Cliente</strong>: {clientName ?? "Nome teste"}
              </Text>
            </li>

            <li>
              <Text style={paragraph}>
                <strong>Contato do Cliente</strong>:{" "}
                {clientContact ?? "(11) 91004-1998"}
              </Text>
            </li>

            <li>
              <Text style={paragraph}>
                <strong>Serviço solicitado</strong>:{" "}
                {service ?? "Serviço teste"}
              </Text>
            </li>

            <li>
              <Text style={paragraph}>
                <strong>Data e Hora</strong>: {date ?? "01/01/2025"} às{" "}
                {time ?? "10:00"}
              </Text>
            </li>

            {message && (
              <li>
                <Text style={paragraph}>
                  <strong>Mensagem</strong>: {message}
                </Text>
              </li>
            )}
          </ul>

          <Text style={paragraph}>
            Se você não solicitou essa alteração, por favor, ignore este e-mail.
            O link de redefinição é válido por 1 hora.
          </Text>

          <Section style={buttonContainer}>
            <Button href={url} style={button}>
              Acessar a plataforma
            </Button>
          </Section>

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

const buttonContainer = {
  margin: "27px auto",
  width: "auto",
};

const button = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "#5171e1",
  borderRadius: "12px",
  fontWeight: "600",
  fontSize: "16px",
  color: "#fff",
  textAlign: "center" as const,
  padding: "16px 24px",
  margin: "0 auto",
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
