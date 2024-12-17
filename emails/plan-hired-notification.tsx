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
  productName: string;
  productPrice: string;
  hiredDate: string;
}

export default function PlanHiredNotification({
  productName,
  productPrice,
  hiredDate,
}: Props) {
  return (
    <Html style={html}>
      <Head />

      <Preview>Confirmação de Contratação do Plano - Zuro</Preview>

      <Body style={main}>
        <Container style={container}>
          <Img src={imageUrl} alt="Zuro" width="80" height="80" style={image} />

          <Text style={title}>
            Parabens! A contratação do seu plano foi realizada com sucesso e
            agora você tem acesso a todas as funcionalidades exclusivas do nosso
            sistema. Veja os detalhes do plano:
          </Text>

          <ul>
            <li>
              <Text style={paragraph}>
                <strong>Plano</strong>: {productName ?? "Plano teste"}
              </Text>
            </li>

            <li>
              <Text style={paragraph}>
                <strong>Valor</strong>: {productPrice ?? "R$ 0,00"}
              </Text>
            </li>

            <li>
              <Text style={paragraph}>
                <strong>Data de contratação</strong>:{" "}
                {hiredDate ?? "01/01/2025"}
              </Text>
            </li>
          </ul>

          <Text style={subtitle}>
            Você já pode começar a aproveitar todas as ferramentas e recursos
            disponíveis para potencializar seus atendimentos e melhorar a
            experiência dos seus clientes!
          </Text>

          <Text style={subtitle}>
            Caso tenha alguma dúvida ou precise de suporte, não hesite em entrar
            em contato com a nossa equipe.
          </Text>

          <Text style={subtitle}>Obrigado por confiar em nossos serviços!</Text>

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
