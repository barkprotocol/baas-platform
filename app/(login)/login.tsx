'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useActionState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, LogIn, UserPlus, Mail, Lock } from 'lucide-react';
import { signIn, signUp, signInWithSolana } from './actions';
import { ActionState } from '@/lib/auth/middleware';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const logoUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png";
const solanaIconUrl = "https://cryptologos.cc/logos/solana-sol-logo.svg?v=024";

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  const { wallet, publicKey, signMessage } = useWallet();
  const [solanaSignInPending, setSolanaSignInPending] = useState(false);

  const handleSolanaSignIn = async () => {
    if (!publicKey || !signMessage) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your Solana wallet first.",
        variant: "destructive",
      });
      return;
    }

    setSolanaSignInPending(true);
    try {
      const message = `Sign this message to authenticate with BARK BaaS Platform: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await signMessage(encodedMessage);
      
      const result = await signInWithSolana(publicKey.toString(), Buffer.from(signedMessage).toString('base64'), message);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Authentication successful",
        description: "You've been signed in with your Solana wallet.",
      });
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing message:', error);
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Failed to authenticate with Solana wallet",
        variant: "destructive",
      });
    } finally {
      setSolanaSignInPending(false);
    }
  };

  useEffect(() => {
    if (wallet && publicKey) {
      console.log('Wallet connected:', publicKey.toString());
    }
  }, [wallet, publicKey]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center">
            <Image src={logoUrl} alt="BARK Logo" width={50} height={50} className="mb-4" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {mode === 'signin' ? 'Welcome back' : 'Join BARK'}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === 'signin'
              ? "Access your BARK account and start building on Solana"
              : "Create your account and unleash the power of Solana blockchain"}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form className="space-y-4" action={formAction}>
            <input type="hidden" name="redirect" value={redirect || ''} />
            <input type="hidden" name="priceId" value={priceId || ''} />
            <input type="hidden" name="inviteId" value={inviteId || ''} />
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={50}
                  className="pl-8"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  required
                  minLength={8}
                  maxLength={100}
                  className="pl-8"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            {state?.error && (
              <div className="text-red-500 text-sm">{state.error}</div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : mode === 'signin' ? (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign up
                </>
              )}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <WalletMultiButton className="w-full !bg-secondary hover:!bg-secondary/80" />
          {publicKey && (
            <Button
              onClick={handleSolanaSignIn}
              disabled={solanaSignInPending}
              variant="outline"
              className="w-full"
            >
              {solanaSignInPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Image src={solanaIconUrl} alt="Solana" width={16} height={16} className="mr-2" />
                  Sign in with Solana
                </>
              )}
            </Button>
          )}
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm text-muted-foreground w-full">
            {mode === 'signin' ? (
              <>
                New to BARK?{" "}
                <Link href="/sign-up" className="text-primary hover:underline">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/sign-in" className="text-primary hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}