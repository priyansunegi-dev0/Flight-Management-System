import React, { useState, useEffect } from 'react';
import { 
  Users, Plane, Luggage, AlertTriangle, BarChart3, 
  UserPlus, PlusCircle, Settings, LogOut, RefreshCw,
  Clock, CheckCircle, XCircle, Star, Package
} from 'lucide-react';
import { flightSystem } from '../backend/FlightManagementSystem.js';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddPassenger, setShowAddPassenger] = useState(false);
  const [showAddFlight, setShowAddFlight] = useState(false);
  const [stats, setStats] = useState<any>({});
  const [passengers, setPassengers] = useState<any[]>([]);
  const [flights, setFlights] = useState<any[]>([]);
  const [boardingQueues, setBoardingQueues] = useState<any>({});
  const [luggageStacks, setLuggageStacks] = useState<any>({});
  const [missedLuggage, setMissedLuggage] = useState<any[]>([]);
  const [newPassenger, setNewPassenger] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    flightId: '',
    seatNumber: '',
    isVIP: false
  });
  const [newFlight, setNewFlight] = useState({
    id: '',
    flightNumber: '',
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    aircraft: '',
    capacity: 150,
    gate: ''
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setStats(flightSystem.getSystemStats());
    setPassengers(flightSystem.getAllPassengers());
    setFlights(flightSystem.getAllFlights());
    setBoardingQueues(flightSystem.getBoardingQueues());
    setLuggageStacks(flightSystem.getLuggageStacks());
    setMissedLuggage(flightSystem.getMissedLuggage());
  };

  const processNextBoarding = () => {
    const result = flightSystem.processNextBoarding();
    if (result.success) {
      alert(`✅ ${result.passenger.name} from ${result.queue} queue has boarded successfully!`);
      refreshData();
    } else {
      alert('❌ ' + result.message);
    }
  };

  const unloadLuggage = (isVIP: boolean) => {
    const result = flightSystem.unloadLuggage(isVIP);
    if (result.success) {
      alert(`✅ Luggage ${result.luggage.id} unloaded from ${isVIP ? 'VIP' : 'Regular'} stack!`);
      refreshData();
    } else {
      alert('❌ ' + result.message);
    }
  };

  const resolveMissedLuggage = (luggageId: string) => {
    const result = flightSystem.resolveMissedLuggage(luggageId);
    if (result.success) {
      alert('✅ ' + result.message);
      refreshData();
    } else {
      alert('❌ ' + result.message);
    }
  };

  const handleAddPassenger = (e: React.FormEvent) => {
    e.preventDefault();
    const result = flightSystem.addPassenger(newPassenger);
    if (result.success) {
      alert('✅ ' + result.message);
      setNewPassenger({
        id: '',
        name: '',
        email: '',
        phone: '',
        flightId: '',
        seatNumber: '',
        isVIP: false
      });
      setShowAddPassenger(false);
      refreshData();
    } else {
      alert('❌ ' + result.message);
    }
  };

  const handleAddFlight = (e: React.FormEvent) => {
    e.preventDefault();
    const flightData = {
      ...newFlight,
      status: 'Scheduled',
      bookedSeats: 0,
      departureTime: new Date(newFlight.departureTime).toISOString(),
      arrivalTime: new Date(newFlight.arrivalTime).toISOString()
    };
    
    const result = flightSystem.addFlight(flightData);
    if (result.success) {
      alert('✅ ' + result.message);
      setNewFlight({
        id: '',
        flightNumber: '',
        origin: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        aircraft: '',
        capacity: 150,
        gate: ''
      });
      setShowAddFlight(false);
      refreshData();
    } else {
      alert('❌ ' + result.message);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <Icon className="w-8 h-8" style={{ color }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Plane className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Flight Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshData}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview [HashMap - O(1) Data Access]', icon: BarChart3 },
              { id: 'passengers', label: 'Passengers [HashMap - Fast Lookup]', icon: Users },
              { id: 'flights', label: 'Flights [HashMap - Flight Storage]', icon: Plane },
              { id: 'boarding', label: 'Boarding Queue [Queue - FIFO Processing]', icon: Clock },
              { id: 'luggage', label: 'Luggage [Stack - LIFO Operations]', icon: Luggage },
              { id: 'missed', label: 'Missed Luggage [Linked List - Sequential Tracking]', icon: AlertTriangle },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Passengers"
                value={stats.totalPassengers}
                icon={Users}
                color="#3B82F6"
                subtitle={`${stats.generatedCredentials || 0} with auto-generated credentials`}
              />
              <StatCard
                title="Active Flights"
                value={stats.totalFlights}
                icon={Plane}
                color="#10B981"
                subtitle="Scheduled flights"
              />
              <StatCard
                title="Luggage Items"
                value={stats.totalLuggage}
                icon={Luggage}
                color="#F59E0B"
                subtitle={`${stats.dataStructureStats?.passengerLuggageStacks || 0} individual stacks`}
              />
              <StatCard
                title="Missed Luggage"
                value={stats.missedLuggage}
                icon={AlertTriangle}
                color="#EF4444"
                subtitle="Requires attention"
              />
            </div>

            {/* Data Structure Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Data Structure Status [Real-time DS Monitoring]
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">VIP Luggage Stack [LIFO]</p>
                  <p className="text-xl font-bold text-blue-600">{stats.dataStructureStats?.vipLuggageStack || 0}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Package className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Regular Luggage Stack [LIFO]</p>
                  <p className="text-xl font-bold text-green-600">{stats.dataStructureStats?.regularLuggageStack || 0}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">VIP Boarding Queue [FIFO]</p>
                  <p className="text-xl font-bold text-purple-600">{stats.dataStructureStats?.vipBoardingQueue || 0}</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Regular Boarding Queue [FIFO]</p>
                  <p className="text-xl font-bold text-orange-600">{stats.dataStructureStats?.regularBoardingQueue || 0}</p>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <Package className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Individual Luggage Stacks</p>
                  <p className="text-xl font-bold text-indigo-600">{stats.dataStructureStats?.passengerLuggageStacks || 0}</p>
                </div>
                <div className="text-center p-4 bg-teal-50 rounded-lg">
                  <Users className="w-6 h-6 text-teal-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Travel History Records</p>
                  <p className="text-xl font-bold text-teal-600">{stats.dataStructureStats?.travelHistoryRecords || 0}</p>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <Users className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Auto-Generated Credentials</p>
                  <p className="text-xl font-bold text-pink-600">{stats.generatedCredentials || 0}</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Package className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Processed Luggage Items</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.processedLuggage || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Passengers Tab */}
        {activeTab === 'passengers' && (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Passenger Management [HashMap - O(1) Passenger Lookup]
                </h3>
                <button 
                  onClick={() => setShowAddPassenger(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Passenger</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passenger</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {passengers.map((passenger) => (
                    <tr key={passenger.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{passenger.name}</div>
                            <div className="text-sm text-gray-500">{passenger.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{passenger.flightId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{passenger.seatNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          passenger.boardingStatus === 'Boarded' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {passenger.boardingStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {passenger.isVIP && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            <Star className="w-3 h-3 mr-1" />
                            VIP
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Boarding Queue Tab */}
        {activeTab === 'boarding' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Boarding Queue Management [Queue - FIFO with VIP Priority]
                </h3>
                <button
                  onClick={processNextBoarding}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Process Next Boarding</span>
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* VIP Queue */}
                <div className="border border-purple-200 rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 mb-3 flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    VIP Boarding Queue [Priority Queue - VIP First]
                  </h4>
                  <div className="space-y-2">
                    {boardingQueues.vip?.map((passenger: any, index: number) => (
                      <div key={passenger.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{passenger.name}</p>
                          <p className="text-sm text-gray-500">Seat {passenger.seatNumber} • {passenger.flightId}</p>
                        </div>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                          #{index + 1}
                        </span>
                      </div>
                    ))}
                    {(!boardingQueues.vip || boardingQueues.vip.length === 0) && (
                      <p className="text-gray-500 text-center py-4">No VIP passengers in queue</p>
                    )}
                  </div>
                </div>

                {/* Regular Queue */}
                <div className="border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Regular Boarding Queue [Standard FIFO Queue]
                  </h4>
                  <div className="space-y-2">
                    {boardingQueues.regular?.map((passenger: any, index: number) => (
                      <div key={passenger.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{passenger.name}</p>
                          <p className="text-sm text-gray-500">Seat {passenger.seatNumber} • {passenger.flightId}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          #{index + 1}
                        </span>
                      </div>
                    ))}
                    {(!boardingQueues.regular || boardingQueues.regular.length === 0) && (
                      <p className="text-gray-500 text-center py-4">No regular passengers in queue</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Luggage Tab */}
        {activeTab === 'luggage' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Luggage Stack Management [Stack - LIFO Last Loaded, First Unloaded]
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* VIP Luggage Stack */}
                <div className="border border-purple-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-purple-800 flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      VIP Luggage Stack [Stack - LIFO Priority Processing]
                    </h4>
                    <button
                      onClick={() => unloadLuggage(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Unload Top
                    </button>
                  </div>
                  <div className="space-y-2">
                    {luggageStacks.vip?.slice().reverse().map((luggage: any, index: number) => (
                      <div key={luggage.id} className={`p-3 rounded-lg ${index === 0 ? 'bg-purple-100 border-2 border-purple-300' : 'bg-purple-50'}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{luggage.id}</p>
                            <p className="text-sm text-gray-500">{luggage.description} • {luggage.weight}kg</p>
                          </div>
                          {index === 0 && (
                            <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                              TOP
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {(!luggageStacks.vip || luggageStacks.vip.length === 0) && (
                      <p className="text-gray-500 text-center py-4">No VIP luggage in stack</p>
                    )}
                  </div>
                </div>

                {/* Regular Luggage Stack */}
                <div className="border border-blue-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-blue-800 flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Regular Luggage Stack [Stack - Standard LIFO Operations]
                    </h4>
                    <button
                      onClick={() => unloadLuggage(false)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Unload Top
                    </button>
                  </div>
                  <div className="space-y-2">
                    {luggageStacks.regular?.slice().reverse().map((luggage: any, index: number) => (
                      <div key={luggage.id} className={`p-3 rounded-lg ${index === 0 ? 'bg-blue-100 border-2 border-blue-300' : 'bg-blue-50'}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{luggage.id}</p>
                            <p className="text-sm text-gray-500">{luggage.description} • {luggage.weight}kg</p>
                          </div>
                          {index === 0 && (
                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                              TOP
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {(!luggageStacks.regular || luggageStacks.regular.length === 0) && (
                      <p className="text-gray-500 text-center py-4">No regular luggage in stack</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Missed Luggage Tab */}
        {activeTab === 'missed' && (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Missed Luggage Tracking [Linked List - Sequential Node Traversal]
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Items tracked chronologically using linked list with O(n) search, O(1) insertion
              </p>
            </div>
            <div className="p-6">
              {missedLuggage.length > 0 ? (
                <div className="space-y-4">
                  {missedLuggage.map((luggage: any, index: number) => (
                    <div key={luggage.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <h4 className="font-medium text-gray-900">{luggage.id}</h4>
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                              Node #{index + 1}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p><span className="font-medium">Passenger:</span> {luggage.passengerId}</p>
                              <p><span className="font-medium">Description:</span> {luggage.description}</p>
                              <p><span className="font-medium">Weight:</span> {luggage.weight}kg</p>
                            </div>
                            <div>
                              <p><span className="font-medium">Reported:</span> {new Date(luggage.reportedAt).toLocaleString()}</p>
                              <p><span className="font-medium">Status:</span> {luggage.recoveryStatus}</p>
                              {luggage.isVIP && (
                                <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 mt-1">
                                  <Star className="w-3 h-3 mr-1" />
                                  VIP
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => resolveMissedLuggage(luggage.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors ml-4"
                        >
                          Mark Found
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500">No missed luggage items</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Flights Tab */}
        {activeTab === 'flights' && (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Flight Management [HashMap - O(1) Flight Retrieval]
                </h3>
                <button 
                  onClick={() => setShowAddFlight(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Flight</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {flights.map((flight) => (
                    <tr key={flight.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Plane className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{flight.flightNumber}</div>
                            <div className="text-sm text-gray-500">{flight.aircraft}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{flight.origin}</div>
                        <div className="text-sm text-gray-500">to {flight.destination}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(flight.departureTime).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(flight.departureTime).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          flight.status === 'On Time' 
                            ? 'bg-green-100 text-green-800'
                            : flight.status === 'Boarding'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {flight.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {flight.bookedSeats}/{flight.capacity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Passenger Modal */}
      {showAddPassenger && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Passenger [HashMap Insert Operation]
              </h3>
            </div>
            <form onSubmit={handleAddPassenger} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Passenger ID</label>
                <input
                  type="text"
                  value={newPassenger.id}
                  onChange={(e) => setNewPassenger({...newPassenger, id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., P005"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newPassenger.name}
                  onChange={(e) => setNewPassenger({...newPassenger, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newPassenger.email}
                  onChange={(e) => setNewPassenger({...newPassenger, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={newPassenger.phone}
                  onChange={(e) => setNewPassenger({...newPassenger, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flight ID</label>
                <select
                  value={newPassenger.flightId}
                  onChange={(e) => setNewPassenger({...newPassenger, flightId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Flight</option>
                  {flights.map(flight => (
                    <option key={flight.id} value={flight.id}>{flight.flightNumber} - {flight.origin} to {flight.destination}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seat Number</label>
                <input
                  type="text"
                  value={newPassenger.seatNumber}
                  onChange={(e) => setNewPassenger({...newPassenger, seatNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 12A"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isVIP"
                  checked={newPassenger.isVIP}
                  onChange={(e) => setNewPassenger({...newPassenger, isVIP: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isVIP" className="ml-2 block text-sm text-gray-900">
                  VIP Passenger (Priority Queue Processing)
                </label>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Add Passenger
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPassenger(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-1">Auto-Generated Credentials System:</p>
                <p className="text-xs text-blue-600">
                  • Username: Generated from name (e.g., "johnsmith001")<br/>
                  • Password: Uses Passenger ID for simplicity<br/>
                  • Login Methods: Both username/password and passengerID/password work
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Flight Modal */}
      {showAddFlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Flight [HashMap Storage Operation]
              </h3>
            </div>
            <form onSubmit={handleAddFlight} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flight ID</label>
                <input
                  type="text"
                  value={newFlight.id}
                  onChange={(e) => setNewFlight({...newFlight, id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., FL003"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
                <input
                  type="text"
                  value={newFlight.flightNumber}
                  onChange={(e) => setNewFlight({...newFlight, flightNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., AA102"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                <input
                  type="text"
                  value={newFlight.origin}
                  onChange={(e) => setNewFlight({...newFlight, origin: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., New York (JFK)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input
                  type="text"
                  value={newFlight.destination}
                  onChange={(e) => setNewFlight({...newFlight, destination: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., San Francisco (SFO)"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                <input
                  type="datetime-local"
                  value={newFlight.departureTime}
                  onChange={(e) => setNewFlight({...newFlight, departureTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
                <input
                  type="datetime-local"
                  value={newFlight.arrivalTime}
                  onChange={(e) => setNewFlight({...newFlight, arrivalTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Aircraft</label>
                <input
                  type="text"
                  value={newFlight.aircraft}
                  onChange={(e) => setNewFlight({...newFlight, aircraft: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Boeing 737-800"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                <input
                  type="number"
                  value={newFlight.capacity}
                  onChange={(e) => setNewFlight({...newFlight, capacity: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="50"
                  max="500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gate</label>
                <input
                  type="text"
                  value={newFlight.gate}
                  onChange={(e) => setNewFlight({...newFlight, gate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., A12"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Add Flight
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddFlight(false)}
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
  );
};