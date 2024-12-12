import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

// Plano 127,90

export async function POST() {
  try {
    const plan = await prisma.plan.findFirst();

    if (!plan) {
      return new Response("Plano não encontrado", { status: 404 });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 30,
      },
      success_url: `https://zuro.vercel.app/cadastro?plan=${plan.id}`,
      cancel_url: `https://zuroagenda.com/`,
    });

    console.log({ value: session });

    return Response.json({ url: session.url! });
  } catch (error) {
    console.log(`[ERROR_CREATE_CHECKOUT_SESSION]: ${error}`);

    return new Response(`Register error: ${error}`, { status: 400 });
  }
}
