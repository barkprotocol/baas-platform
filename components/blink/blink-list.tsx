import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Calendar, Link as LinkIcon } from 'lucide-react'

type BaseBlink = {
  id: string;
  name: string;
  type: string;
  description: string;
  expirationDate: string;
  url: string;
};

type AmountBlink = BaseBlink & {
  amount: number;
};

type NonAmountBlink = BaseBlink & {
  amount?: never;
};

type Blink = AmountBlink | NonAmountBlink;

interface BlinkListProps {
  blinks: Blink[];
}

export function BlinkList({ blinks }: BlinkListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const isAmountBlink = (blink: Blink): blink is AmountBlink => {
    return 'amount' in blink;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {blinks.map((blink) => (
        <Card key={blink.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl font-bold">{blink.name}</CardTitle>
              <Badge variant="secondary">{blink.type}</Badge>
            </div>
            <CardDescription>{blink.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4" style={{color: '#D0BFB4'}} />
              <span>
                {isAmountBlink(blink) 
                  ? `${blink.amount} ${blink.type}`
                  : 'No amount specified'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
              <Calendar className="h-4 w-4" style={{color: '#D0BFB4'}} />
              <span>Expires: {formatDate(blink.expirationDate)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <LinkIcon className="mr-2 h-4 w-4" style={{color: '#D0BFB4'}} />
              Open Blink
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}