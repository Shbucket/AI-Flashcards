import { loadStripe } from '@stripe/stripe-js'

let stripePromise
//ensures we only create one instance of Stripe, resusing it if it already exists
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  }
  return stripePromise
}

export default getStripe