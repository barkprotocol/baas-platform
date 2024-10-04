import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Settings } from './settings';
import { getDataForUser, getUser } from '@/lib/db/queries';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';

async function SettingsContent() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  try {
    const userData = await getDataForUser(user.id);

    if (!userData) {
      throw new Error('User data not found');
    }

    return <Settings userData={userData} />;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          There was a problem loading your settings. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }>
        <SettingsContent />
      </Suspense>
    </div>
  );
}