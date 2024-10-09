'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Gift, Clock, CheckCircle, Upload } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import Papa from 'papaparse';
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';

type Airdrop = {
  id: string;
  name: string;
  status: 'ongoing' | 'completed' | 'upcoming';
  totalAmount: number;
  claimedAmount: number;
  startDate: string;
  endDate: string;
  description: string;
  eligibilityCriteria: string;
};

type AirdropsData = {
  ongoingAirdrops: Airdrop[];
  pastAirdrops: Airdrop[];
  upcomingAirdrops: Airdrop[];
  userEligibleAirdrops: string[];
};

const PROGRAM_ID = new PublicKey('Your_Anchor_Program_ID_Here');

export default function AirdropsPage() {
  const [airdropsData, setAirdropsData] = useState<AirdropsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [claimAmount, setClaimAmount] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const { toast } = useToast();
  const wallet = useAnchorWallet();

  const fetchAirdropsData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/airdrops');
      if (!response.ok) {
        throw new Error('Failed to fetch airdrops data');
      }
      const data = await response.json();
      setAirdropsData(data);
    } catch (error) {
      console.error('Error fetching airdrops data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch airdrops data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAirdropsData();
  }, [fetchAirdropsData]);

  const handleClaimAirdrop = async (airdropId: string) => {
    if (!wallet) {
      toast({
        title: "Error",
        description: "Please connect your wallet to claim the airdrop.",
        variant: "destructive",
      });
      return;
    }

    try {
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });
      const program = new Program(IDL, PROGRAM_ID, provider);

      const tx = await program.methods
        .claimAirdrop(new PublicKey(airdropId), new BN(parseFloat(claimAmount) * 1e9))
        .accounts({
          user: wallet.publicKey,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .rpc();

      toast({
        title: "Success",
        description: `Claimed ${claimAmount} BARK from airdrop ${airdropId}. Transaction: ${tx}`,
      });
      setClaimAmount('');
      fetchAirdropsData();
    } catch (error) {
      console.error('Error claiming airdrop:', error);
      toast({
        title: "Error",
        description: `Failed to claim airdrop: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const handleCsvSubmit = async () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please upload a CSV file first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await new Promise<Papa.ParseResult<{ wallet: string; amount: string }>>((resolve, reject) => {
        Papa.parse(csvFile, {
          complete: resolve,
          error: reject,
          header: true,
        });
      });

      const walletData = result.data;

      toast({
        title: "Success",
        description: `Processed ${walletData.length} wallet addresses for airdrop.`,
      });
    } catch (error) {
      console.error('Error processing CSV file:', error);
      toast({
        title: "Error",
        description: `Failed to process CSV file: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const renderAirdropCard = (airdrop: Airdrop) => (
    <Card key={airdrop.id} className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{airdrop.name}</span>
          {airdrop.status === 'ongoing' && <Gift className="h-5 w-5 text-green-500" aria-label="Ongoing airdrop" />}
          {airdrop.status === 'completed' && <CheckCircle className="h-5 w-5 text-blue-500" aria-label="Completed airdrop" />}
          {airdrop.status === 'upcoming' && <Clock className="h-5 w-5 text-yellow-500" aria-label="Upcoming airdrop" />}
        </CardTitle>
        <CardDescription>{airdrop.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Amount:</span>
            <span className="font-bold">{airdrop.totalAmount.toLocaleString()} BARK</span>
          </div>
          <div className="flex justify-between">
            <span>Claimed Amount:</span>
            <span className="font-bold">{airdrop.claimedAmount.toLocaleString()} BARK</span>
          </div>
          <div className="flex justify-between">
            <span>Start Date:</span>
            <span>{new Date(airdrop.startDate).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>End Date:</span>
            <span>{new Date(airdrop.endDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="font-semibold">Eligibility Criteria:</span>
            <p className="text-sm mt-1">{airdrop.eligibilityCriteria}</p>
          </div>
          <Progress value={(airdrop.claimedAmount / airdrop.totalAmount) * 100} className="mt-2" />
          {airdrop.status === 'ongoing' && airdropsData?.userEligibleAirdrops.includes(airdrop.id) && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full mt-2">Claim Airdrop</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Claim Airdrop</DialogTitle>
                  <DialogDescription>
                    Enter the amount of BARK you want to claim from this airdrop.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="claim-amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="claim-amount"
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      className="col-span-3"
                      type="number"
                      min="0"
                      step="0.0000001"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => handleClaimAirdrop(airdrop.id)}>Claim BARK</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!airdropsData) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load airdrops data. Please try again later.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Airdrops</h1>
      <Tabs defaultValue="ongoing">
        <TabsList>
          <TabsTrigger value="ongoing">Ongoing Airdrops</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Airdrops</TabsTrigger>
          <TabsTrigger value="past">Past Airdrops</TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing">
          {airdropsData.ongoingAirdrops.map(renderAirdropCard)}
        </TabsContent>

        <TabsContent value="upcoming">
          {airdropsData.upcomingAirdrops.map(renderAirdropCard)}
        </TabsContent>

        <TabsContent value="past">
          {airdropsData.pastAirdrops.map(renderAirdropCard)}
        </TabsContent>
      </Tabs>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Upload Airdrop CSV</h2>
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        <Button onClick={handleCsvSubmit} className="mt-4">Upload CSV</Button>
      </div>
    </div>
  );
}
