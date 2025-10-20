import React, { useState, useEffect } from 'react';
import { User, Plane, Luggage, Clock, MapPin, Wheat as Seat, CheckCircle, AlertCircle, Star, LogOut, RefreshCw, Calendar, Users, Package, Phone, Mail, CreditCard, History, Plus, Minus } from 'lucide-react';
import { flightSystem } from '../backend/FlightManagementSystem.js';

interface PassengerDashboardProps {
  user: any;
  onLogout: () => void;
}

export const PassengerDashboard: React.FC<PassengerDashboardProps> = ({ user, onLogout }) => {
  const [passenger, setPassenger] = useState<any>(null);
  const [flight, setFlight] = useState<any>(null);
  const [luggage, setLuggage] = useState<any[]>([]);
  const [boardingPosition, setBoardingPosition] = useState<any>(null);
  const [boardingPass, setBoardingPass] = useState<any>(null);
  const [travelHistory, setTravelHistory] = useState<any[]>([]);
  const [showAddLuggage, setShowAddLuggage] = useState(false);
  const [newLuggage, setNewLuggage] = useState({
    id: '',
    description: '',
    weight: '',
    type: 'Checked'
  });

  useEffect(() => {
    refreshData();
  }, [user.id]);

  const refreshData = () => {
    const passengerData = flightSystem.getPassenger(user.id);
    setPassenger(passengerData);
    
    if (passengerData?.flightId) {
      const flightData = flightSystem.getFlight(passengerData.flightId);
      setFlight(flightData);
    }
    
    const passengerLuggage = flightSystem.getPassengerLuggage(user.id);
    setLuggage(passengerLuggage);
    
    const boardingPassData = flightSystem.getBoardingPass(user.id);
    setBoardingPass(boardingPassData);
    
    const history = flightSystem.getPassengerTravelHistory(user.id);
    setTravelHistory(history);
    
    // Get boarding position
    const queues = flightSystem.getBoardingQueues();
    const vipPosition = queues.vip?.findIndex((p: any) => p.id === user.id);
    const regularPosition = queues.regular?.findIndex((p: any) => p.id === user.id);
    
    if (vipPosition !== -1 && vipPosition !== undefined) {
      setBoardingPosition({ queue: 'VIP', position: vipPosition + 1 });
    } else if (regularPosition !== -1 && regularPosition !== undefined) {
      setBoardingPosition({ queue: 'Regular', position: regularPosition + 1 });
    } else {
      setBoardingPosition(null);
    }
  };

  const handleAddLuggage = (e: React.FormEvent) => {
    e.preventDefault();
    const luggageData = {
      ...newLuggage,
      weight: parseFloat(newLuggage.weight),
      id: `L${Date.now()}`
    };
    
    const result = flightSystem.addLuggageToPassenger(user.id, luggageData);
    if (result.success) {
      alert(`✅ ${result.message}\n\nTracking Number: ${result.luggage.trackingNumber}`);
      setNewLuggage({
        id: '',
        description: '',
        weight: '',
        type: 'Checked'
      });
      setShowAddLuggage(false);
      refreshData();
    } else {
      alert('❌ ' + result.message);
    }
  };

  const handleRemoveLuggage = () => {
    const result = flightSystem.removePassengerLuggage(user.id);
    if (result.success) {
      alert(`✅ Luggage ${result.luggage.id} retrieved successfully! [Stack LIFO Operation]`);
      refreshData();
    } else {
      alert('❌ ' + result.message);
    }
  };

  if (!passenger) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Passenger Not Found</h2>
          <p className="text-gray-600">Unable to load passenger information.</p>
        </div>
      </div>
    );
  }

  const StatusBadge = ({ status, type = 'default' }: any) => {
    const colors = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[type]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`shadow-sm border-b ${passenger.isVIP ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Plane className={`w-8 h-8 ${passenger.isVIP ? 'text-white' : 'text-blue-600'}`} />
              <div>
                <h1 className={`text-xl font-bold ${passenger.isVIP ? 'text-white' : 'text-gray-900'}`}>
                  {passenger.isVIP ? 'VIP Portal [Priority Queue Access]' : 'Passenger Portal [HashMap Lookup]'}
                </h1>
                <p className={`text-sm ${passenger.isVIP ? 'text-purple-100' : 'text-gray-500'}`}>
                  Data Structures in Action
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshData}
                className={`p-2 rounded-lg transition-colors ${
                  passenger.isVIP 
                    ? 'text-white hover:bg-purple-500' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <p className={`text-sm font-medium ${passenger.isVIP ? 'text-white' : 'text-gray-900'}`}>
                    {passenger.name}
                  </p>
                  {passenger.isVIP && <Star className="w-4 h-4 text-yellow-300" />}
                </div>
                <p className={`text-xs ${passenger.isVIP ? 'text-purple-100' : 'text-gray-500'}`}>
                  {passenger.id}
                </p>
              </div>
              <button
                onClick={onLogout}
                className={`p-2 rounded-lg transition-colors ${
                  passenger.isVIP 
                    ? 'text-white hover:bg-red-500' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Flight Information */}
            {flight && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className={`p-6 ${passenger.isVIP ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}>
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h2 className="text-2xl font-bold">{flight.flightNumber} [HashMap Retrieval]</h2>
                      <p className="opacity-90">{flight.aircraft}</p>
                    </div>
                    <Plane className="w-8 h-8" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">From</p>
                          <p className="font-medium text-gray-900">{flight.origin}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">To</p>
                          <p className="font-medium text-gray-900">{flight.destination}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Departure</p>
                          <p className="font-medium text-gray-900">
                            {new Date(flight.departureTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Status</p>
                          <StatusBadge 
                            status={flight.status} 
                            type={flight.status === 'On Time' ? 'success' : 'warning'} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <Seat className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-sm text-gray-500">Seat</p>
                        <p className="font-semibold text-gray-900">{passenger.seatNumber}</p>
                      </div>
                      <div className="text-center">
                        <Users className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-sm text-gray-500">Gate</p>
                        <p className="font-semibold text-gray-900">{flight.gate}</p>
                      </div>
                      <div className="text-center">
                        <CheckCircle className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-sm text-gray-500">Check-in</p>
                        <StatusBadge 
                          status={passenger.checkInStatus} 
                          type={passenger.checkInStatus === 'Checked In' ? 'success' : 'warning'} 
                        />
                      </div>
                      <div className="text-center">
                        <Clock className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-sm text-gray-500">Boarding</p>
                        <StatusBadge 
                          status={passenger.boardingStatus} 
                          type={passenger.boardingStatus === 'Boarded' ? 'success' : 'info'} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Boarding Information */}
            {boardingPosition && (
              <div className={`rounded-xl shadow-lg overflow-hidden ${
                passenger.isVIP ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
              }`}>
                <div className="p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Boarding Queue Position [{passenger.isVIP ? 'Priority Queue' : 'Standard FIFO Queue'}]
                      </h3>
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm opacity-90">Queue Type</p>
                          <p className="text-xl font-bold">{boardingPosition.queue}</p>
                        </div>
                        <div>
                          <p className="text-sm opacity-90">Position</p>
                          <p className="text-xl font-bold">#{boardingPosition.position}</p>
                        </div>
                      </div>
                    </div>
                    <Users className="w-8 h-8 opacity-80" />
                  </div>
                  {passenger.isVIP && (
                    <div className="mt-4 p-3 bg-white/20 rounded-lg">
                      <p className="text-sm">
                        ⭐ VIP Priority Queue: You are processed before all regular passengers (Queue data structure with priority)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Luggage Information */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Luggage className="w-5 h-5 mr-2" />
                      My Personal Luggage Stack [Individual Stack - LIFO Operations]
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Your luggage managed through personal Stack (Last In, First Out) with tracking numbers
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowAddLuggage(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-1 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Luggage</span>
                    </button>
                    {luggage.length > 0 && (
                      <button
                        onClick={handleRemoveLuggage}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-1 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                        <span>Retrieve Top</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-6">
                {luggage.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 mb-3">
                      Stack Order: Top → Bottom (LIFO - Last luggage added will be first retrieved)
                    </div>
                    {luggage.slice().reverse().map((item, index) => (
                      <div key={item.id} className={`border rounded-lg p-4 ${
                        index === 0 ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Package className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{item.id}</p>
                              <p className="text-sm text-gray-500">{item.description}</p>
                              <p className="text-xs text-gray-400">Tracking: {item.trackingNumber}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {index === 0 && (
                              <span className="inline-block bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium mb-1">
                                TOP OF STACK
                              </span>
                            )}
                            <StatusBadge 
                              status={item.status} 
                              type={
                                item.status === 'Loaded' ? 'success' :
                                item.status === 'Checked In' ? 'info' :
                                item.status === 'Missing' ? 'error' : 'info'
                              } 
                            />
                            <p className="text-sm text-gray-500 mt-1">{item.weight}kg</p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                          <span>Type: {item.type} • Added: {new Date(item.addedAt).toLocaleString()}</span>
                          {item.isVIP && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              <Star className="w-3 h-3 mr-1" />
                              VIP Priority
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Your luggage stack is empty</p>
                    <button
                      onClick={() => setShowAddLuggage(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Add Your First Luggage Item
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Boarding Pass */}
            {boardingPass && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className={`p-6 ${passenger.isVIP ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'}`}>
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h3 className="text-lg font-semibold">Digital Boarding Pass [Object Data Structure]</h3>
                      <p className="opacity-90">Generated from passenger and flight data objects</p>
                    </div>
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Passenger</p>
                        <p className="font-semibold text-gray-900">{boardingPass.passengerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Flight</p>
                        <p className="font-semibold text-gray-900">{boardingPass.flightNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Seat</p>
                        <p className="font-semibold text-gray-900">{boardingPass.seatNumber}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Gate</p>
                        <p className="font-semibold text-gray-900">{boardingPass.gate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Boarding Time</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(boardingPass.boardingTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Departure</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(boardingPass.departureTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Travel History */}
            {travelHistory.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <History className="w-5 h-5 mr-2" />
                    Travel History [Array Data Structure - Chronological Records]
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Past flights stored in dynamic array with O(n) iteration for display
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {travelHistory.map((record, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{record.flightNumber}</p>
                            <p className="text-sm text-gray-500">{record.origin} → {record.destination}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-900">
                              {new Date(record.departureTime).toLocaleDateString()}
                            </p>
                            <StatusBadge status={record.status} type="success" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Passenger Information */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Passenger Profile [HashMap O(1) Lookup + Auto-Generated Credentials]
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Profile data with auto-generated secure login credentials
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{passenger.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Passenger ID</p>
                    <p className="font-medium text-gray-900">{passenger.id}</p>
                  </div>
                </div>
                {user.username && (
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="font-medium text-gray-900">{user.username}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{passenger.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{passenger.phone || 'Not provided'}</p>
                  </div>
                </div>
                {passenger.credentials && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Auto-Generated Login Credentials</span>
                    </div>
                    <div className="text-xs text-blue-600 space-y-1">
                      <p><span className="font-medium">Username:</span> {passenger.credentials.username}</p>
                      <p><span className="font-medium">Generated:</span> {new Date(passenger.credentials.generatedAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {passenger.registrationDate && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Registered Account</span>
                    </div>
                    <div className="text-xs text-green-600 space-y-1">
                      <p><span className="font-medium">Registration Date:</span> {new Date(passenger.registrationDate).toLocaleString()}</p>
                      <p><span className="font-medium">Account Type:</span> {passenger.isVIP ? 'VIP Passenger' : 'Regular Passenger'}</p>
                    </div>
                  </div>
                )}
                {passenger.isVIP && (
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">VIP Status</span>
                    </div>
                    <p className="text-xs text-purple-600 mt-1">
                      Enjoy priority services and exclusive benefits
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Special Requests */}
            {passenger.specialRequests && passenger.specialRequests.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Special Requests [Array Data Structure]
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Requests stored as dynamic array with O(n) iteration
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-2">
                    {passenger.specialRequests.map((request: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{request}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Actions [Function Call Stack + Event Handlers]
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  UI actions processed through JavaScript call stack
                </p>
              </div>
              <div className="p-6 space-y-3">
                <button 
                  onClick={() => alert('Boarding pass downloaded! [File System API]')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Download Boarding Pass
                </button>
                <button 
                  onClick={() => setShowAddLuggage(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Add Luggage to Stack
                </button>
                <button 
                  onClick={() => alert('Contact information update form would open here [Form State Management]')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Update Contact Info
                </button>
                <button 
                  onClick={() => alert('Assistance request submitted! [Queue System]')}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Request Assistance
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Luggage Modal */}
        {showAddLuggage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Luggage to Personal Stack [Stack Push Operation]
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  New luggage will be added to the top of your personal LIFO stack
                </p>
              </div>
              <form onSubmit={handleAddLuggage} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={newLuggage.description}
                    onChange={(e) => setNewLuggage({...newLuggage, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Large suitcase, Laptop bag"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newLuggage.weight}
                    onChange={(e) => setNewLuggage({...newLuggage, weight: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter weight"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newLuggage.type}
                    onChange={(e) => setNewLuggage({...newLuggage, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Checked">Checked Luggage</option>
                    <option value="Carry-on">Carry-on</option>
                    <option value="Personal">Personal Item</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Add to Stack (Push)
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddLuggage(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};