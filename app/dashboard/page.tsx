import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart';
import ExpenseSummary from '../components/ExpenseSummary';
import UserProfile from '../components/UserProfile';

export default async function Dashboard() {
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8">
          <UserProfile />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ExpenseForm />
            <div className="mt-6">
              <ExpenseSummary />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <ExpenseChart />
            <div className="mt-6">
              <ExpenseList />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}