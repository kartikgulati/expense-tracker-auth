'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useExpenses } from '../context/ExpenseContext';
import { CATEGORIES } from '../types';

type FormData = {
  title: string;
  amount: number;
  category: string;
  date: string;
};

export default function ExpenseForm() {
  const { addExpense, editExpense, selectedExpense, setSelectedExpense } = useExpenses();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (selectedExpense) {
      setFormData({
        title: selectedExpense.title,
        amount: selectedExpense.amount.toString(),
        category: selectedExpense.category,
        date: new Date(selectedExpense.date).toISOString().split('T')[0],
      });
    }
  }, [selectedExpense]);

  const onSubmit = (data: FormData) => {
    const expenseData = {
      id: selectedExpense?.id || crypto.randomUUID(),
      title: data.title,
      amount: Number(data.amount),
      category: data.category,
      date: new Date(data.date).toISOString(),
    };

    if (selectedExpense) {
      editExpense(selectedExpense.id, expenseData);
    } else {
      addExpense(expenseData);
    }

    reset();
    setSelectedExpense(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            {...register('title', { required: 'Title is required' })}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' },
            })}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            {...register('category', { required: 'Category is required' })}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            id="date"
            type="date"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            {...register('date', { required: 'Date is required' })}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {selectedExpense ? 'Update Expense' : 'Add Expense'}
        </button>
        {selectedExpense && (
          <button
            type="button"
            onClick={() => setSelectedExpense(null)}
            className="w-full mt-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  );
}