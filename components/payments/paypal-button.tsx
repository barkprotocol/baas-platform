import { useEffect } from 'react'
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import Image from 'next/image'

interface PayPalButtonProps {
  amount: number
}

export function PayPalButton({ amount }: PayPalButtonProps) {
  const [{ options, isResolved }, dispatch] = usePayPalScriptReducer()

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: "USD",
      },
    })
  }, [dispatch, options])

  return (
    <div className="flex flex-col items-center">
      <Image src="/icons/paypal.svg" alt="PayPal" width={100} height={30} className="mb-4" />
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount.toString(),
                },
              },
            ],
          })
        }}
        onApprove={(data, actions) => {
          return actions.order!.capture().then((details) => {
            const name = details.payer.name!.given_name
            console.log('Payment successful:', name)
          })
        }}
      />
    </div>
  )
}