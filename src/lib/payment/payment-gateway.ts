export interface CreateProductInput {
  name: string;
  description: string;
}

export interface CreateProductOutput {
  id: string;
}

export interface CreatePriceInput {
  productId: string;
  currency: string;
  unitAmount: number;
}

export interface CreatePriceOutput {
  id: string;
}

export interface CreateCheckoutSessionInput {
  priceId: string;
  quantity: number;
  successUrl: string;
  cancelUrl: string;
  customerEmail: string;
  metadata: Record<string, string>;
}

export interface CreateCheckoutSessionOutput {
  url: string | null;
}

export type PaymentStatus = "paid" | "unpaid" | "no_payment_required";

export interface CheckoutSession {
  paymentStatus: PaymentStatus;
  paymentIntentId: string;
  metadata: Record<string, string>;
}

export type RefundStatus = "succeeded" | "pending" | "failed" | "canceled";

export interface RefundOutput {
  status: RefundStatus;
}

export interface PaymentGateway {
  createProduct: (input: CreateProductInput) => Promise<CreateProductOutput>;
  createPrice: (input: CreatePriceInput) => Promise<CreatePriceOutput>;
  createCheckoutSession: (
    input: CreateCheckoutSessionInput,
  ) => Promise<CreateCheckoutSessionOutput>;
  retrieveCheckoutSession: (sessionId: string) => Promise<CheckoutSession>;
  createRefund: (paymentIntentId: string) => Promise<RefundOutput>;
}
