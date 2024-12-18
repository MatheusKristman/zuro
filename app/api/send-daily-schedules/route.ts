import { format } from "date-fns";
import nodemailer from "nodemailer";
import { Schedule, Service, User } from "@prisma/client";

import { prisma } from "@/lib/db";
import { render } from "@react-email/components";
import DailySchedulesNotification from "@/emails/daily-schedules-notification";

type ScheduleType = Schedule & {
  user: User;
  service: Service;
};

export async function POST() {
  try {
    const devEmailUser = process.env.EMAIL_DEV_USER!;
    const devEmailPass = process.env.EMAIL_DEV_PASS!;
    const emailUser = process.env.EMAIL_USER!;
    const emailPass = process.env.EMAIL_PASS!;
    const devConfig = {
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: devEmailUser,
        pass: devEmailPass,
      },
    };
    const prodConfig = {
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    };

    const today = format(new Date(), "yyyy-MM-dd");

    const todaySchedules = await prisma.schedule.findMany({
      where: {
        date: today,
      },
      include: {
        user: true,
        service: true,
      },
    });

    if (todaySchedules.length === 0) {
      return new Response("Sem agendamentos no dia", { status: 200 });
    }

    const groupedSchedules: Record<string, ScheduleType[]> =
      todaySchedules.reduce(
        (acc, schedule) => {
          if (
            schedule.user.emailNotification &&
            schedule.user.notificationDailySchedules
          ) {
            const professionalEmail = schedule.user.email!;

            if (!acc[professionalEmail]) {
              acc[professionalEmail] = [];
            }

            acc[professionalEmail].push(schedule);
          }

          return acc;
        },
        {} as Record<string, ScheduleType[]>,
      );

    if (Object.entries(groupedSchedules).length === 0) {
      return new Response(
        "Sem e-mails para enviar as notificações dos agendamentos",
        {
          status: 200,
        },
      );
    }

    for (const [email, schedules] of Object.entries(groupedSchedules)) {
      const emailHtml = await render(
        DailySchedulesNotification({
          name: schedules[0].user.name!,
          date: format(new Date(), "dd/MM/yyyy"),
          schedules,
        }),
      );

      const options = {
        from: emailUser,
        to: email,
        subject: "Seus agendamentos de hoje - Zuro",
        html: emailHtml,
      };

      if (process.env.NODE_ENV === "development") {
        const transporter = nodemailer.createTransport(devConfig);

        await transporter.sendMail(options);
      } else {
        const transporter = nodemailer.createTransport(prodConfig);

        await transporter.sendMail(options);
      }
    }

    return new Response("Enviado agendamentos do dia nos e-mails cadastrados", {
      status: 200,
    });
  } catch (err) {
    console.log(`[ERROR_SEND_DAILY_SCHEDULES]: ${err}`);

    return new Response(`[ERROR_SEND_DAILY_SCHEDULES]: ${err}`, {
      status: 500,
    });
  }
}
