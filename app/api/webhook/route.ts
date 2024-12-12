import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("Stripe-Signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error(`[ERROR_WEBHOOK]: ${error}`);

    return new Response(`[ERROR_WEBHOOK]: ${error}`, { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        break;
    }
    console.log(event.type);
  } catch (error) {
    console.log(`[ERROR_WEBHOOK_HANDLER]: ${error}`);

    return new Response(`[ERROR_WEBHOOK_HANDLER]: ${error}`, { status: 400 });
  }

  return new Response("Webhook executado com sucesso", { status: 200 });
}
