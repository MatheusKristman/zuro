import Stripe from "stripe";

// const stripeSecretKey =
//   process.env.NODE_ENV === "development" ? process.env.STRIPE_SECRET_KEY_DEV! : process.env.STRIPE_SECRET_KEY!;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY_DEV!;

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
});
