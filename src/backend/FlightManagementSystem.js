/**
 * FLIGHT MANAGEMENT SYSTEM - BACKEND IMPLEMENTATION
 * 
 * This file contains the main backend logic that orchestrates all data structures
 * to provide a complete flight management system functionality.
 */

import { Stack, Queue, LinkedList, HashMap } from './DataStructures.js';

/**
 * Main Flight Management System Backend
 * Coordinates all data structures to provide comprehensive flight management
 */
export class FlightManagementSystem {
  constructor() {
    console.log('🛫 Initializing Flight Management System Backend...');
    
    // ================================
    // DATA STRUCTURE INITIALIZATION
    // ================================
    
    // STACK: Luggage Management (LIFO)
    this.regularLuggageStack = new Stack("Regular Luggage");
    this.vipLuggageStack = new Stack("VIP Luggage");
    
    // INDIVIDUAL PASSENGER LUGGAGE STACKS
    this.passengerLuggageStacks = new HashMap(64, "Passenger Luggage Stacks");
    
    // QUEUE: Passenger Boarding (FIFO)
    this.regularBoardingQueue = new Queue("Regular Boarding");
    this.vipBoardingQueue = new Queue("VIP Boarding");
    
    // LINKED LIST: Missed Luggage Tracking
    this.missedLuggageList = new LinkedList("Missed Luggage");
    
    // HASHMAP: Data Storage and Fast Retrieval
    this.passengers = new HashMap(32, "Passengers");
    this.flights = new HashMap(16, "Flights");
    this.luggage = new HashMap(64, "Luggage");
    this.users = new HashMap(16, "Users");
    this.travelHistory = new HashMap(32, "Travel History");
    
    // System state
    this.systemStats = {
      totalPassengers: 0,
      totalFlights: 0,
      totalLuggage: 0,
      boardedPassengers: 0,
      processedLuggage: 0,
      missedLuggage: 0,
      generatedCredentials: 0
    };
    
    this.initializeSystem();
    console.log('✅ Flight Management System Backend initialized successfully!');
  }

  /**
   * Initialize system with demo data
   */
  initializeSystem() {
    console.log('🔧 Setting up demo data and user accounts...');
    
    // Initialize user accounts
    this.setupUserAccounts();
    
    // Initialize demo flights
    this.setupDemoFlights();
    
    // Initialize demo passengers
    this.setupDemoPassengers();
    
    // Initialize demo luggage
    this.setupDemoLuggage();
    
    console.log('✅ Demo data setup complete!');
  }

  /**
   * Setup user accounts for authentication
   */
  setupUserAccounts() {
    // Admin account
    this.users.put('admin', {
      id: 'admin',
      password: 'admin',
      role: 'admin',
      name: 'System Administrator',
      email: 'admin@airline.com'
    });

    // Regular passenger accounts
    this.users.put('P001', {
      id: 'P001',
      password: 'priyansu',
      role: 'passenger',
      name: 'Priyansu Negi',
      email: 'priyansunegi@email.com',
      isVIP: false
    });

    this.users.put('P002', {
      id: 'P002',
      password: 'neeraj',
      role: 'passenger',
      name: 'Neeraj Bisht',
      email: 'neerajbisht@email.com',
      isVIP: true
    });

    this.users.put('P003', {
      id: 'P003',
      password: 'ayush',
      role: 'passenger',
      name: 'Ayush Rawat',
      email: 'mike.wilson@email.com',
      isVIP: false
    });

    this.users.put('P004', {
      id: 'P004',
      password: 'rahul',
      role: 'passenger',
      name: 'Rahul',
      email: 'emma.davis@email.com',
      isVIP: true
    });

    // Load registered users from localStorage
    this.loadRegisteredUsers();
    
    console.log('👥 User accounts created');
  }

  /**
   * Setup demo flights
   */
  setupDemoFlights() {
    const flights = [
      {
        id: 'FL001',
        flightNumber: 'AA101',
        origin: 'Delhi (DEL)',
        destination: 'Mumbai (BOM)',
        departureTime: '2024-01-15T08:00:00',
        arrivalTime: '2024-01-15T11:30:00',
        status: 'On Time',
        aircraft: 'Airbus A320neo',
        capacity: 180,
        bookedSeats: 4,
        gate: 'A12'
      },
      {
        id: 'FL002',
        flightNumber: 'UA205',
        origin: 'Bengaluru (BLR)',
        destination: 'Kolkata (CCU)',
        departureTime: '2024-01-15T14:30:00',
        arrivalTime: '2024-01-15T18:45:00',
        status: 'Boarding',
        aircraft: 'Airbus A320',
        capacity: 150,
        bookedSeats: 0,
        gate: 'B7'
      }
    ];

    flights.forEach(flight => {
      this.flights.put(flight.id, flight);
      this.systemStats.totalFlights++;
    });

    console.log('✈️ Demo flights created');
  }

  /**
   * Setup demo passengers
   */
  setupDemoPassengers() {
    const passengers = [
      {
        id: 'P001',
        name: 'Priyansu Negi',
        email: 'priyansunegi@email.com',
        phone: '+91-85645-01801',
        flightId: 'FL001',
        seatNumber: '12A',
        isVIP: false,
        checkInStatus: 'Checked In',
        boardingStatus: 'Waiting',
        specialRequests: []
      },
      {
        id: 'P002',
        name: 'Neeraj Bisht',
        email: 'neerajbisht@email.com',
        phone: '+91-55555-01902',
        flightId: 'FL001',
        seatNumber: '3B',
        isVIP: true,
        checkInStatus: 'Checked In',
        boardingStatus: 'Waiting',
        specialRequests: ['Priority Boarding', 'Extra Legroom']
      },
      {
        id: 'P003',
        name: 'Ayush Rawat',
        email: 'ayushrawat@email.com',
        phone: '+91-55685-01043',
        flightId: 'FL001',
        seatNumber: '15C',
        isVIP: false,
        checkInStatus: 'Checked In',
        boardingStatus: 'Waiting',
        specialRequests: ['Vegetarian Meal']
      },
      {
        id: 'P004',
        name: 'Rahul',
        email: 'rahul@email.com',
        phone: '+91-52355-01404',
        flightId: 'FL001',
        seatNumber: '2A',
        isVIP: true,
        checkInStatus: 'Checked In',
        boardingStatus: 'Waiting',
        specialRequests: ['Priority Boarding', 'Champagne Service']
      }
    ];

    passengers.forEach(passenger => {
      this.passengers.put(passenger.id, passenger);
      this.systemStats.totalPassengers++;
      
      // Add to appropriate boarding queue
      if (passenger.isVIP) {
        this.vipBoardingQueue.enqueue(passenger);
      } else {
        this.regularBoardingQueue.enqueue(passenger);
      }
    });

    console.log('👥 Demo passengers created and added to boarding queues');
  }

  /**
   * Setup demo luggage
   */
  setupDemoLuggage() {
    const luggageItems = [
      {
        id: 'L001',
        passengerId: 'P001',
        type: 'Checked',
        weight: 23.5,
        status: 'Loaded',
        description: 'Large suitcase',
        isVIP: false
      },
      {
        id: 'L002',
        passengerId: 'P001',
        type: 'Carry-on',
        weight: 8.2,
        status: 'With Passenger',
        description: 'Laptop bag',
        isVIP: false
      },
      {
        id: 'L003',
        passengerId: 'P002',
        type: 'Checked',
        weight: 20.1,
        status: 'Loaded',
        description: 'Designer suitcase',
        isVIP: true
      },
      {
        id: 'L004',
        passengerId: 'P003',
        type: 'Checked',
        weight: 25.0,
        status: 'Loaded',
        description: 'Sports equipment bag',
        isVIP: false
      },
      {
        id: 'L005',
        passengerId: 'P004',
        type: 'Checked',
        weight: 18.7,
        status: 'Loaded',
        description: 'Luxury travel set',
        isVIP: true
      },
      {
        id: 'L006',
        passengerId: 'P002',
        type: 'Checked',
        weight: 15.3,
        status: 'Missing',
        description: 'Small suitcase',
        isVIP: true
      }
    ];

    luggageItems.forEach(luggage => {
      this.luggage.put(luggage.id, luggage);
      this.systemStats.totalLuggage++;
      
      // Add to appropriate luggage stack or missed luggage list
      if (luggage.status === 'Missing') {
        this.missedLuggageList.insertAtTail({
          ...luggage,
          reportedAt: new Date().toISOString(),
          recoveryStatus: 'Investigating'
        });
        this.systemStats.missedLuggage++;
      } else if (luggage.status === 'Loaded') {
        if (luggage.isVIP) {
          this.vipLuggageStack.push(luggage);
        } else {
          this.regularLuggageStack.push(luggage);
        }
        this.systemStats.processedLuggage++;
      }
    });

    console.log('🧳 Demo luggage created and organized in stacks/lists');
  }

  /**
   * Load registered users from localStorage
   */
  loadRegisteredUsers() {
    try {
      const registeredUsers = localStorage.getItem('registeredUsers');
      if (registeredUsers) {
        const users = JSON.parse(registeredUsers);
        users.forEach((user) => {
          this.users.put(user.username, user);
          
          // Also create passenger record if it doesn't exist
          if (!this.passengers.has(user.id)) {
            const passengerData = {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone || '',
              flightId: '', // Will be assigned when booking
              seatNumber: '',
              isVIP: user.isVIP || false,
              checkInStatus: 'Not Checked In',
              boardingStatus: 'Waiting',
              specialRequests: user.isVIP ? ['Priority Boarding'] : [],
              registrationDate: user.registrationDate
            };
            
            this.passengers.put(user.id, passengerData);
            this.systemStats.totalPassengers++;
            
            // Create individual luggage stack for passenger
            this.passengerLuggageStacks.put(user.id, new Stack(`${user.name} Luggage`));
            
            // Initialize travel history
            this.travelHistory.put(user.id, []);
          }
        });
        console.log(`📥 Loaded ${users.length} registered users from localStorage`);
      }
    } catch (error) {
      console.error('❌ Error loading registered users:', error);
    }
  }

  /**
   * Save registered users to localStorage
   */
  saveRegisteredUsers() {
    try {
      const allUsers = this.users.values();
      const registeredUsers = allUsers.filter(user => user.role === 'passenger' && user.registrationDate);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      console.log(`💾 Saved ${registeredUsers.length} registered users to localStorage`);
    } catch (error) {
      console.error('❌ Error saving registered users:', error);
    }
  }

  /**
   * Register new passenger with custom credentials
   */
  registerPassenger(registrationData) {
    console.log(`📝 Registering new passenger: ${registrationData.username}`);
    
    // Check if username already exists
    if (this.users.has(registrationData.username)) {
      return { success: false, message: 'Username already exists' };
    }
    
    // Check if email already exists
    const existingUsers = this.users.values();
    const emailExists = existingUsers.some(user => user.email === registrationData.email);
    if (emailExists) {
      return { success: false, message: 'Email address already registered' };
    }
    
    // Generate unique passenger ID
    const passengerId = this.generateUniquePassengerId();
    
    // Create user account
    const userData = {
      id: passengerId,
      username: registrationData.username,
      password: registrationData.password, // In production, this should be hashed
      role: 'passenger',
      name: registrationData.name,
      email: registrationData.email,
      phone: registrationData.phone || '',
      isVIP: registrationData.isVIP || false,
      registrationDate: new Date().toISOString(),
      isRegistered: true
    };
    
    // Store user account
    this.users.put(registrationData.username, userData);
    
    // Create passenger record
    const passengerData = {
      id: passengerId,
      name: registrationData.name,
      email: registrationData.email,
      phone: registrationData.phone || '',
      flightId: '', // Will be assigned when booking
      seatNumber: '',
      isVIP: registrationData.isVIP || false,
      checkInStatus: 'Not Checked In',
      boardingStatus: 'Waiting',
      specialRequests: registrationData.isVIP ? ['Priority Boarding', 'VIP Lounge Access'] : [],
      registrationDate: new Date().toISOString()
    };
    
    this.passengers.put(passengerId, passengerData);
    this.systemStats.totalPassengers++;
    
    // Create individual luggage stack for passenger
    this.passengerLuggageStacks.put(passengerId, new Stack(`${registrationData.name} Luggage`));
    
    // Initialize travel history
    this.travelHistory.put(passengerId, []);
    
    // Save to localStorage
    this.saveRegisteredUsers();
    
    console.log(`✅ Passenger registered successfully: ${registrationData.username} (${passengerId})`);
    
    return { 
      success: true, 
      message: 'Registration successful! You can now log in.',
      user: userData,
      passenger: passengerData
    };
  }

  /**
   * Generate unique passenger ID
   */
  generateUniquePassengerId() {
    let id;
    let counter = 1;
    
    do {
      id = `P${String(counter).padStart(3, '0')}`;
      counter++;
    } while (this.passengers.has(id));
    
    return id;
  }

  // ================================
  // AUTHENTICATION METHODS
  // ================================

  /**
   * Authenticate user login
   */
  authenticateUser(userId, password) {
    console.log(`🔐 Authentication attempt for user: ${userId}`);
    
    const user = this.users.get(userId);
    if (!user) {
      console.log(`❌ User ${userId} not found`);
      return { success: false, message: 'User not found' };
    }

    if (user.password !== password) {
      console.log(`❌ Invalid password for user ${userId}`);
      return { success: false, message: 'Invalid password' };
    }

    console.log(`✅ User ${userId} authenticated successfully`);
    
    // Create session data
    const sessionData = {
      userId: user.username || user.id,
      loginTime: new Date().toISOString(),
      isVIP: user.isVIP || false
    };
    
    // Store session in localStorage
    localStorage.setItem('userSession', JSON.stringify(sessionData));
    
    return { 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVIP: user.isVIP || false,
        username: user.username
      }
    };
  }

  // ================================
  // PASSENGER MANAGEMENT METHODS
  // ================================

  /**
   * Get passenger information
   */
  getPassenger(passengerId) {
    return this.passengers.get(passengerId);
  }

  /**
   * Get all passengers
   */
  getAllPassengers() {
    return this.passengers.values();
  }

  /**
   * Add new passenger
   */
  addPassenger(passengerData) {
    console.log(`👤 Adding new passenger: ${passengerData.id}`);
    
    // Check if passenger already exists
    if (this.passengers.has(passengerData.id)) {
      return { success: false, message: 'Passenger ID already exists' };
    }
    
    // Validate required fields
    if (!passengerData.name || !passengerData.email || !passengerData.flightId) {
      return { success: false, message: 'Missing required passenger information' };
    }
    
    // Generate unique credentials with passenger ID as initial password
    const credentials = this.generatePassengerCredentials(passengerData.name, passengerData.id);
    
    // Set default values
    const newPassenger = {
      ...passengerData,
      checkInStatus: passengerData.checkInStatus || 'Not Checked In',
      boardingStatus: passengerData.boardingStatus || 'Waiting',
      specialRequests: passengerData.specialRequests || [],
      isVIP: passengerData.isVIP || false,
      registrationDate: new Date().toISOString(),
      credentials: credentials
    };
    
    this.passengers.put(passengerData.id, newPassenger);
    this.systemStats.totalPassengers++;
    
    // Add to appropriate boarding queue
    if (newPassenger.isVIP) {
      this.vipBoardingQueue.enqueue(newPassenger);
    } else {
      this.regularBoardingQueue.enqueue(newPassenger);
    }
    
    // Create individual luggage stack for passenger
    this.passengerLuggageStacks.put(newPassenger.id, new Stack(`${newPassenger.name} Luggage`));
    
    // Create user account with generated credentials (using both username and passenger ID)
    this.users.put(credentials.username, {
      id: newPassenger.id,
      username: credentials.username,
      password: credentials.password,
      role: 'passenger',
      name: newPassenger.name,
      email: newPassenger.email,
      isVIP: newPassenger.isVIP,
      credentialsGenerated: true,
      generatedAt: credentials.generatedAt
    });

    // Also allow login with passenger ID as username (with same password)
    this.users.put(newPassenger.id, {
      id: newPassenger.id,
      username: newPassenger.id,
      password: credentials.password,
      role: 'passenger',
      name: newPassenger.name,
      email: newPassenger.email,
      isVIP: newPassenger.isVIP,
      credentialsGenerated: true,
      generatedAt: credentials.generatedAt
    });
    
    // Initialize travel history
    this.travelHistory.put(newPassenger.id, []);
    
    this.systemStats.generatedCredentials++;
    
    return { 
      success: true, 
      message: 'Passenger added successfully',
      credentials: credentials,
      passenger: newPassenger
    };
  }

  /**
   * Generate unique login credentials for new passengers
   */
  generatePassengerCredentials(name, passengerId) {
    console.log(`🔐 Generating credentials for: ${name}`);
    
    // Create username from name (first name + last initial + random number)
    const nameParts = name.toLowerCase().split(' ');
    const firstName = nameParts[0] || 'passenger';
    const lastInitial = nameParts[1] ? nameParts[1].charAt(0) : '';
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    let username = `${firstName}${lastInitial}${randomNum}`;
    
    // Ensure username is unique
    let counter = 1;
    while (this.users.has(username)) {
      username = `${firstName}${lastInitial}${randomNum}${counter}`;
      counter++;
    }
    
    // Use passenger ID as initial password for simplicity, but also generate secure alternative
    const initialPassword = passengerId; // Simple: use passenger ID as password
    const securePassword = this.generateSecurePassword(); // Alternative secure password
    
    const credentials = {
      username: username,
      password: initialPassword, // Using passenger ID as initial password
      alternativePassword: securePassword, // Secure alternative
      passengerId: passengerId,
      generatedAt: new Date().toISOString(),
      loginMethods: [
        `Username: ${username}, Password: ${initialPassword}`,
        `Passenger ID: ${passengerId}, Password: ${initialPassword}`
      ]
    };
    
    console.log(`✅ Generated credentials - Username: ${username}, Password: ${initialPassword} (Passenger ID)`);
    console.log(`🔐 Alternative secure password: ${securePassword}`);
    return credentials;
  }

  /**
   * Generate secure password
   */
  generateSecurePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Update passenger information
   */
  updatePassenger(passengerId, updates) {
    console.log(`📝 Updating passenger: ${passengerId}`);
    
    const passenger = this.passengers.get(passengerId);
    if (!passenger) {
      return { success: false, message: 'Passenger not found' };
    }
    
    const updatedPassenger = { ...passenger, ...updates };
    this.passengers.put(passengerId, updatedPassenger);
    
    return { success: true, message: 'Passenger updated successfully' };
  }

  // ================================
  // BOARDING QUEUE METHODS (FIFO)
  // ================================

  /**
   * Get boarding queues status
   */
  getBoardingQueues() {
    return {
      vip: this.vipBoardingQueue.getAll(),
      regular: this.regularBoardingQueue.getAll()
    };
  }

  /**
   * Process next passenger for boarding (VIP priority)
   */
  processNextBoarding() {
    console.log('🚶 Processing next passenger for boarding...');
    
    // VIP passengers have priority
    if (!this.vipBoardingQueue.isEmpty()) {
      const passenger = this.vipBoardingQueue.dequeue();
      this.updatePassengerBoardingStatus(passenger.id, 'Boarded');
      this.systemStats.boardedPassengers++;
      return { success: true, passenger, queue: 'VIP' };
    }
    
    // Process regular passengers if no VIP waiting
    if (!this.regularBoardingQueue.isEmpty()) {
      const passenger = this.regularBoardingQueue.dequeue();
      this.updatePassengerBoardingStatus(passenger.id, 'Boarded');
      this.systemStats.boardedPassengers++;
      return { success: true, passenger, queue: 'Regular' };
    }
    
    return { success: false, message: 'No passengers in boarding queue' };
  }

  /**
   * Update passenger boarding status
   */
  updatePassengerBoardingStatus(passengerId, status) {
    const passenger = this.passengers.get(passengerId);
    if (passenger) {
      passenger.boardingStatus = status;
      this.passengers.put(passengerId, passenger);
    }
  }

  // ================================
  // LUGGAGE MANAGEMENT METHODS (LIFO)
  // ================================

  /**
   * Get luggage stacks status
   */
  getLuggageStacks() {
    return {
      vip: this.vipLuggageStack.getAll(),
      regular: this.regularLuggageStack.getAll()
    };
  }

  /**
   * Add luggage to appropriate stack
   */
  addLuggage(luggageData) {
    console.log(`🧳 Adding luggage: ${luggageData.id}`);
    
    // Validate passenger exists
    const passenger = this.passengers.get(luggageData.passengerId);
    if (!passenger) {
      return { success: false, message: 'Passenger not found' };
    }
    
    // Add timestamp and tracking info
    const enhancedLuggageData = {
      ...luggageData,
      addedAt: new Date().toISOString(),
      trackingNumber: this.generateTrackingNumber(),
      status: luggageData.status || 'Checked In'
    };
    
    this.luggage.put(enhancedLuggageData.id, enhancedLuggageData);
    this.systemStats.totalLuggage++;
    
    // Add to passenger's individual luggage stack
    const passengerStack = this.passengerLuggageStacks.get(luggageData.passengerId);
    if (passengerStack) {
      passengerStack.push(enhancedLuggageData);
    }
    
    // Add to appropriate stack based on VIP status
    if (passenger.isVIP) {
      this.vipLuggageStack.push(enhancedLuggageData);
    } else {
      this.regularLuggageStack.push(enhancedLuggageData);
    }
    
    this.systemStats.processedLuggage++;
    return { 
      success: true, 
      message: 'Luggage added successfully',
      luggage: enhancedLuggageData
    };
  }

  /**
   * Generate unique tracking number for luggage
   */
  generateTrackingNumber() {
    const prefix = 'TRK';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Unload luggage from stack (LIFO - last loaded, first unloaded)
   */
  unloadLuggage(isVIP = false) {
    console.log(`📤 Unloading luggage from ${isVIP ? 'VIP' : 'Regular'} stack...`);
    
    const stack = isVIP ? this.vipLuggageStack : this.regularLuggageStack;
    const luggage = stack.pop();
    
    if (luggage) {
      // Update luggage status
      luggage.status = 'Unloaded';
      this.luggage.put(luggage.id, luggage);
      return { success: true, luggage };
    }
    
    return { success: false, message: 'No luggage to unload' };
  }

  /**
   * Get passenger luggage
   */
  getPassengerLuggage(passengerId) {
    const allLuggage = this.luggage.values();
    return allLuggage.filter(luggage => luggage.passengerId === passengerId);
  }

  /**
   * Add luggage to passenger's personal stack
   */
  addLuggageToPassenger(passengerId, luggageData) {
    console.log(`🧳 Adding luggage to passenger ${passengerId}'s personal stack`);
    
    // Validate passenger exists
    const passenger = this.passengers.get(passengerId);
    if (!passenger) {
      return { success: false, message: 'Passenger not found' };
    }
    
    // Get passenger's individual luggage stack
    const passengerStack = this.passengerLuggageStacks.get(passengerId);
    if (!passengerStack) {
      return { success: false, message: 'Passenger luggage stack not found' };
    }
    
    // Create enhanced luggage data
    const enhancedLuggageData = {
      ...luggageData,
      passengerId: passengerId,
      addedAt: new Date().toISOString(),
      trackingNumber: this.generateTrackingNumber(),
      status: 'Checked In',
      isVIP: passenger.isVIP
    };
    
    // Add to passenger's personal stack (LIFO)
    passengerStack.push(enhancedLuggageData);
    
    // Store in main luggage HashMap
    this.luggage.put(enhancedLuggageData.id, enhancedLuggageData);
    this.systemStats.totalLuggage++;
    
    // Also add to appropriate system-wide stack
    if (passenger.isVIP) {
      this.vipLuggageStack.push(enhancedLuggageData);
    } else {
      this.regularLuggageStack.push(enhancedLuggageData);
    }
    
    this.systemStats.processedLuggage++;
    
    return {
      success: true,
      message: 'Luggage added to personal stack successfully',
      luggage: enhancedLuggageData
    };
  }

  /**
   * Remove luggage from passenger's personal stack (LIFO)
   */
  removePassengerLuggage(passengerId) {
    console.log(`📤 Removing luggage from passenger ${passengerId}'s personal stack (LIFO)`);
    
    // Get passenger's individual luggage stack
    const passengerStack = this.passengerLuggageStacks.get(passengerId);
    if (!passengerStack || passengerStack.isEmpty()) {
      return { success: false, message: 'No luggage in passenger stack' };
    }
    
    // Pop from personal stack (LIFO - Last In, First Out)
    const luggage = passengerStack.pop();
    
    if (luggage) {
      // Update luggage status
      luggage.status = 'Retrieved';
      luggage.retrievedAt = new Date().toISOString();
      this.luggage.put(luggage.id, luggage);
      
      return { 
        success: true, 
        message: 'Luggage retrieved from personal stack',
        luggage: luggage 
      };
    }
    
    return { success: false, message: 'Failed to retrieve luggage' };
  }

  /**
   * Get passenger's personal luggage stack
   */
  getPassengerLuggageStack(passengerId) {
    const passengerStack = this.passengerLuggageStacks.get(passengerId);
    if (passengerStack) {
      return passengerStack.getAll();
    }
    return [];
  }

  /**
   * Search passenger by ID (for dashboard functionality)
   */
  searchPassengerById(passengerId) {
    console.log(`🔍 Searching for passenger: ${passengerId}`);
    
    const passenger = this.passengers.get(passengerId);
    if (passenger) {
      // Get additional information
      const flight = this.flights.get(passenger.flightId);
      const luggage = this.getPassengerLuggageStack(passengerId);
      const travelHistory = this.travelHistory.get(passengerId) || [];
      
      return {
        success: true,
        passenger: passenger,
        flight: flight,
        luggage: luggage,
        travelHistory: travelHistory
      };
    }
    
    return { success: false, message: 'Passenger not found' };
  }

  /**
   * Generate boarding pass for passenger
   */
  getBoardingPass(passengerId) {
    const passenger = this.passengers.get(passengerId);
    const flight = passenger ? this.flights.get(passenger.flightId) : null;
    
    if (passenger && flight) {
      return {
        passengerName: passenger.name,
        passengerId: passenger.id,
        flightNumber: flight.flightNumber,
        seatNumber: passenger.seatNumber,
        gate: flight.gate,
        boardingTime: new Date(new Date(flight.departureTime).getTime() - 30 * 60000).toISOString(), // 30 min before departure
        departureTime: flight.departureTime,
        destination: flight.destination,
        isVIP: passenger.isVIP,
        generatedAt: new Date().toISOString()
      };
    }
    
    return null;
  }

  /**
   * Get passenger travel history
   */
  getPassengerTravelHistory(passengerId) {
    return this.travelHistory.get(passengerId) || [];
  }
  // ================================
  // MISSED LUGGAGE METHODS (LINKED LIST)
  // ================================

  /**
   * Get all missed luggage
   */
  getMissedLuggage() {
    return this.missedLuggageList.getAll();
  }

  /**
   * Report missed luggage
   */
  reportMissedLuggage(luggageData) {
    console.log(`🔍 Reporting missed luggage: ${luggageData.id}`);
    
    const missedLuggageItem = {
      ...luggageData,
      status: 'Missing',
      reportedAt: new Date().toISOString(),
      recoveryStatus: 'Investigating'
    };
    
    this.missedLuggageList.insertAtTail(missedLuggageItem);
    this.luggage.put(luggageData.id, missedLuggageItem);
    this.systemStats.missedLuggage++;
    
    return { success: true, message: 'Missed luggage reported successfully' };
  }

  /**
   * Resolve missed luggage
   */
  resolveMissedLuggage(luggageId) {
    console.log(`✅ Resolving missed luggage: ${luggageId}`);
    
    const missedItems = this.missedLuggageList.getAll();
    const targetItem = missedItems.find(item => item.id === luggageId);
    
    if (targetItem) {
      // Remove from missed luggage list
      this.missedLuggageList.delete(targetItem);
      
      // Update luggage status
      targetItem.status = 'Found';
      targetItem.recoveryStatus = 'Resolved';
      targetItem.resolvedAt = new Date().toISOString();
      this.luggage.put(luggageId, targetItem);
      
      this.systemStats.missedLuggage--;
      return { success: true, message: 'Missed luggage resolved successfully' };
    }
    
    return { success: false, message: 'Missed luggage item not found' };
  }

  // ================================
  // FLIGHT MANAGEMENT METHODS
  // ================================

  /**
   * Get all flights
   */
  getAllFlights() {
    return this.flights.values();
  }

  /**
   * Get flight information
   */
  getFlight(flightId) {
    return this.flights.get(flightId);
  }

  /**
   * Add new flight
   */
  addFlight(flightData) {
    console.log(`✈️ Adding new flight: ${flightData.id}`);
    
    this.flights.put(flightData.id, flightData);
    this.systemStats.totalFlights++;
    
    return { success: true, message: 'Flight added successfully' };
  }

  /**
   * Update flight information
   */
  updateFlight(flightId, updates) {
    console.log(`📝 Updating flight: ${flightId}`);
    
    const flight = this.flights.get(flightId);
    if (!flight) {
      return { success: false, message: 'Flight not found' };
    }
    
    const updatedFlight = { ...flight, ...updates };
    this.flights.put(flightId, updatedFlight);
    
    return { success: true, message: 'Flight updated successfully' };
  }

  /**
   * Get user session from localStorage
   */
  getUserSession() {
    try {
      const session = localStorage.getItem('userSession');
      if (session) {
        const sessionData = JSON.parse(session);
        const user = this.users.get(sessionData.userId);
        if (user) {
          return {
            success: true,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              isVIP: user.isVIP || false,
              username: user.username
            }
          };
        }
      }
    } catch (error) {
      console.error('❌ Error retrieving user session:', error);
    }
    return { success: false, message: 'No valid session found' };
  }

  /**
   * Clear user session
   */
  clearUserSession() {
    localStorage.removeItem('userSession');
    console.log('🔓 User session cleared');
  }

  // ================================
  // SYSTEM STATISTICS AND REPORTING
  // ================================

  /**
   * Get system statistics
   */
  getSystemStats() {
    return {
      ...this.systemStats,
      dataStructureStats: {
        passengers: this.passengers.getSize(),
        flights: this.flights.getSize(),
        luggage: this.luggage.getSize(),
        passengerLuggageStacks: this.passengerLuggageStacks.getSize(),
        vipBoardingQueue: this.vipBoardingQueue.size(),
        regularBoardingQueue: this.regularBoardingQueue.size(),
        vipLuggageStack: this.vipLuggageStack.size(),
        regularLuggageStack: this.regularLuggageStack.size(),
        missedLuggageList: this.missedLuggageList.getSize(),
        travelHistoryRecords: this.travelHistory.getSize()
      }
    };
  }

  /**
   * Display detailed system information (for debugging)
   */
  displaySystemInfo() {
    console.log('\n🛫 ===== FLIGHT MANAGEMENT SYSTEM STATUS =====');
    console.log('📊 System Statistics:', this.systemStats);
    
    console.log('\n📚 Data Structure Status:');
    console.log(`  VIP Luggage Stack: ${this.vipLuggageStack.size()} items`);
    console.log(`  Regular Luggage Stack: ${this.regularLuggageStack.size()} items`);
    console.log(`  VIP Boarding Queue: ${this.vipBoardingQueue.size()} passengers`);
    console.log(`  Regular Boarding Queue: ${this.regularBoardingQueue.size()} passengers`);
    console.log(`  Missed Luggage List: ${this.missedLuggageList.getSize()} items`);
    
    // Display HashMap statistics
    this.passengers.displayStats();
    this.flights.displayStats();
    this.luggage.displayStats();
    
    console.log('===============================================\n');
  }

  /**
   * Reset system to initial state
   */
  resetSystem() {
    console.log('🔄 Resetting Flight Management System...');
    
    // Clear all data structures
    this.regularLuggageStack.clear();
    this.vipLuggageStack.clear();
    this.regularBoardingQueue.clear();
    this.vipBoardingQueue.clear();
    this.missedLuggageList.clear();
    this.passengers.clear();
    this.flights.clear();
    this.luggage.clear();
    
    // Reset statistics
    this.systemStats = {
      totalPassengers: 0,
      totalFlights: 0,
      totalLuggage: 0,
      boardedPassengers: 0,
      processedLuggage: 0,
      missedLuggage: 0
    };
    
    // Reinitialize with demo data
    this.initializeSystem();
    
    console.log('✅ System reset complete!');
  }
}

// Export singleton instance
export const flightSystem = new FlightManagementSystem();