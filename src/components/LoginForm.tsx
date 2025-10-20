import React, { useState } from 'react';
import { User, Lock, Plane, Shield, Users, UserPlus } from 'lucide-react';

interface LoginFormProps {
  onLogin: (userId: string, password: string) => void;
  onShowRegistration: () => void;
  error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onShowRegistration, error }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(userId, password);
  };

  const demoAccounts = [
    { id: 'admin', password: 'admin', role: 'Administrator', icon: Shield },
    { id: 'P001', password: 'pass123', role: 'Regular Passenger', icon: User },
    { id: 'P002', password: 'pass123', role: 'VIP Passenger', icon: Users },
    { id: 'P003', password: 'pass123', role: 'Regular Passenger', icon: User },
    { id: 'P004', password: 'pass123', role: 'VIP Passenger', icon: Users },
    { id: 'johnsmith001', password: 'P005', role: 'Auto-Generated Passenger (Username)', icon: User },
    { id: 'P005', password: 'P005', role: 'Auto-Generated Passenger (ID)', icon: User },
    { id: 'sarahj002', password: 'P006', role: 'Auto-Generated VIP (Username)', icon: Users },
    { id: 'P006', password: 'P006', role: 'Auto-Generated VIP (ID)', icon: Users },
  ];

  const quickLogin = (demoUserId: string, demoPassword: string) => {
    setUserId(demoUserId);
    setPassword(demoPassword);
    onLogin(demoUserId, demoPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
            <Plane className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Flight Management System</h1>
          <p className="text-blue-200">Secure access to your flight information</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your user ID"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <button
            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
            className="w-full text-white font-medium mb-4 hover:text-blue-200 transition-colors"
          >
            {showDemoAccounts ? 'Hide' : 'Show'} Demo Accounts
          </button>
          
        
        {/* Registration Link */}
        <div className="mt-4 text-center">
          <button
            onClick={onShowRegistration}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center justify-center space-x-2 mx-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Account</span>
          </button>
        </div>
          {showDemoAccounts && (
            <div className="space-y-3">
              <div className="mb-4">
                <p className="text-blue-200 text-sm mb-2">Click any account to login instantly:</p>
                <div className="text-xs text-blue-300 bg-blue-800/30 rounded p-2">
                  <p className="font-medium mb-1">🔐 Authentication System Features:</p>
                  <p>• Auto-generated credentials use Passenger ID as initial password</p>
                  <p>• Login with either Username or Passenger ID</p>
                  <p>• VIP passengers get enhanced dashboard privileges</p>
                </div>
              </div>
              {demoAccounts.map((account) => {
                const IconComponent = account.icon;
                return (
                  <button
                    key={account.id}
                    onClick={() => quickLogin(account.id, account.password)}
                    className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5 text-blue-200 group-hover:text-white" />
                      <div>
                        <div className="text-white font-medium">{account.id}</div>
                        <div className="text-blue-200 text-sm">{account.role}</div>
                      </div>
                      <div className="ml-auto text-blue-200 text-xs">
                        {account.password}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-200 text-sm">
            🎓 Educational System: Stack (LIFO Luggage), Queue (FIFO Boarding), LinkedList (Missed Items), HashMap (O(1) Lookups)
          </p>
          <p className="text-blue-300 text-xs mt-2">
            🔐 Auto-Generated Credentials: Passenger ID serves as both username and password for new registrations
          </p>
        </div>
      </div>
    </div>
  );
};