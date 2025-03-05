'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, ExpenseContextType } from '../types';
import { useUser } from '@clerk/nextjs';

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: React.ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const { user, isLoaded } = useUser();

  // Load expenses from localStorage on initial render
  useEffect(() => {
    if (!isLoaded) return;

    const storageKey = user?.id ? `expenses-${user.id}` : 'expenses';
    const savedExpenses = localStorage.getItem(storageKey);
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    } else {
      setExpenses([]);
    }
  }, [user, isLoaded]);

  // Update localStorage and total whenever expenses change
  useEffect(() => {
    if (!isLoaded) return;
    
    const storageKey = user?.id ? `expenses-${user.id}` : 'expenses';
    localStorage.setItem(storageKey, JSON.stringify(expenses));
    
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalExpenses(total);
  }, [expenses, user, isLoaded]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: uuidv4(),
      userId: user?.id,
    };
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, totalExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};