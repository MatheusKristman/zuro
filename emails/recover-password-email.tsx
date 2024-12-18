import { Html, Head, Preview, Body, Container, Img, Text, Hr, Section, Button, Link } from "@react-email/components";

const imageUrl = process.env.NODE_ENV === "production" ? `${process.env.BASE_URL}/logo.svg` : "/static/logo.svg";

interface Props {
  name: string;
  url: string;
}

export default function RecoverPasswordEmail({ name, url }: Props) {
  return (
    <Html style={html}>
      <Head />

      <Preview>Redefina sua senha - Zuro</Preview>

      <Body style={main}>
        <Container style={container}>
          <Img src={imageUrl} alt="Zuro" width="80" height="80" style={image} />

          <Text style={title}>Olá {name ?? "Nome teste"},</Text>

          <Text style={subtitle}>
            Recebemos uma solicitação para redefinir a senha da sua conta no Zuro. Clique no botão abaixo para criar uma
            nova senha:
          </Text>

          <Section style={buttonContainer}>
            <Button href={url} style={button}>
              Recuperar minha senha
            </Button>
          </Section>

          <Hr style={hrLine} />

          <Text style={linkParagraph}>
            Se você não solicitou essa alteração, por favor, ignore este e-mail. O link de redefinição é válido por 1
            hora.
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

const buttonContainer = {
  margin: "27px auto",
  width: "auto",
};

const button = {
  height: "48px",
  display: "flex",
  alignItems: "center",
  backgroundColor: "#5171e1",
  borderRadius: "12px",
  fontWeight: "600",
  color: "#fff",
  textAlign: "center" as const,
  padding: "0px 24px",
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
