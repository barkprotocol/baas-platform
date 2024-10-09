import Stripe from 'stripe';
import { Team } from '@/types/team';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Create a new checkout session for a subscription
export async function createCheckoutSession({ team, priceId }: { team: Team; priceId: string }) {
  try {
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
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Unable to create checkout session');
  }
}

// Create a customer portal session
export async function createCustomerPortalSession(team: Team) {
  try {
    let customerId: string;

    // Check for existing customers
    const existingCustomers = await stripe.customers.list({
      email: team.ownerEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: team.ownerEmail,
        metadata: {
          teamId: team.id,
        },
      });
      customerId = newCustomer.id;
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    return session;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw new Error('Unable to create customer portal session');
  }
}

// Retrieve a subscription by ID
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw new Error('Unable to retrieve subscription');
  }
}

// Cancel a subscription by ID
export async function cancelSubscription(subscriptionId: string) {
  try {
    const canceledSubscription = await stripe.subscriptions.del(subscriptionId);
    return canceledSubscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Unable to cancel subscription');
  }
}

// Update a subscription with a new price ID
export async function updateSubscription(subscriptionId: string, newPriceId: string) {
  try {
    const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: currentSubscription.items.data[0].id, // Use the existing item ID
          price: newPriceId,
        },
      ],
    });
    return updatedSubscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw new Error('Unable to update subscription');
  }
}

// Create a webhook event
export async function createWebhook(rawBody: string, sig: string) {
  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    return event;
  } catch (error) {
    console.error('Error constructing webhook event:', error);
    throw new Error('Invalid webhook signature');
  }
}
