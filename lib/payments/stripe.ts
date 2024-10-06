import Stripe from 'stripe';
import { Team } from '@/types/team';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function createCheckoutSession({ team, priceId }: { team: Team; priceId: string }) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: team.ownerEmail,
    client_reference_id: team.id,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: {
      teamId: team.id,
    },
  });

  return session;
}

export async function createCustomerPortalSession(team: Team) {
  let customer: string;

  const existingCustomers = await stripe.customers.list({
    email: team.ownerEmail,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    customer = existingCustomers.data[0].id;
  } else {
    const newCustomer = await stripe.customers.create({
      email: team.ownerEmail,
      metadata: {
        teamId: team.id,
      },
    });
    customer = newCustomer.id;
  }

  const session = await stripe.billingPortal.sessions.create({
    customer,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });

  return session;
}

export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

export async function cancelSubscription(subscriptionId: string) {
  const canceledSubscription = await stripe.subscriptions.del(subscriptionId);
  return canceledSubscription;
}

export async function updateSubscription(subscriptionId: string, newPriceId: string) {
  const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: (await stripe.subscriptions.retrieve(subscriptionId)).items.data[0].id,
        price: newPriceId,
      },
    ],
  });
  return updatedSubscription;
}

export async function createWebhook(rawBody: string, sig: string) {
  const event = stripe.webhooks.constructEvent(
    rawBody,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
  return event;
}