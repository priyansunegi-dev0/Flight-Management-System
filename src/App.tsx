import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegistrationForm } from './components/RegistrationForm';
import { AdminDashboard } from './components/AdminDashboard';
import { PassengerDashboard } from './components/PassengerDashboard';
import { flightSystem } from './backend/FlightManagementSystem.js';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVIP?: boolean;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string>('');
  const [registrationError, setRegistrationError] = useState<string>('');
  const [showRegistration, setShowRegistration] = useState(false);

  // Check for existing session on app load
  React.useEffect(() => {
    const session = flightSystem.getUserSession();
    if (session.success) {
      setUser(session.user);
      console.log('🔄 Restored user session:', session.user);
    }
  }, []);

  const handleLogin = (userId: string, password: string) => {
    console.log('🔐 Login attempt:', { userId, password });
    
    const result = flightSystem.authenticateUser(userId, password);
    
    if (result.success) {
      setUser(result.user);
      setLoginError('');
      console.log('✅ Login successful:', result.user);
    } else {
      setLoginError(result.message);
      console.log('❌ Login failed:', result.message);
    }
  };

  const handleLogout = () => {
    console.log('👋 User logged out');
    flightSystem.clearUserSession();
    setUser(null);
    setLoginError('');
    setRegistrationError('');
    setShowRegistration(false);
  };

  const handleRegistration = (registrationData: any) => {
    console.log('📝 Registration attempt:', registrationData);
    
    const result = flightSystem.registerPassenger(registrationData);
    
    if (result.success) {
      setRegistrationError('');
      setShowRegistration(false);
      alert('✅ Registration successful! You can now log in with your credentials.');
      console.log('✅ Registration successful:', result.user);
    } else {
      setRegistrationError(result.message);
      console.log('❌ Registration failed:', result.message);
    }
  };

  const handleShowRegistration = () => {
    setShowRegistration(true);
    setLoginError('');
  };

  const handleBackToLogin = () => {
    setShowRegistration(false);
    setRegistrationError('');
  };

  // Show login form if no user is authenticated
  if (!user) {
    if (showRegistration) {
      return (
        <RegistrationForm 
          onRegister={handleRegistration} 
          onBackToLogin={handleBackToLogin}
          error={registrationError} 
        />
      );
    }
    return (
      <LoginForm 
        onLogin={handleLogin} 
        onShowRegistration={handleShowRegistration}
        error={loginError} 
      />
    );
  }

  // Show appropriate dashboard based on user role
  if (user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  } else {
    return <PassengerDashboard user={user} onLogout={handleLogout} />;
  }
}

export default App;