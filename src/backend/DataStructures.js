/**
 * FLIGHT MANAGEMENT SYSTEM - DATA STRUCTURES IMPLEMENTATION
 * 
 * This file contains all core data structure implementations used in the flight management system.
 * Each data structure is implemented from scratch to demonstrate fundamental computer science concepts.
 */

// ================================
// STACK IMPLEMENTATION (LIFO - Last In, First Out)
// ================================
/**
 * Stack Data Structure for Luggage Management
 * Used for handling luggage loading/unloading operations
 * LIFO principle: Last luggage loaded is first to be unloaded
 */
export class Stack {
  constructor(name = "Stack") {
    this.items = [];
    this.name = name;
    console.log(`📚 [${this.name}] Stack initialized`);
  }

  /**
   * Push operation - Add item to top of stack
   * Time Complexity: O(1)
   */
  push(item) {
    this.items.push(item);
    console.log(`📚 [${this.name}] PUSH: Added item to stack. Stack size: ${this.items.length}`);
    console.log(`📚 [${this.name}] Current stack:`, this.items.map(i => i.id || i));
    return this.items.length;
  }

  /**
   * Pop operation - Remove and return top item from stack
   * Time Complexity: O(1)
   */
  pop() {
    if (this.isEmpty()) {
      console.log(`📚 [${this.name}] POP: Stack is empty, cannot pop`);
      return null;
    }
    const item = this.items.pop();
    console.log(`📚 [${this.name}] POP: Removed item from stack. Stack size: ${this.items.length}`);
    console.log(`📚 [${this.name}] Popped item:`, item.id || item);
    return item;
  }

  /**
   * Peek operation - View top item without removing it
   * Time Complexity: O(1)
   */
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  /**
   * Check if stack is empty
   * Time Complexity: O(1)
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Get stack size
   * Time Complexity: O(1)
   */
  size() {
    return this.items.length;
  }

  /**
   * Get all items (for display purposes)
   */
  getAll() {
    return [...this.items];
  }

  /**
   * Clear all items from stack
   */
  clear() {
    this.items = [];
    console.log(`📚 [${this.name}] Stack cleared`);
  }

  /**
   * Find item in stack by ID (for tracking purposes)
   * Time Complexity: O(n)
   */
  findById(id) {
    return this.items.find(item => item.id === id);
  }

  /**
   * Remove specific item from stack (maintaining LIFO for others)
   * Time Complexity: O(n)
   */
  removeById(id) {
    const index = this.items.findIndex(item => item.id === id);
    if (index !== -1) {
      const removedItem = this.items.splice(index, 1)[0];
      console.log(`📚 [${this.name}] REMOVE: Removed item ${id} from stack. Stack size: ${this.items.length}`);
      return removedItem;
    }
    return null;
  }
}

// ================================
// QUEUE IMPLEMENTATION (FIFO - First In, First Out)
// ================================
/**
 * Queue Data Structure for Passenger Boarding
 * Used for managing passenger boarding order
 * FIFO principle: First passenger in line is first to board
 */
export class Queue {
  constructor(name = "Queue") {
    this.items = [];
    this.name = name;
    console.log(`🚶 [${this.name}] Queue initialized`);
  }

  /**
   * Enqueue operation - Add item to rear of queue
   * Time Complexity: O(1)
   */
  enqueue(item) {
    this.items.push(item);
    console.log(`🚶 [${this.name}] ENQUEUE: Added passenger to queue. Queue size: ${this.items.length}`);
    console.log(`🚶 [${this.name}] Current queue:`, this.items.map(i => i.id || i.name || i));
    return this.items.length;
  }

  /**
   * Dequeue operation - Remove and return front item from queue
   * Time Complexity: O(n) due to array shift, but demonstrates FIFO concept
   */
  dequeue() {
    if (this.isEmpty()) {
      console.log(`🚶 [${this.name}] DEQUEUE: Queue is empty, cannot dequeue`);
      return null;
    }
    const item = this.items.shift();
    console.log(`🚶 [${this.name}] DEQUEUE: Removed passenger from queue. Queue size: ${this.items.length}`);
    console.log(`🚶 [${this.name}] Dequeued passenger:`, item.id || item.name || item);
    return item;
  }

  /**
   * Front operation - View front item without removing it
   * Time Complexity: O(1)
   */
  front() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[0];
  }

  /**
   * Check if queue is empty
   * Time Complexity: O(1)
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Get queue size
   * Time Complexity: O(1)
   */
  size() {
    return this.items.length;
  }

  /**
   * Get all items (for display purposes)
   */
  getAll() {
    return [...this.items];
  }

  /**
   * Clear all items from queue
   */
  clear() {
    this.items = [];
    console.log(`🚶 [${this.name}] Queue cleared`);
  }
}

// ================================
// LINKED LIST IMPLEMENTATION
// ================================
/**
 * Node class for Linked List
 * Each node contains data and a reference to the next node
 */
class ListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

/**
 * Linked List Data Structure for Missed Luggage Tracking
 * Used for tracking and managing missed luggage items
 * Allows dynamic insertion and deletion of luggage records
 */
export class LinkedList {
  constructor(name = "LinkedList") {
    this.head = null;
    this.size = 0;
    this.name = name;
    console.log(`🔗 [${this.name}] Linked List initialized`);
  }

  /**
   * Insert at beginning of linked list
   * Time Complexity: O(1)
   */
  insertAtHead(data) {
    const newNode = new ListNode(data);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
    console.log(`🔗 [${this.name}] INSERT_HEAD: Added item to head. List size: ${this.size}`);
    console.log(`🔗 [${this.name}] New head item:`, data.id || data);
    return true;
  }

  /**
   * Insert at end of linked list
   * Time Complexity: O(n)
   */
  insertAtTail(data) {
    const newNode = new ListNode(data);
    
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    
    this.size++;
    console.log(`🔗 [${this.name}] INSERT_TAIL: Added item to tail. List size: ${this.size}`);
    console.log(`🔗 [${this.name}] New tail item:`, data.id || data);
    return true;
  }

  /**
   * Delete node with specific data
   * Time Complexity: O(n)
   */
  delete(targetData) {
    if (!this.head) {
      console.log(`🔗 [${this.name}] DELETE: List is empty, cannot delete`);
      return false;
    }

    // If head node contains the target data
    if (this.head.data.id === targetData.id || this.head.data === targetData) {
      this.head = this.head.next;
      this.size--;
      console.log(`🔗 [${this.name}] DELETE: Removed head item. List size: ${this.size}`);
      return true;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.data.id === targetData.id || current.next.data === targetData) {
        current.next = current.next.next;
        this.size--;
        console.log(`🔗 [${this.name}] DELETE: Removed item from list. List size: ${this.size}`);
        return true;
      }
      current = current.next;
    }

    console.log(`🔗 [${this.name}] DELETE: Item not found in list`);
    return false;
  }

  /**
   * Search for node with specific data
   * Time Complexity: O(n)
   */
  search(targetData) {
    let current = this.head;
    let position = 0;

    while (current) {
      if (current.data.id === targetData.id || current.data === targetData) {
        console.log(`🔗 [${this.name}] SEARCH: Found item at position ${position}`);
        return { node: current, position };
      }
      current = current.next;
      position++;
    }

    console.log(`🔗 [${this.name}] SEARCH: Item not found in list`);
    return null;
  }

  /**
   * Get all items as array (for display purposes)
   * Time Complexity: O(n)
   */
  getAll() {
    const items = [];
    let current = this.head;
    
    while (current) {
      items.push(current.data);
      current = current.next;
    }
    
    return items;
  }

  /**
   * Get size of linked list
   * Time Complexity: O(1)
   */
  getSize() {
    return this.size;
  }

  /**
   * Check if linked list is empty
   * Time Complexity: O(1)
   */
  isEmpty() {
    return this.head === null;
  }

  /**
   * Clear all items from linked list
   */
  clear() {
    this.head = null;
    this.size = 0;
    console.log(`🔗 [${this.name}] Linked List cleared`);
  }

  /**
   * Display linked list (for debugging)
   */
  display() {
    if (!this.head) {
      console.log(`🔗 [${this.name}] List is empty`);
      return;
    }

    const items = [];
    let current = this.head;
    while (current) {
      items.push(current.data.id || current.data);
      current = current.next;
    }
    console.log(`🔗 [${this.name}] List contents:`, items.join(' -> '));
  }
}

// ================================
// HASHMAP IMPLEMENTATION
// ================================
/**
 * HashMap Data Structure for Fast Data Retrieval
 * Used for storing and retrieving passenger information, luggage tracking, and flight data
 * Provides O(1) average time complexity for insertions, deletions, and lookups
 */
export class HashMap {
  constructor(initialCapacity = 16, name = "HashMap") {
    this.capacity = initialCapacity;
    this.size = 0;
    this.buckets = new Array(this.capacity);
    this.name = name;
    
    // Initialize buckets as empty arrays for chaining collision resolution
    for (let i = 0; i < this.capacity; i++) {
      this.buckets[i] = [];
    }
    
    console.log(`🗂️ [${this.name}] HashMap initialized with capacity: ${this.capacity}`);
  }

  /**
   * Hash function - Convert key to array index
   * Uses simple string hashing algorithm
   * Time Complexity: O(k) where k is key length
   */
  hash(key) {
    let hash = 0;
    const keyStr = String(key);
    
    for (let i = 0; i < keyStr.length; i++) {
      hash = (hash + keyStr.charCodeAt(i) * i) % this.capacity;
    }
    
    return Math.abs(hash);
  }

  /**
   * Put operation - Insert or update key-value pair
   * Time Complexity: O(1) average, O(n) worst case
   */
  put(key, value) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    // Check if key already exists
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        bucket[i].value = value;
        console.log(`🗂️ [${this.name}] PUT: Updated existing key "${key}" at bucket ${index}`);
        return;
      }
    }
    
    // Add new key-value pair
    bucket.push({ key, value });
    this.size++;
    console.log(`🗂️ [${this.name}] PUT: Added new key "${key}" at bucket ${index}. HashMap size: ${this.size}`);
    
    // Check if resize is needed (load factor > 0.75)
    if (this.size > this.capacity * 0.75) {
      this.resize();
    }
  }

  /**
   * Get operation - Retrieve value by key
   * Time Complexity: O(1) average, O(n) worst case
   */
  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        console.log(`🗂️ [${this.name}] GET: Found key "${key}" at bucket ${index}`);
        return bucket[i].value;
      }
    }
    
    console.log(`🗂️ [${this.name}] GET: Key "${key}" not found`);
    return null;
  }

  /**
   * Delete operation - Remove key-value pair
   * Time Complexity: O(1) average, O(n) worst case
   */
  delete(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        bucket.splice(i, 1);
        this.size--;
        console.log(`🗂️ [${this.name}] DELETE: Removed key "${key}" from bucket ${index}. HashMap size: ${this.size}`);
        return true;
      }
    }
    
    console.log(`🗂️ [${this.name}] DELETE: Key "${key}" not found`);
    return false;
  }

  /**
   * Has operation - Check if key exists
   * Time Complexity: O(1) average, O(n) worst case
   */
  has(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Get all keys
   * Time Complexity: O(n)
   */
  keys() {
    const keys = [];
    for (let i = 0; i < this.capacity; i++) {
      for (let j = 0; j < this.buckets[i].length; j++) {
        keys.push(this.buckets[i][j].key);
      }
    }
    return keys;
  }

  /**
   * Get all values
   * Time Complexity: O(n)
   */
  values() {
    const values = [];
    for (let i = 0; i < this.capacity; i++) {
      for (let j = 0; j < this.buckets[i].length; j++) {
        values.push(this.buckets[i][j].value);
      }
    }
    return values;
  }

  /**
   * Get all key-value pairs
   * Time Complexity: O(n)
   */
  entries() {
    const entries = [];
    for (let i = 0; i < this.capacity; i++) {
      for (let j = 0; j < this.buckets[i].length; j++) {
        const item = this.buckets[i][j];
        entries.push([item.key, item.value]);
      }
    }
    return entries;
  }

  /**
   * Resize hashmap when load factor exceeds threshold
   * Time Complexity: O(n)
   */
  resize() {
    console.log(`🗂️ [${this.name}] RESIZE: Resizing from ${this.capacity} to ${this.capacity * 2}`);
    
    const oldBuckets = this.buckets;
    this.capacity *= 2;
    this.size = 0;
    this.buckets = new Array(this.capacity);
    
    // Initialize new buckets
    for (let i = 0; i < this.capacity; i++) {
      this.buckets[i] = [];
    }
    
    // Rehash all existing items
    for (let i = 0; i < oldBuckets.length; i++) {
      for (let j = 0; j < oldBuckets[i].length; j++) {
        const item = oldBuckets[i][j];
        this.put(item.key, item.value);
      }
    }
  }

  /**
   * Get current size
   * Time Complexity: O(1)
   */
  getSize() {
    return this.size;
  }

  /**
   * Check if hashmap is empty
   * Time Complexity: O(1)
   */
  isEmpty() {
    return this.size === 0;
  }

  /**
   * Clear all items from hashmap
   */
  clear() {
    this.buckets = new Array(this.capacity);
    for (let i = 0; i < this.capacity; i++) {
      this.buckets[i] = [];
    }
    this.size = 0;
    console.log(`🗂️ [${this.name}] HashMap cleared`);
  }

  /**
   * Display hashmap statistics (for debugging)
   */
  displayStats() {
    console.log(`🗂️ [${this.name}] HashMap Statistics:`);
    console.log(`  - Size: ${this.size}`);
    console.log(`  - Capacity: ${this.capacity}`);
    console.log(`  - Load Factor: ${(this.size / this.capacity).toFixed(2)}`);
    
    let usedBuckets = 0;
    let maxChainLength = 0;
    
    for (let i = 0; i < this.capacity; i++) {
      if (this.buckets[i].length > 0) {
        usedBuckets++;
        maxChainLength = Math.max(maxChainLength, this.buckets[i].length);
      }
    }
    
    console.log(`  - Used Buckets: ${usedBuckets}/${this.capacity}`);
    console.log(`  - Max Chain Length: ${maxChainLength}`);
  }
}