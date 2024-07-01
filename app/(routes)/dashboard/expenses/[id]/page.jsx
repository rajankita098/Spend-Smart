"use client"

import { db } from '@/utils/dbConfig';
import { Budgets, Expense } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { eq, getTableColumns, sql, desc } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from './_components/AddExpense';
import ExpenseListTable from './_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { PenBox, Trash } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import EditBudget from './_components/EditBudget';


function ExpencesScreen({ params }) {
    const { user } = useUser();
    const [budgetInfo, setbudgetInfo] = useState();
    const [expensesList, setExpensesList] = useState([]);
    const route=useRouter(); 
    useEffect(() => {
        console.log(params);
        user && getBudgetInfo();

    }, [user]);

    const getBudgetInfo = async () => {
        const result = await db.select({
            ...getTableColumns(Budgets),
            totalSpend: sql`sum(${Expense.amount})`.mapWith(Number),
            totalItem: sql`count(${Expense.id})`.mapWith(Number)
        }).from(Budgets)
            .leftJoin(Expense, eq(Budgets.id, Expense.budgetId))
            .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
            .where(eq(Budgets.id, params.id))
            .groupBy(Budgets.id);

        setbudgetInfo(result[0]);
        getExpensesList();
        //console.log(result[0]);

    }
    const getExpensesList = async () => {
        const result = await db.select().from(Expense)
            .where(eq(Expense.budgetId, params.id))
            .orderBy(desc(Expense.id));
        setExpensesList(result);
        console.log(result)
    }
    const deleteBudget= async()=>{
        const deleteExpanseresult=await db.delete(Expense)
        .where(eq(Expense.budgetId,params.id))
        .returning();

        if(deleteExpanseresult){
            const result = await db.delete(Budgets)
            .where(eq(Budgets.id,params.id))
            .returning();

            console.log(result);
        }
        toast('Budget Deleted successfully');
        route.replace('/dashboard/budgets');
    }

    return (
        <div className='p-10'>
            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-bold '>My Expenses</h2>

                <div className='flex gap-2 items-center'>
                    <EditBudget budgetInfo={budgetInfo}
                    refreshData={()=>getBudgetInfo()}/>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="flex items-center gap-2" variant="destructive">
                                <Trash /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your budget
                                    along with all expenses.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={()=>deleteBudget()}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
                {budgetInfo ? <BudgetItem
                    budget={budgetInfo}
                /> :
                    <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse gap-5'>

                    </div>}
                <AddExpense budgetId={params.id}
                    user={user}
                    refreshData={() => getBudgetInfo()}
                />
            </div>
            <div className='mt-4'>
                <h2 className='font-bold text-lg'>Latest Expenses</h2>
                <ExpenseListTable expensesList={expensesList}
                    refreshData={() => getBudgetInfo()} />
            </div>
        </div>
    )
}

export default ExpencesScreen;