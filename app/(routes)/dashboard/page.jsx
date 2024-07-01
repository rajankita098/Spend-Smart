"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { eq, getTableColumns, sql, desc } from "drizzle-orm";
import { Budgets, Expense } from "@/utils/schema";
import { db } from "@/utils/dbConfig";
import CardsInfo from "./_components/CardsInfo";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/[id]/_components/ExpenseListTable";

export default function DashboardPage() {
  const { user } = useUser();
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList,setExpensesList] = useState([]);

  useEffect(() => {
    if (user) {
      console.log("User detected, calling getBudgetList...");
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    try {
      console.log("Fetching budget list...");
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(${Expense.amount})`.mapWith(Number),
          totalItem: sql`count(${Expense.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expense, eq(Budgets.id, Expense.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      setBudgetList(result);
      getAllExpenses();
    } catch (error) {
      console.error("Error fetching budget list:", error);
    }
  };

  const getAllExpenses = async () => {
    try {
      const result = await db
        .select({
          id: Expense.id,
          name: Expense.name,
          amount: Expense.amount,
          createdAt: Expense.createdAt,
        })
        .from(Budgets)
        .rightJoin(Expense, eq(Budgets.id, Expense.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(Expense.id));

        setExpensesList(result);

    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  return (
    <div>
      <div className="p-8">
        <h2 className="font-bold text-3lx">Hii, {user?.fullName}</h2>
        <p className="text-gray-500">
          Here's what happening with your money, let's manage it.
        </p>

        <CardsInfo budgetList={budgetList} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 mt-6">
            <BarChartDashboard budgetList={budgetList} />

            <h2 className="font-bold text-lg pt-6">Latest Budgets</h2>
            <ExpenseListTable
            expensesList={expensesList}
            
            />
          </div>

          <div className="pt-6 grid gap-5">
            <h2 className="font-bold text-lg">Latest Expenses</h2>
            {budgetList.map((budget, index) => (
              <BudgetItem budget={budget} key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
