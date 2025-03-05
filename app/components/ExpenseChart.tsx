'use client';

import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function ExpenseChart() {
  const { expenses } = useExpenses();

  const categoryData = useMemo(() => {
    const categoryTotals = CATEGORIES.reduce((acc, category) => {
      acc[category] = 0;
      return acc;
    }, {} as Record<string, number>);

    expenses.forEach((expense) => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    return {
      labels: Object.keys(categoryTotals).filter(category => categoryTotals[category] > 0),
      datasets: [
        {
          label: 'Expenses by Category',
          data: Object.values(categoryTotals).filter(amount => amount > 0),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
            'rgba(83, 102, 255, 0.6)',
            'rgba(78, 252, 3, 0.6)',
            'rgba(252, 3, 198, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(199, 199, 199, 1)',
            'rgba(83, 102, 255, 1)',
            'rgba(78, 252, 3, 1)',
            'rgba(252, 3, 198, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [expenses]);

  // Group expenses by month for the bar chart
  const monthlyData = useMemo(() => {
    const monthlyTotals: Record<string, number> = {};
    
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthlyTotals[monthYear] = (monthlyTotals[monthYear] || 0) + expense.amount;
    });
    
    // Sort by date
    const sortedMonths = Object.keys(monthlyTotals).sort();
    
    // Format month labels
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedLabels = sortedMonths.map(monthYear => {
      const [year, month] = monthYear.split('-');
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    });
    
    return {
      labels: formattedLabels,
      datasets: [
        {
          label: 'Monthly Expenses',
          data: sortedMonths.map(month => monthlyTotals[month]),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [expenses]);

  if (expenses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Expense Analytics</h2>
        <p className="text-gray-500">Add expenses to see analytics.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Expense Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Expenses by Category</h3>
          <div className="h-64">
            <Pie data={categoryData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Monthly Expenses</h3>
          <div className="h-64">
            <Bar 
              data={monthlyData} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Amount ($)'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}