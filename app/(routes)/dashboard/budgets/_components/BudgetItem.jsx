import Link from 'next/link';
import React from 'react';
import BudgetList from './BudgetList';

function BudgetItem({ budget }) {
    // Check if budget is not undefined and has the necessary properties
    if (!budget) {
        return null; // Render nothing if budget is undefined
    }

    const { id, icon, name, totalItem, amount, totalSpend } = budget;

    const calculateProgressPerc = () => {
        const perc = (budget.totalSpend / budget.amount) * 100;
        return perc.toFixed(2);
    }

    return (
        <Link href={`/dashboard/expenses/${id}`} >
            <div className='p-5 border rounded-lg hover:shadow-md cursor-pointer h-[170px]'>
                <div className='flex gap-2 items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <h2 className='text-2xl p-3 px-4 bg-slate-100 rounded-full'>{icon}</h2>
                        <h2 className='font-bold'>{name}</h2>
                        <h2 className='text-sm text-gray-500'>{totalItem} Item{totalItem !== 1 ? 's' : ''}</h2>
                    </div>
                    <h2 className='font-bold text-primary'>${amount}</h2>
                </div>
                <div className='mt-5'>
                    <div className='flex items-center justify-between mb-3'>
                        <h2 className='text-xs text-slate-400'>
                            ${totalSpend ? totalSpend : 0} spent
                        </h2>
                        <h2 className='text-xs text-slate-400'>
                            ${amount - (totalSpend ? totalSpend : 0)} remaining
                        </h2>
                    </div>
                    <div className='w-full bg-slate-300 h-2 rounded-full'>
                        <div className=' bg-primary h-2 rounded-full'
                            style={{
                                width: `${calculateProgressPerc()}%`
                            }}
                        ></div>
                    </div>
                </div>
            </div>

        </Link>
    );
}

export default BudgetItem;
