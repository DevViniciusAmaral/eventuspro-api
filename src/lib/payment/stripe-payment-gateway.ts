import Stripe from "stripe";
import {
  PaymentGateway,
  CreateProductInput,
  CreatePriceInput,
  CreateCheckoutSessionInput,
  CheckoutSession,
  RefundOutput,
} from "./payment-gateway";

export const createStripePaymentGateway = (client: Stripe): PaymentGateway => ({
  createProduct: async (input) => {
    const product = await client.products.create({
      name: input.name,
      description: input.description,
    });
    return { id: product.id };
  },

  createPrice: async (input) => {
    const price = await client.prices.create({
      product: input.productId,
      currency: input.currency,
      unit_amount: input.unitAmount,
    });
    return { id: price.id };
  },

  createCheckoutSession: async (input) => {
    const session = await client.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: input.priceId, quantity: input.quantity }],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      customer_email: input.customerEmail,
      metadata: input.metadata,
    });
    return { url: session.url };
  },

  retrieveCheckoutSession: async (sessionId) => {
    const session = await client.checkout.sessions.retrieve(sessionId);
    return {
      paymentStatus: session.payment_status,
      paymentIntentId: session.payment_intent,
      metadata: session.metadata ?? {},
    } as CheckoutSession;
  },

  createRefund: async (payment_intent) => {
    const refund = await client.refunds.create({ payment_intent });
    return { status: refund.status as RefundOutput["status"] };
  },
});
