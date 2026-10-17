import { useState, useEffect } from "react";
import API from "../api/axios";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await API.get("/transactions");
        setTransactions(data.transactions);
      } catch (err) {
        setError("Failed to load transaction history");
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-76px)] bg-[#020617] p-8 flex justify-center items-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-purple-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-76px)] bg-[#020617] relative p-6 py-12">
      {/* Background Decorations */}
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 animate-fade-in-up">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Transaction History</h1>
            <p className="text-slate-400">View past transfers and deposits across your accounts.</p>
          </div>
        </div>

        {error ? (
           <div className="glass p-8 rounded-2xl flex flex-col items-center justify-center text-center">
             <p className="text-red-400 mb-2">{error}</p>
             <button onClick={() => window.location.reload()} className="text-blue-400 hover:underline text-sm">Retry</button>
           </div>
        ) : transactions.length === 0 ? (
          <div className="glass p-16 rounded-2xl flex flex-col items-center justify-center text-center border border-white/5">
             <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
             </div>
             <h3 className="text-xl font-medium text-white mb-2">No Transactions Yet</h3>
             <p className="text-slate-400 max-w-sm">When you make a transfer or deposit, it will show up here.</p>
          </div>
        ) : (
          <div className="glass rounded-3xl overflow-hidden border border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0f172a]/80 text-xs uppercase font-medium text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">From Account</th>
                    <th className="px-6 py-4">To Account</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-white/[0.02] transition-colors">
                       <td className="px-6 py-4">
                          <span className="font-mono text-xs text-slate-500 bg-slate-900/50 px-2 py-1 rounded">
                            {tx.idempotencyKey.slice(0, 10)}...
                          </span>
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-300">
                          {new Date(tx.createdAt).toLocaleDateString()}
                       </td>
                       <td className="px-6 py-4">
                         <div className="text-sm font-medium text-slate-200">
                           {tx.fromAccount?._id ? `ACC-${tx.fromAccount._id.slice(-6).toUpperCase()}` : 'System'}
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="text-sm font-medium text-slate-200">
                           {tx.toAccount?._id ? `ACC-${tx.toAccount._id.slice(-6).toUpperCase()}` : 'External'}
                         </div>
                       </td>
                       <td className="px-6 py-4">
                          <span className="font-medium text-white">₹{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            tx.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                            tx.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {tx.status}
                          </span>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
