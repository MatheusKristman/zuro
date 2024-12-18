import { Schedule, Service, User } from "@prisma/client";
import { Html, Head, Preview, Body, Container, Img, Text, Hr, Link } from "@react-email/components";

type ScheduleType = Schedule & {
  user: User;
  service: Service;
};

const imageUrl = process.env.NODE_ENV === "production" ? `${process.env.BASE_URL}/logo.svg` : "/static/logo.svg";

const SCHEDULES_EXAMPLE = [
  {
    id: 0,
    fullName: "teste 1",
    time: "10:00",
    service: {
      name: "Serviço teste 1",
    },
  },
  {
    id: 1,
    fullName: "teste 2",
    time: "11:00",
    service: {
      name: "Serviço teste 2",
    },
  },
  {
    id: 2,
    fullName: "teste 3",
    time: "12:00",
    service: {
      name: "Serviço teste 3",
    },
  },
];

interface Props {
  date: string;
  name: string;
  schedules: ScheduleType[];
}

export default function DailySchedulesNotification({ date, name, schedules }: Props) {
  return (
    <Html style={html}>
      <Head />

      <Preview>Seus agendamentos de hoje - Zuro</Preview>

      <Body style={main}>
        <Container style={container}>
          <Img src={imageUrl} alt="Zuro" width="80" height="80" style={image} />

          <Text style={title}>Olá {name ?? "Nome teste"},</Text>

          <Text style={subtitle}>Aqui estão os seus agendamentos de hoje ({date ?? "01/01/2025"}):</Text>

          {schedules && schedules.length > 0
            ? schedules.map((schedule) => (
                <ul key={schedule.id} style={list}>
                  <li>
                    <Text style={paragraph}>
                      <strong>Cliente</strong>: {schedule.fullName ?? "Cliente teste"}
                    </Text>
                  </li>

                  <li>
                    <Text style={paragraph}>
                      <strong>Horário</strong>: {schedule.time ?? "10:00"}
                    </Text>
                  </li>

                  <li>
                    <Text style={paragraph}>
                      <strong>Serviço</strong>: {schedule.service.name ?? "Serviço teste"}
                    </Text>
                  </li>
                </ul>
              ))
            : SCHEDULES_EXAMPLE.map((schedule) => (
                <ul key={schedule.id} style={list}>
                  <li>
                    <Text style={paragraph}>
                      <strong>Cliente</strong>: {schedule.fullName ?? "Cliente teste"}
                    </Text>
                  </li>

                  <li>
                    <Text style={paragraph}>
                      <strong>Horário</strong>: {schedule.time ?? "10:00"}
                    </Text>
                  </li>

                  <li>
                    <Text style={paragraph}>
                      <strong>Serviço</strong>: {schedule.service.name ?? "Serviço teste"}
                    </Text>
                  </li>
                </ul>
              ))}

          <Hr style={hrLine} />

          <Text style={linkParagraph}>Tenha um excelente dia de trabalho!</Text>

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

const list = {
  marginBottom: "25px",
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
