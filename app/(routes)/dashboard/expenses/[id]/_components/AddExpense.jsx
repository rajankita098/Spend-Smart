import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db } from '@/utils/dbConfig';
import { Budgets, Expense } from '@/utils/schema';
import { toast } from 'sonner';
import Budget from '../../../budgets/page';
import moment from 'moment/moment';

function AddExpense({ budgetId, user,refreshData }) {
  const [name, setName] = useState();
  const [amount, setAmount] = useState();

  const addNewExpense = async () => {
    try {
      const result = await db.insert(Expense).values({
        name: name,
        amount: amount, // Convert amount to a number
        budgetId: budgetId,
        createdAt: moment().format('DD/MM/YYYY') // Ensure this is the correct field
      }).returning({ insertedId: Budgets.id });

      setAmount('');
      setName('');

      if (result) {
        toast('New Expense Added!');
      }
    } catch (error) {
      refreshData();
      console.error("Error adding expense:", error);
    }
  };

  return (
    <div className='border p-5 rounded-lg'>
      <h2 className='font-bold text-lg'>Add Expense</h2>
      <div>
        <h2 className='text-black font-medium my-1'>Expense Name</h2>
        <Input
          placeholder="e.g. Home"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <h2 className='text-black font-medium my-1'>Expense Amount</h2>
        <Input
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount)}
        onClick={addNewExpense}
        className="mt-3 w-full"
      >
        Add New Expense
      </Button>
    </div>
  );
}

export default AddExpense;
