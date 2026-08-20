import Stripe from "stripe";
import { env } from "../../config/env";
import { createStripePaymentGateway } from "./stripe-payment-gateway";

const stripeClient = new Stripe(env.STRIPE_SECRET_KEY);

export const paymentGateway = createStripePaymentGateway(stripeClient);

export type {
  PaymentGateway,
  CheckoutSession,
  RefundOutput,
} from "./payment-gateway";
