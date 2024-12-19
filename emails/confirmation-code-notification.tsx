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
  Heading,
} from "@react-email/components";

const imageUrl =
  process.env.NODE_ENV === "production"
    ? `${process.env.BASE_URL}/zuro-email.png`
    : "/static/zuro-email.png";

interface Props {
  name: string;
  code: string;
}

export default function ConfirmationCodeNotification({ name, code }: Props) {
  return (
    <Html style={html}>
      <Head />

      <Preview>Código de Confirmação para Alteração do E-mail - Zuro</Preview>

      <Body style={main}>
        <Container style={container}>
          <Img src={imageUrl} alt="Zuro" width="80" height="80" style={image} />

          <Text style={title}>Olá {name ?? "Nome teste"},</Text>

          <Text style={subtitle}>
            Recebemos sua solicitação para troca do e-mail da sua conta. Para
            confirmar esta alteração, insira o código abaixo no campo
            solicitado:
          </Text>

          <Section style={codeContainer}>
            <Heading style={codeStyle}>{code}</Heading>
          </Section>

          <Hr style={hrLine} />

          <Text style={linkParagraph}>
            Este código é válido por 15 minutos. Se você não solicitou a
            alteração do e-mail, por favor, desconsidere este e-mail.
          </Text>

          <Text style={linkParagraph}>
            Se precisar de ajuda, entre em contato conosco.
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
const codeContainer = {
  background: "rgba(0,0,0,.05)",
  borderRadius: "4px",
  margin: "16px auto 14px",
  verticalAlign: "middle",
  width: "280px",
  maxWidth: "100%",
};

const codeStyle = {
  color: "#000",
  display: "inline-block",
  paddingBottom: "8px",
  paddingTop: "8px",
  margin: "0 auto",
  width: "100%",
  textAlign: "center" as const,
  letterSpacing: "0px",
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
