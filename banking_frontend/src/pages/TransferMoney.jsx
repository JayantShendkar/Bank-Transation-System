import { useState } from "react";
import API from "../api/axios";

const TransferMoney = () => {
  const [form, setForm] = useState({
    fromAccount: "",
    toAccount: "",
    amount: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" }); // type: 'success' | 'error'

  const transfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    const data = {
      ...form,
      idempotencyKey: Date.now().toString()
    };

    try {
      await API.post("/transactions", data);
      setStatus({ type: "success", message: "Transfer completed successfully!" });
      setForm({ fromAccount: "", toAccount: "", amount: "" }); // reset form
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Transaction failed. Check details." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex justify-center items-center bg-[#020617] relative overflow-hidden p-6 py-12">
      {/* Background Decorations */}
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      
      <div className="glass p-10 rounded-3xl w-full max-w-xl relative z-10 animate-fade-in-up">
        <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Transfer Funds</h2>
            <p className="text-slate-400 text-sm">Send money securely across accounts</p>
          </div>
        </div>

        {status.message && (
          <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 animate-fade-in-up ${
            status.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              {status.type === 'success' ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              )}
            </svg>
            <div>
              <p className="font-medium text-sm">
                {status.type === 'success' ? 'Transaction Successful' : 'Transaction Failed'}
              </p>
              <p className="text-sm opacity-80 mt-1 pb-0.5">{status.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={transfer} className="flex flex-col gap-6">
          
          <div className="grid md:grid-cols-2 gap-6 relative">
            {/* Connecting line between inputs on desktop */}
            <div className="hidden md:block absolute top-[28px] left-[45%] right-[45%] h-0.5 bg-slate-700/50 z-0 flex items-center justify-center">
               <div className="w-8 h-8 rounded-full bg-[#020617] glass flex items-center justify-center z-10 border border-slate-700/50 text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
               </div>
            </div>

            <div className="space-y-2 relative z-10">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider pl-1">From Account</label>
              <input
                required
                className="w-full bg-slate-900/50 border border-slate-700/50 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block p-4 transition-all duration-300 font-mono placeholder-slate-600"
                placeholder="ACC-XXXXXX"
                value={form.fromAccount}
                onChange={(e) => setForm({ ...form, fromAccount: e.target.value })}
              />
            </div>

            <div className="space-y-2 relative z-10">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider pl-1">To Account</label>
              <input
                required
                className="w-full bg-slate-900/50 border border-slate-700/50 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block p-4 transition-all duration-300 font-mono placeholder-slate-600"
                placeholder="ACC-XXXXXX"
                value={form.toAccount}
                onChange={(e) => setForm({ ...form, toAccount: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2 mt-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider pl-1">Amount</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <span className="text-slate-500 font-medium group-focus-within:text-blue-400 transition-colors text-lg">₹</span>
              </div>
              <input
                type="number"
                required
                min="1"
                step="any"
                className="w-full bg-slate-900/50 border border-slate-700/50 text-white text-lg rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block pl-10 p-4 transition-all duration-300 placeholder-slate-600"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-xl text-lg px-5 py-4 text-center transition-all duration-300 shadow-[0_4px_15px_rgba(37,99,235,0.3)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.4)] transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center h-[60px]"
          >
           {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Execute Transfer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferMoney;