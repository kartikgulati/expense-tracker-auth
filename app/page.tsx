import Link from 'next/link';
import { currentUser } from '@clerk/nextjs';

export default async function Home() {
  const user = await currentUser();
  
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-16 px-4">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Expense Tracker</h1>
          <p className="text-xl text-gray-600 mb-8">Track your expenses with real-time graphs</p>
          
          {user ? (
            <Link 
              href="/dashboard" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Expense Tracker
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/sign-in" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up" 
                className="inline-block bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </header>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Why Use Our Expense Tracker?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-blue-500 text-3xl mb-2">📊</div>
                <h3 className="text-lg font-medium mb-2">Visual Analytics</h3>
                <p className="text-gray-600">Track your spending with beautiful charts and graphs</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-green-500 text-3xl mb-2">🔒</div>
                <h3 className="text-lg font-medium mb-2">Secure & Private</h3>
                <p className="text-gray-600">Your financial data stays private with secure authentication</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="text-purple-500 text-3xl mb-2">📱</div>
                <h3 className="text-lg font-medium mb-2">Access Anywhere</h3>
                <p className="text-gray-600">Use on any device with your secure account</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}