'use client';

import React, { useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';

export default function ExpenseSummary() {
  const { expenses, totalExpenses } = useExpenses();

  const summary = useMemo(() => {
    if (expenses.length === 0) return null;

    // Find highest expense
    const highestExpense = expenses.reduce((max, expense) => 
      expense.amount > max.amount ? expense : max, expenses[0]);

    // Find most frequent category
    const categoryCounts: Record<string, number> = {};
    expenses.forEach(expense => {
      categoryCounts[expense.category] = (categoryCounts[expense.category] || 0) + 1;
    });
    
    let mostFrequentCategory = '';
    let maxCount = 0;
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      if (count > maxCount) {
        mostFrequentCategory = category;
        maxCount = count;
      }
    });

    // Calculate average expense
    const averageExpense = totalExpenses / expenses.length;

    return {
      totalExpenses,
      expenseCount: expenses.length,
      averageExpense,
      highestExpense,
      mostFrequentCategory
    };
  }, [expenses, totalExpenses]);

  const handlePrint = () => {
    const printContent = document.createElement('div');
    printContent.style.padding = '20px';
    printContent.style.fontFamily = 'Arial, sans-serif';
    
    // Create title
    const title = document.createElement('h1');
    title.textContent = 'Expense Summary Report';
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    printContent.appendChild(title);
    
    if (summary) {
      // Add summary section
      const summarySection = document.createElement('div');
      summarySection.style.marginBottom = '30px';
      
      const summaryTitle = document.createElement('h2');
      summaryTitle.textContent = 'Summary Overview';
      summaryTitle.style.borderBottom = '1px solid #ccc';
      summaryTitle.style.paddingBottom = '10px';
      summarySection.appendChild(summaryTitle);
      
      const summaryItems = [
        { label: 'Total Expenses', value: `$${summary.totalExpenses.toFixed(2)}` },
        { label: 'Number of Expenses', value: summary.expenseCount.toString() },
        { label: 'Average Expense', value: `$${summary.averageExpense.toFixed(2)}` },
        { label: 'Most Frequent Category', value: summary.mostFrequentCategory },
        { label: 'Highest Expense', value: `${summary.highestExpense.title} - $${summary.highestExpense.amount.toFixed(2)} (${summary.highestExpense.category})` }
      ];
      
      summaryItems.forEach(item => {
        const p = document.createElement('p');
        p.style.margin = '10px 0';
        p.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
        summarySection.appendChild(p);
      });
      
      printContent.appendChild(summarySection);
      
      // Add expense list
      const listSection = document.createElement('div');
      
      const listTitle = document.createElement('h2');
      listTitle.textContent = 'Expense Details';
      listTitle.style.borderBottom = '1px solid #ccc';
      listTitle.style.paddingBottom = '10px';
      listSection.appendChild(listTitle);
      
      // Create table
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.marginTop = '15px';
      
      // Add table header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      ['Title', 'Amount', 'Category', 'Date'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.textAlign = 'left';
        th.style.backgroundColor = '#f2f2f2';
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);
      
      // Add table body
      const tbody = document.createElement('tbody');
      expenses.forEach(expense => {
        const row = document.createElement('tr');
        
        const titleCell = document.createElement('td');
        titleCell.textContent = expense.title;
        titleCell.style.border = '1px solid #ddd';
        titleCell.style.padding = '8px';
        row.appendChild(titleCell);
        
        const amountCell = document.createElement('td');
        amountCell.textContent = `$${expense.amount.toFixed(2)}`;
        amountCell.style.border = '1px solid #ddd';
        amountCell.style.padding = '8px';
        row.appendChild(amountCell);
        
        const categoryCell = document.createElement('td');
        categoryCell.textContent = expense.category;
        categoryCell.style.border = '1px solid #ddd';
        categoryCell.style.padding = '8px';
        row.appendChild(categoryCell);
        
        const dateCell = document.createElement('td');
        dateCell.textContent = new Date(expense.date).toLocaleDateString();
        dateCell.style.border = '1px solid #ddd';
        dateCell.style.padding = '8px';
        row.appendChild(dateCell);
        
        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      listSection.appendChild(table);
      
      printContent.appendChild(listSection);
      
      // Add footer with date
      const footer = document.createElement('div');
      footer.style.marginTop = '30px';
      footer.style.textAlign = 'center';
      footer.style.fontSize = '12px';
      footer.style.color = '#666';
      footer.textContent = `Report generated on ${new Date().toLocaleString()}`;
      printContent.appendChild(footer);
    } else {
      const noData = document.createElement('p');
      noData.textContent = 'No expense data available.';
      noData.style.textAlign = 'center';
      noData.style.marginTop = '30px';
      printContent.appendChild(noData);
    }
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Expense Summary</title></head><body>');
      printWindow.document.write(printContent.outerHTML);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      
      // Add a small delay to ensure content is loaded before printing
      setTimeout(() => {
        printWindow.print();
        // Close the window after print dialog is closed (or canceled)
        printWindow.onafterprint = function() {
          printWindow.close();
        };
      }, 500);
    }
  };

  if (!summary) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Expense Summary</h2>
        <p className="text-gray-500">Add expenses to see summary.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Expense Summary</h2>
        <button 
          onClick={handlePrint}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Summary
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-600 font-medium">Total Expenses</p>
          <p className="text-2xl font-bold">${summary.totalExpenses.toFixed(2)}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-600 font-medium">Number of Expenses</p>
          <p className="text-2xl font-bold">{summary.expenseCount}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-600 font-medium">Average Expense</p>
          <p className="text-2xl font-bold">${summary.averageExpense.toFixed(2)}</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-600 font-medium">Most Frequent Category</p>
          <p className="text-2xl font-bold">{summary.mostFrequentCategory}</p>
        </div>
      </div>
      
      <div className="mt-4 bg-red-50 p-4 rounded-lg">
        <p className="text-sm text-red-600 font-medium">Highest Expense</p>
        <p className="text-xl font-bold">{summary.highestExpense.title}</p>
        <div className="flex justify-between mt-1">
          <p className="text-gray-600">{summary.highestExpense.category}</p>
          <p className="font-semibold">${summary.highestExpense.amount.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}