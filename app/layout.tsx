import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ExpenseProvider } from './context/ExpenseContext';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track your expenses with real-time graphs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ExpenseProvider>
            {children}
          </ExpenseProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}