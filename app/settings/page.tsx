import { redirect } from 'next/navigation';
import { getDataForUser, getUser } from '@/lib/db/queries';
import { Settings } from '@/dashboard/settings/settings';

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const userData = await getDataForUser(user.id);

  if (!userData) {
    throw new Error('User data not found');
  }

  return <Settings />;
}