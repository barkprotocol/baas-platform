'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { PublicKey } from '@solana/web3.js'
import { createQR, encodeURL, TransferRequestURLFields, ValidateTransferError } from '@solana/pay'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Share2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import QRCode from 'qrcode.react'

const BARK_MINT = 'BARKkeAwhTuFzcLHX4DjotRsmjXQ1MshGrZbn1CUQqMo'
const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

const tokenIcons = {
  USDC: 'https://ucarecdn.com/67e17a97-f3bd-46c0-8627-e13b8b939d26/usdc.png',
  SOL: 'https://ucarecdn.com/8bcc4664-01b2-4a88-85bc-9ebce234f08b/sol.png',
  BARK: 'https://ucarecdn.com/74392932-2ff5-4237-a1fa-e0fd15725ecc/bark.svg'
}

export default function CreateSolanaPayQRCode() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [reference, setReference] = useState('')
  const [label, setLabel] = useState('BARK Payment')
  const [message, setMessage] = useState('Thanks for your payment!')
  const [memo, setMemo] = useState('')
  const [token, setToken] = useState('SOL')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isBlink, setIsBlink] = useState(false)
  const qrCodeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    generateQrCode()
  }, [recipient, amount, reference, label, message, memo, token, isBlink])

  const generateQrCode = () => {
    setError(null)
    setQrCode(null)

    if (!isValidPublicKey(recipient) || !amount || !reference) {
      return
    }

    try {
      const recipientPublicKey = new PublicKey(recipient)
      let amountInSmallestUnit: bigint

      const urlParams: TransferRequestURLFields = {
        recipient: recipientPublicKey,
        reference: new PublicKey(reference),
        label,
        message,
        memo
      }

      if (token === 'SOL') {
        amountInSmallestUnit = BigInt(Math.round(parseFloat(amount) * 1e9)) // Convert SOL to lamports
        urlParams.amount = amountInSmallestUnit
      } else {
        const tokenDecimals = token === 'USDC' ? 6 : 9 // BARK uses 9 decimals
        amountInSmallestUnit = BigInt(Math.round(parseFloat(amount) * 10 ** tokenDecimals))
        urlParams.amount = amountInSmallestUnit
        urlParams.splToken = new PublicKey(token === 'USDC' ? USDC_MINT : BARK_MINT)
      }

      const url = encodeURL(urlParams)
      const qr = createQR(url, 512, 'transparent')
      setQrCode(qr.toDataURL())
    } catch (err) {
      if (err instanceof ValidateTransferError) {
        setError(`Invalid transfer params: ${err.message}`)
      } else {
        setError('An unexpected error occurred')
      }
      console.error('Error generating QR code:', err)
    }
  }

  const isValidPublicKey = (key: string) => {
    try {
      new PublicKey(key)
      return true
    } catch {
      return false
    }
  }

  const handleSendBlink = async () => {
    // Implement logic to send blink
    console.log('Sending blink...')
    // You would typically make an API call here to send the blink
  }

  const handleShareToSocial = async () => {
    if (qrCodeRef.current) {
      try {
        const canvas = qrCodeRef.current.querySelector('canvas')
        if (canvas) {
          const dataUrl = canvas.toDataURL()
          const blob = await (await fetch(dataUrl)).blob()
          const file = new File([blob], 'qr-code.png', { type: 'image/png' })

          if (navigator.share) {
            await navigator.share({
              files: [file],
              title: 'BARK Protocol Payment QR Code',
              text: 'Scan this QR code to make a payment using BARK Protocol',
            })
          } else {
            // Fallback for browsers that don't support Web Share API
            const link = document.createElement('a')
            link.href = dataUrl
            link.download = 'bark-protocol-qr-code.png'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        }
      } catch (error) {
        console.error('Error sharing QR code:', error)
        setError('Failed to share QR code')
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Solana Pay QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="qr-code" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qr-code">QR Code</TabsTrigger>
            <TabsTrigger value="blink">Blink</TabsTrigger>
          </TabsList>
          <TabsContent value="qr-code">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="Enter Solana address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.000000001"
                min="0"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="token">Token</Label>
              <Select value={token} onValueChange={setToken}>
                <SelectTrigger>
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tokenIcons).map(([tokenName, iconUrl]) => (
                    <SelectItem key={tokenName} value={tokenName}>
                      <div className="flex items-center">
                        <div className="w-6 h-6 mr-2 flex items-center justify-center">
                          <Image
                            src={iconUrl}
                            alt={`${tokenName} icon`}
                            width={24}
                            height={24}
                            className="max-w-full max-h-full"
                          />
                        </div>
                        {tokenName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference</Label>
              <Input
                id="reference"
                placeholder="Enter reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                placeholder="Enter label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Input
                id="message"
                placeholder="Enter message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="memo">Memo</Label>
              <Input
                id="memo"
                placeholder="Enter memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>
            <Button onClick={generateQrCode} className="w-full mt-4">Generate QR Code</Button>
          </TabsContent>
          <TabsContent value="blink">
            <div className="space-y-2">
              <Label htmlFor="blink-recipient">Recipient Address</Label>
              <Input
                id="blink-recipient"
                placeholder="Enter Solana address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blink-amount">Amount</Label>
              <Input
                id="blink-amount"
                type="number"
                step="0.000000001"
                min="0"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="blink-token">Token</Label>
              <Select value={token} onValueChange={setToken}>
                <SelectTrigger>
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tokenIcons).map(([tokenName, iconUrl]) => (
                    <SelectItem key={tokenName} value={tokenName}>
                      <div className="flex items-center">
                        <div className="w-6 h-6 mr-2 flex items-center justify-center">
                          <Image
                            src={iconUrl}
                            alt={`${tokenName} icon`}
                            width={24}
                            height={24}
                            className="max-w-full max-h-full"
                          />
                        </div>
                        {tokenName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSendBlink} className="w-full mt-4">Send Blink</Button>
          </TabsContent>
        </Tabs>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {qrCode && (
          <div className="flex flex-col items-center" ref={qrCodeRef}>
            <QRCode
              value={qrCode}
              size={256}
              level="H"
              imageSettings={{
                src: "https://ucarecdn.com/74392932-2ff5-4237-a1fa-e0fd15725ecc/bark.svg",
                x: null,
                y: null,
                height: 64,
                width: 64,
                excavate: true,
              }}
            />
            <Button onClick={handleShareToSocial} className="mt-4">
              <Share2 className="mr-2 h-4 w-4" />
              Share QR Code
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" style={{ color: '#BBA597' }} />
          Back to main
        </Button>
      </CardFooter>
    </Card>
  )
}