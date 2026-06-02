import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-04-10' as any,
  appInfo: {
    name: 'Interior Design Platform',
    version: '0.1.0',
  },
});

export const stripeBillingService = {
  async createCheckoutSession(workspaceId: string, priceId: string, successUrl: string, cancelUrl: string) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { workspaceId },
    });
    return session;
  },

  async handleWebhook(signature: string, payload: Buffer, endpointSecret: string) {
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
      return event;
    } catch (err: any) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }
  }
};
