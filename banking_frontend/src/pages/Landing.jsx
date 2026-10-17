import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-hidden relative">
      {/* Background ambient glowing spheres */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{animationDelay: '2s'}}></div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 sm:px-12 lg:px-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="animate-fade-in-up opacity-0 inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-sm text-blue-300 mb-8 border-blue-500/30">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          The Future of Banking is Here
        </div>
        
        <h1 className="animate-fade-in-up opacity-0 [animation-delay:200ms] text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          Next Generation <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Digital Wealth Management
          </span>
        </h1>

        <p className="animate-fade-in-up opacity-0 [animation-delay:400ms] text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          Experience seamless transactions, enterprise-grade security, and crystal-clear insights. 
          Take control of your financial destiny today.
        </p>

        <div className="animate-fade-in-up opacity-0 [animation-delay:600ms] flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transform hover:-translate-y-1"
          >
            Start Your Journey
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>

          <Link
            to="/login"
            className="flex items-center justify-center px-8 py-4 rounded-full font-medium text-slate-300 glass hover:bg-white/10 transition-all duration-300 hover:text-white"
          >
            Access Account
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 px-6 sm:px-12 lg:px-24 bg-slate-900/50 border-y border-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up opacity-0 [animation-delay:300ms]">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise Capabilities</h2>
            <p className="text-slate-400">Engineered for performance, designed for humans.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass p-8 rounded-2xl hover:bg-white/10 transition-colors duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150"></div>
              <div className="bg-blue-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Bank-Grade Security</h3>
              <p className="text-slate-400 leading-relaxed">
                Multi-factor authentication and end-to-end encryption keeping your data locked down.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass p-8 rounded-2xl hover:bg-white/10 transition-colors duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150"></div>
              <div className="bg-indigo-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-indigo-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Lightning Fast</h3>
              <p className="text-slate-400 leading-relaxed">
                Execute transfers and view balances instantly with our optimized global ledger network.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass p-8 rounded-2xl hover:bg-white/10 transition-colors duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150"></div>
              <div className="bg-purple-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 text-purple-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Multiple Accounts</h3>
              <p className="text-slate-400 leading-relaxed">
                Seamlessly manage checking, savings, and investment accounts all from a single pane of glass.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / About Section */}
      <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>Built with React, TailwindCSS v4, and Node.js</p>
        <p className="mt-2 text-slate-600">© 2026 NexusBank Digital Services. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;