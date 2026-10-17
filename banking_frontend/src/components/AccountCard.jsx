import { useState, useEffect } from "react";
import API from "../api/axios";

const AccountCard = ({ account }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const res = await API.get(`/accounts/balance/${account._id}`);
      setBalance(res.data.balance);
    } catch (err) {
      console.error("Failed to fetch balance", err);
    } finally {
      setLoading(false);
    }
  };

  // Format the ID for display (show only last 6 chars)
  const displayId = `...${account._id.slice(-6)}`;

  return (
    <div className="glass p-6 rounded-3xl hover:bg-white/[0.07] transition-all duration-300 group border border-white/5 hover:border-blue-500/30 shadow-lg relative overflow-hidden flex flex-col justify-between h-48 cursor-pointer transform hover:-translate-y-1">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150"></div>
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700/50 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
          <p className="text-xs font-medium text-slate-300 font-mono" title={account._id}>ACC-{displayId}</p>
        </div>
      </div>

      <div className="relative z-10 mt-6">
        <p className="text-sm text-slate-400 font-medium mb-1">Available Balance</p>
        {loading ? (
           <div className="h-8 w-32 bg-slate-800 rounded animate-pulse"></div>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-slate-400">₹</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              {balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>
      
      {/* Subtle overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default AccountCard;