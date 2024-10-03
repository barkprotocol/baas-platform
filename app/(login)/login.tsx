'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useActionState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { signIn, signUp, signInWithSolana } from './actions';
import { ActionState } from '@/lib/auth/middleware';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { toast } from '@/components/ui/use-toast';

const logoUrl = "https://ucarecdn.com/f242e5dc-8813-47b4-af80-6e6dd43945a9/barkicon.png";
const solanaIconUrl = "https://cryptologos.cc/logos/solana-sol-logo.svg?v=024";

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const router = useRouter();
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
    <div className="min-h-[100dvh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image src={logoUrl} alt="BARK Logo" width={80} height={80} className="rounded-full shadow-md" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'signin' ? 'Welcome back' : 'Join BARK'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w">
          {mode === 'signin'
            ? "Access your BARK account and start building on Solana"
            : "Create your account and unleash the power of Solana blockchain"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" action={formAction}>
            <input type="hidden" name="redirect" value={redirect || ''} />
            <input type="hidden" name="priceId" value={priceId || ''} />
            <input type="hidden" name="inviteId" value={inviteId || ''} />
            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={50}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#D0BFB4] focus:border-[#D0BFB4] sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={
                    mode === 'signin' ? 'current-password' : 'new-password'
                  }
                  required
                  minLength={8}
                  maxLength={100}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#D0BFB4] focus:border-[#D0BFB4] sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {state?.error && (
              <div className="text-red-500 text-sm">{state.error}</div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D0BFB4] hover:bg-[#C0AFA4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D0BFB4] transition duration-150 ease-in-out"
                disabled={pending}
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
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
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <WalletMultiButton 
                className="w-full !bg-gray-900 hover:!bg-gray-800 text-white rounded-md py-2 px-4 shadow-sm transition duration-150 ease-in-out"
              />
            </div>

            {publicKey && (
              <div className="mt-4">
                <Button
                  onClick={handleSolanaSignIn}
                  disabled={solanaSignInPending}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 transition duration-150 ease-in-out"
                >
                  {solanaSignInPending ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Image src={solanaIconUrl} alt="Solana" width={16} height={16} className="mr-2" />
                      Sign in with Solana
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                {mode === 'signin'
                  ? 'New to BARK?'
                  : 'Already have an account?'}
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${
                redirect ? `?redirect=${redirect}` : ''
              }${priceId ? `&priceId=${priceId}` : ''}`}
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D0BFB4] transition duration-150 ease-in-out"
            >
              {mode === 'signin' ? (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create an account
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in to existing account
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}