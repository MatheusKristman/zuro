import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

// TODO: ajustar urls para a url de produção

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
      allow_promotion_codes: true,
      success_url: `${
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://zuro.vercel.app"
      }/dashboard/conta/plano?checkout={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://zuroagenda.com/`,
    });

    return Response.json({ url: session.url! });
  } catch (error) {
    console.log(`[ERROR_CREATE_CHECKOUT_SESSION]: ${error}`);

    return new Response(`Register error: ${error}`, { status: 400 });
  }
}
