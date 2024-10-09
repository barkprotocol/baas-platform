import { useState, useMemo } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';
import { Action, Currency } from '@/types/actionboard';
import CurrencySelector from './currency-selector';

interface FormData {
  amount?: string;
  recipient?: string;
  tokenName?: string;
  tokenSymbol?: string;
  tokenSupply?: string;
  proposalType?: string;
  proposal?: string;
  memo?: string;
  data?: string;
  fee?: string;
}

interface ActionFormProps {
  selectedAction: Action;
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  currencies: Currency[];
  isSimulation: boolean;
  setIsSimulation: (isSimulation: boolean) => void;
  memo: string;
  setMemo: (memo: string) => void;
  barkBalance: number;
  governanceProposals: any[];
  claimableRewards: number;
  onSubmit: (formData: FormData) => void;
  isDarkMode: boolean;
}

export default function ActionForm({
  selectedAction,
  selectedCurrency,
  setSelectedCurrency,
  currencies,
  isSimulation,
  setIsSimulation,
  memo,
  setMemo,
  barkBalance,
  governanceProposals,
  claimableRewards,
  onSubmit,
  isDarkMode
}: ActionFormProps) {
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prevData) => ({ ...prevData, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.amount && selectedAction.name === 'Transfer SPL Tokens') {
      alert("Amount is required.");
      return;
    }
    
    setLoading(true);
    onSubmit(formData);
    setLoading(false);
  };

  const renderActionInputs = useMemo(() => {
    switch (selectedAction.name) {
      case 'Transfer SPL Tokens':
        return (
          <>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input 
                id="amount" 
                type="number" 
                step="0.000001"
                min="0"
                placeholder={`Enter amount in ${selectedCurrency.symbol}`} 
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input 
                id="recipient" 
                placeholder={`Enter recipient's ${selectedCurrency.name} address`} 
                onChange={handleInputChange}
              />
            </div>
          </>
        );
      case 'Create SPL Token':
        return (
          <>
            <div>
              <Label htmlFor="tokenName">Token Name</Label>
              <Input 
                id="tokenName" 
                placeholder="Enter token name" 
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="tokenSymbol">Token Symbol</Label>
              <Input 
                id="tokenSymbol" 
                placeholder="Enter token symbol" 
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="tokenSupply">Initial Supply</Label>
              <Input 
                id="tokenSupply" 
                type="number"
                min="0"
                placeholder="Enter initial token supply" 
                onChange={handleInputChange}
              />
            </div>
          </>
        );
      case 'Governance':
        return (
          <>
            <div>
              <Label htmlFor="proposalType">Proposal Type</Label>
              <Select onValueChange={(value) => handleInputChange({ target: { id: 'proposalType', value } } as any)}>
                <SelectTrigger id="proposalType">
                  <SelectValue placeholder="Select proposal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Proposal</SelectItem>
                  <SelectItem value="program">Program Upgrade</SelectItem>
                  <SelectItem value="mint">Mint Tokens</SelectItem>
                  <SelectItem value="transfer">Transfer Tokens</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="proposal">Proposal</Label>
              <Textarea 
                id="proposal" 
                placeholder="Enter your governance proposal" 
                rows={4}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Your BARK Balance</Label>
              <p>{barkBalance.toLocaleString()} BARK</p>
            </div>
          </>
        );
      default:
        return null;
    }
  }, [selectedAction.name, selectedCurrency.symbol, barkBalance]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {selectedAction.name !== 'Governance' && selectedAction.name !== 'Claim Rewards' && selectedAction.name !== 'View Analytics' && (
          <CurrencySelector
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
            currencies={currencies}
            isDarkMode={isDarkMode}
          />
        )}
        {renderActionInputs}
      </div>
      <Tabs defaultValue="basic" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="basic">
          <div className="space-y-4">
            <div>
              <Label htmlFor="memo">Memo</Label>
              <Input 
                id="memo" 
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Enter a memo for this transaction" 
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="advanced">
          <div className="space-y-4">
            <div>
              <Label htmlFor="data">Additional Data (Optional)</Label>
              <Input 
                id="data" 
                placeholder="Enter any additional data" 
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="fee">Custom Fee (Optional)</Label>
              <Input 
                id="fee" 
                type="number"
                step="0.000001"
                min="0"
                placeholder="Enter custom fee" 
                onChange={handleInputChange}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex items-center space-x-2 mt-4">
        <Switch
          id="simulation-mode"
          checked={isSimulation}
          onCheckedChange={setIsSimulation}
        />
        <Label htmlFor="simulation-mode">Simulation Mode</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Simulation mode allows you to test actions without executing them on the Solana blockchain.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading ? 'Processing...' : `${isSimulation ? 'Simulate' : 'Execute'} ${selectedAction.name}`}
      </Button>
    </form>
  );
}
