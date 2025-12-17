import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.error('⚠️ Stripe publishable key not configured. Please set REACT_APP_STRIPE_PUBLISHABLE_KEY in your .env file.');
}

// Initialize Stripe with the publishable key
export const stripePromise = loadStripe(stripePublishableKey);
