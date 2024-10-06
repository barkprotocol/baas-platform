'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession, getSubscription, cancelSubscription, updateSubscription } from '@/lib/payments/stripe';
import { withTeam } from '@/lib/auth/middleware';
import { Team } from '@/types/team';
import { revalidatePath } from 'next/cache';

export const checkoutAction = withTeam(async (formData: FormData, team: Team) => {
  const priceId = formData.get('priceId');
  
  if (typeof priceId !== 'string' || !priceId) {
    throw new Error('Invalid or missing priceId');
  }

  try {
    const session = await createCheckoutSession({ team, priceId });
    if (session.url) {
      redirect(session.url);
    } else {
      throw new Error('Failed to create checkout session');
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to initiate checkout process');
  }
});

export const customerPortalAction = withTeam(async (_: FormData, team: Team) => {
  try {
    const portalSession = await createCustomerPortalSession(team);
    if (portalSession.url) {
      redirect(portalSession.url);
    } else {
      throw new Error('Failed to create customer portal session');
    }
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw new Error('Failed to access customer portal');
  }
});

export const getSubscriptionAction = withTeam(async (formData: FormData, team: Team) => {
  const subscriptionId = formData.get('subscriptionId');

  if (typeof subscriptionId !== 'string' || !subscriptionId) {
    throw new Error('Invalid or missing subscriptionId');
  }

  try {
    const subscription = await getSubscription(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw new Error('Failed to fetch subscription details');
  }
});

export const cancelSubscriptionAction = withTeam(async (formData: FormData, team: Team) => {
  const subscriptionId = formData.get('subscriptionId');

  if (typeof subscriptionId !== 'string' || !subscriptionId) {
    throw new Error('Invalid or missing subscriptionId');
  }

  try {
    const canceledSubscription = await cancelSubscription(subscriptionId);
    revalidatePath('/dashboard');
    return canceledSubscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
});

export const updateSubscriptionAction = withTeam(async (formData: FormData, team: Team) => {
  const subscriptionId = formData.get('subscriptionId');
  const newPriceId = formData.get('newPriceId');

  if (typeof subscriptionId !== 'string' || !subscriptionId || typeof newPriceId !== 'string' || !newPriceId) {
    throw new Error('Invalid or missing subscriptionId or newPriceId');
  }

  try {
    const updatedSubscription = await updateSubscription(subscriptionId, newPriceId);
    revalidatePath('/dashboard');
    return updatedSubscription;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw new Error('Failed to update subscription');
  }
});