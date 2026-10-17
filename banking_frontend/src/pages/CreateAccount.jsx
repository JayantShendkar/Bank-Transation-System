import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const createAccount = async () => {
    setLoading(true);
    setError("");
    
    try {
      await API.post("/accounts");
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      if(!success) setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-76px)] flex justify-center items-center bg-[#020617] relative overflow-hidden p-6 py-12">
      {/* Background Decorations */}
      <div className="absolute top-[20%] right-[30%] w-[400px] h-[400px] bg-green-600/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
      
      <div className="glass p-10 rounded-3xl w-full max-w-lg relative z-10 animate-fade-in-up text-center">
        
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 mx-auto shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-4">
          Open a New Account
        </h2>
        
        <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
          Create an additional checking or savings account instantly. No paperwork, no waiting.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6 mx-auto text-left flex items-center gap-3 animate-fade-in-up">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {success ? (
          <div className="glass bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-2xl animate-fade-in-up flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-white mb-1">Account Created!</h3>
            <p className="text-sm">Redirecting to your dashboard...</p>
          </div>
        ) : (
          <button
            onClick={createAccount}
            disabled={loading}
            className="w-full max-w-xs mx-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-medium rounded-xl text-lg px-8 py-4 text-center transition-all duration-300 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_25px_rgba(16,185,129,0.5)] transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center h-[60px]"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Create Account Now"}
          </button>
        )}

      </div>
    </div>
  );
};

export default CreateAccount;