import { redirect } from 'next/navigation';
import { Settings } from './settings';
import { getDataForUser, getUser } from '@/lib/db/queries';

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const teamData = await getDataForUser(user.id);

  if (!teamData) {
    throw new Error('User not found');
  }

  return <Settings userData={userData} />;
}
