import { useEffect, useState } from "react";
import API from "../api/axios";
import AccountCard from "../components/AccountCard";

const Dashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await API.get("/accounts");
      setAccounts(res.data.accounts);
    } catch (err) {
      console.error("Failed to fetch accounts", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#020617] text-slate-200 p-6 sm:p-12 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 animate-fade-in-up">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">
              Financial Overview
            </h1>
            <p className="text-slate-400">Manage your accounts and track your balances.</p>
          </div>
          
          <div className="mt-4 md:mt-0 glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-300">System Online</span>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass p-6 rounded-3xl h-48 animate-pulse flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl"></div>
                  <div className="w-24 h-6 bg-slate-800 rounded-md"></div>
                </div>
                <div>
                  <div className="w-32 h-8 bg-slate-800 rounded-lg mb-2"></div>
                  <div className="w-48 h-4 bg-slate-800 rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <div className="glass p-12 text-center rounded-3xl animate-fade-in-up flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No accounts found</h3>
            <p className="text-slate-400 mb-6">You don't have any active accounts yet.</p>
            <a href="/create-account" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors">
              Open an Account
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((acc, index) => (
               <div 
                 key={acc._id} 
                 className="animate-fade-in-up" 
                 style={{ animationDelay: `${index * 100}ms` }}
               >
                 <AccountCard account={acc} />
               </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;