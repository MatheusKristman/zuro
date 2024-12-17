import Stripe from "stripe";
import { render } from "@react-email/components";
import { format } from "date-fns";
import nodemailer from "nodemailer";

import PlanHiredNotification from "@/emails/plan-hired-notification";
import PlanCancelledNotification from "@/emails/plan-cancelled-notification";

import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/utils";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("Stripe-Signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const devEmailUser = process.env.EMAIL_DEV_USER!;
  const devEmailPass = process.env.EMAIL_DEV_PASS!;
  const emailUser = process.env.EMAIL_USER!;
  const emailPass = process.env.EMAIL_PASS!;
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? process.env.BASE_URL_DEV!
      : process.env.BASE_URL!;
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

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error(`[ERROR_WEBHOOK]: ${error}`);

    return new Response(`[ERROR_WEBHOOK]: ${error}`, { status: 500 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const subscriptionId = event.data.object.subscription;
      const subscription = await stripe.subscriptions.retrieve(
        subscriptionId as string,
      );
      const prodId = subscription.items.data[0].price.product;
      const product = await stripe.products.retrieve(prodId as string);
      const userSub = await prisma.subscription.findFirst({
        where: {
          stripeSubscriptionId: subscriptionId as string,
        },
        include: {
          user: true,
        },
      });

      const emailHtml = await render(
        PlanHiredNotification({
          productName: product.name,
          productPrice: formatPrice(
            subscription.items.data[0].price.unit_amount! / 100,
          ),
          hiredDate: format(
            new Date(subscription.current_period_start),
            "dd/MM/yyyy",
          ),
        }),
      );

      const options = {
        from: emailUser,
        to: userSub!.user.email!,
        subject: "Confirmação de Contratação do Plano - Zuro",
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

    if (event.type === "customer.subscription.deleted") {
      const subscriptionId = event.data.object.id;
      const subscription = await stripe.subscriptions.retrieve(
        subscriptionId! as string,
      );
      const prodId = subscription.items.data[0].price.product;
      const product = await stripe.products.retrieve(prodId as string);
      const userSub = await prisma.subscription.findFirst({
        where: {
          stripeSubscriptionId: subscriptionId,
        },
        include: {
          user: true,
        },
      });

      await prisma.subscription.delete({
        where: {
          stripeSubscriptionId: subscriptionId,
        },
      });

      const emailHtml = await render(
        PlanCancelledNotification({
          productName: product.name,
          url: `${baseUrl}/dashboard/conta/plano`,
          cancelDate: format(new Date(subscription.canceled_at!), "dd/MM/yyyy"),
        }),
      );

      const options = {
        from: emailUser,
        to: userSub!.user.email!,
        subject: "Seu Plano Foi Encerrado - Zuro",
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
  } catch (error) {
    console.log(`[ERROR_WEBHOOK_HANDLER]: ${error}`);

    return new Response(`[ERROR_WEBHOOK_HANDLER]: ${error}`, { status: 400 });
  }

  return new Response("Webhook executado com sucesso", { status: 200 });
}
