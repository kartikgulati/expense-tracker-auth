'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function UserProfile() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="animate-pulse h-8 w-48 bg-gray-200 rounded"></div>;
  }

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.firstName || 'Saver'}!</h1>
        <p className="text-gray-600">Manage your expenses</p>
      </div>
      
      <div className="flex items-center gap-4">
        <Link 
          href="/"
          className="text-blue-600 hover:text-blue-800 transition-colors font-bold text-xl"
        >
         Home
        </Link>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}