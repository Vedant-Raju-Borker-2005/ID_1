import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../src/lib/stripe";
import { prisma } from "../../../src/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event;

  try {
    event = await stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock'
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Invalid signature: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as any;
    
    // Link payout to Vendor from metadata
    if (paymentIntent.metadata && paymentIntent.metadata.vendorId) {
      await prisma.vendorPayout.create({
        data: {
          vendorId: paymentIntent.metadata.vendorId,
          amount: paymentIntent.amount / 100,
          projectId: paymentIntent.metadata.projectId || 'demo-project-id',
          status: 'PAID',
          payoutDate: new Date(),
        }
      });
      
      console.log(`[Stripe Webhook] Logged payout of $${paymentIntent.amount / 100} for vendor ${paymentIntent.metadata.vendorId}`);
    }
  }

  return NextResponse.json({ received: true });
}
