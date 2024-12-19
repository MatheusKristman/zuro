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
  Section,
  Button,
} from "@react-email/components";

const imageUrl =
  process.env.NODE_ENV === "production"
    ? `${process.env.BASE_URL}/zuro-email.png`
    : "/static/zuro-email.png";

interface Props {
  productName: string;
  cancelDate: string;
  url: string;
}

export default function PlanCancelledNotification({
  productName,
  url,
  cancelDate,
}: Props) {
  return (
    <Html lang="ptBR" style={html}>
      <Head />

      <Preview>Seu Plano Foi Encerrado - Zuro</Preview>

      <Body style={main}>
        <Container style={container}>
          <Img src={imageUrl} alt="Zuro" width="80" height="80" style={image} />

          <Text style={title}>Olá,</Text>

          <Text style={subtitle}>
            Gostaríamos de informar que o seu plano {productName} foi encerrado
            na data {cancelDate}.
          </Text>

          <Text style={subtitle}>
            Se você deseja continuar aproveitando os recursos exclusivos que
            ajudam a impulsionar seus atendimentos, é possível renovar ou
            contratar um novo plano a qualquer momento.
          </Text>

          <Section style={buttonContainer}>
            <Button href={url} style={button}>
              Renovar plano
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

const hrLine = {
  width: "100%",
  marginBottom: "16px !important",
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
