'use client'

import { useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from '@/components/ui/button'
import { Loader2, Wallet } from 'lucide-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { cn } from '@/lib/utils'

export function WalletButton() {
  const { wallet, connect, disconnect, connecting, connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnectOrSelect = useCallback(async () => {
    if (connecting) return

    if (wallet) {
      setIsConnecting(true)
      try {
        await connect()
      } catch (error) {
        console.error('Failed to connect wallet:', error)
      } finally {
        setIsConnecting(false)
      }
    } else {
      setVisible(true)
    }
  }, [wallet, connect, connecting, setVisible])

  const handleDisconnect = useCallback(async () => {
    if (disconnect) {
      await disconnect()
    }
  }, [disconnect])

  const buttonClasses = cn(
    "bg-[#D0BFB4] text-white hover:bg-[#D0BFB4] dark:bg-[#D0BFB4] dark:text-gray-900 dark:hover:bg-[#D0BFB4]",
    "font-regular px-4 py-2 rounded-md transition-all duration-200 ease-in-out",
    "transform hover:scale-100 focus:outline-none focus:ring-1 focus:ring-[#D0BFB4] focus:ring-opacity-60"
  )

  if (connected && publicKey) {
    return (
      <Button
        variant="outline"
        className={buttonClasses}
        onClick={handleDisconnect}
      >
        <Wallet className="mr-2 h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Disconnect wallet</span>
        <span aria-hidden="true">
          {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
        </span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className={buttonClasses}
      onClick={handleConnectOrSelect}
      disabled={isConnecting || connecting}
    >
      {isConnecting || connecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>{wallet ? 'Connect' : 'Select Wallet'}</span>
        </>
      )}
    </Button>
  )
}