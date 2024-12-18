import { Html, Head, Preview, Body, Container, Img, Text, Hr, Link, Section, Button } from "@react-email/components";

const imageUrl = process.env.NODE_ENV === "production" ? `${process.env.BASE_URL}/logo.svg` : "/static/logo.svg";

interface Props {
  name: string;
  email: string;
  password: string;
  url: string;
}

export default function GeneratedPassword({ name, email, password, url }: Props) {
  return (
    <Html style={html}>
      <Head />

      <Preview>Bem-vindo à nossa plataforma! - Zuro</Preview>

      <Body style={main}>
        <Container style={container}>
          <Img src={imageUrl} alt="Zuro" width="80" height="80" style={image} />

          <Text style={title}>Olá {name ?? "Nome teste"},</Text>

          <Text style={subtitle}>
            Bem-vindo à nossa plataforma de agendamento Zuro! Estamos felizes em tê-lo conosco.
          </Text>

          <Text style={subtitle}>Abaixo estão os detalhes para acessar sua conta:</Text>

          <ul>
            <li>
              <Text style={paragraph}>
                <strong>E-mail</strong>: {email ?? "emailteste@email.com"}
              </Text>
            </li>

            <li>
              <Text style={paragraph}>
                <strong>Senha</strong>: {password ?? "Senha teste"}
              </Text>
            </li>
          </ul>

          <Text style={paragraph}>
            Recomendamos que você altere sua senha após o primeiro acesso para garantir sua segurança.
          </Text>

          <Text style={paragraph}>Acesse sua conta pelo botão abaixo:</Text>

          <Section style={buttonContainer}>
            <Button href={url} style={button}>
              Acessar conta
            </Button>
          </Section>

          <Hr style={hrLine} />

          <Text style={linkParagraph}>Se precisar de ajuda ou tiver alguma dúvida, estamos aqui para ajudar.</Text>

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
