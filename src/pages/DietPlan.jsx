import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaBell, FaWater, FaUtensils, FaClock, FaCheckCircle, FaPills } from 'react-icons/fa';

const DietPlan = () => {
  const [dietPlans, setDietPlans] = useState([]);
  const [medicineAlerts, setMedicineAlerts] = useState([]);
  const [waterAlarms, setWaterAlarms] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    time: '',
    hour: '12',
    minute: '00',
    period: 'AM',
    calories: '',
    description: '',
    completed: false
  });
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    time: '',
    hour: '12',
    minute: '00',
    period: 'AM',
    dosage: '',
    instructions: '',
    completed: false
  });
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal, setWaterGoal] = useState(2000);
  const [nextWaterAlarm, setNextWaterAlarm] = useState('');

  // Predefined meal options
  const mealOptions = [
    'Breakfast',
    'Morning Snack',
    'Lunch',
    'Afternoon Snack',
    'Dinner',
    'Evening Snack',
    'Pre-Workout',
    'Post-Workout',
    'Protein Shake',
    'Fruit Break',
    'Vegetable Snack',
    'Healthy Dessert'
  ];

  // Load data from localStorage
  useEffect(() => {
    const savedDietPlans = localStorage.getItem('dietPlans');
    const savedMedicineAlerts = localStorage.getItem('medicineAlerts');
    const savedWaterIntake = localStorage.getItem('waterIntake');
    const savedWaterAlarms = localStorage.getItem('waterAlarms');

    if (savedDietPlans) setDietPlans(JSON.parse(savedDietPlans));
    if (savedMedicineAlerts) setMedicineAlerts(JSON.parse(savedMedicineAlerts));
    if (savedWaterIntake) setWaterIntake(parseInt(savedWaterIntake));
    if (savedWaterAlarms) setWaterAlarms(JSON.parse(savedWaterAlarms));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('dietPlans', JSON.stringify(dietPlans));
  }, [dietPlans]);

  useEffect(() => {
    localStorage.setItem('medicineAlerts', JSON.stringify(medicineAlerts));
  }, [medicineAlerts]);

  useEffect(() => {
    localStorage.setItem('waterIntake', waterIntake.toString());
  }, [waterIntake]);

  // Water reminder alarm
  useEffect(() => {
    const setNextAlarmTime = () => {
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      setNextWaterAlarm(nextHour.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    };
    setNextAlarmTime();
    const interval = setInterval(setNextAlarmTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Check for meal and medicine alarms
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime12hr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });

      // Check meal alarms
      dietPlans.forEach(meal => {
        const mealTime = `${meal.hour.padStart(2, '0')}:${meal.minute} ${meal.period}`;
        if (mealTime === currentTime12hr && !meal.alarmTriggered) {
          triggerMealAlarm(meal);
        }
      });

      // Check medicine alarms
      medicineAlerts.forEach(medicine => {
        const medicineTime = `${medicine.hour.padStart(2, '0')}:${medicine.minute} ${medicine.period}`;
        if (medicineTime === currentTime12hr && !medicine.alarmTriggered) {
          triggerMedicineAlarm(medicine);
        }
      });
    };

    const interval = setInterval(checkAlarms, 60000);
    return () => clearInterval(interval);
  }, [dietPlans, medicineAlerts]);

  const triggerMealAlarm = (meal) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`🍽️ Time to eat!`, {
        body: `It's time for your ${meal.name}`,
        icon: '/favicon.ico'
      });
    }
    setDietPlans(prev => 
      prev.map(m => 
        m.id === meal.id ? { ...m, alarmTriggered: true } : m
      )
    );
  };

  const triggerMedicineAlarm = (medicine) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`💊 Medicine Time!`, {
        body: `Time to take ${medicine.name} - ${medicine.dosage}`,
        icon: '/favicon.ico'
      });
    }
    setMedicineAlerts(prev => 
      prev.map(m => 
        m.id === medicine.id ? { ...m, alarmTriggered: true } : m
      )
    );
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  // Time options
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const addMeal = () => {
    if (newMeal.name && newMeal.hour && newMeal.minute) {
      const meal = {
        id: Date.now(),
        ...newMeal,
        time: `${newMeal.hour.padStart(2, '0')}:${newMeal.minute} ${newMeal.period}`,
        alarmTriggered: false,
        completed: false
      };
      setDietPlans(prev => [...prev, meal].sort((a, b) => {
        const timeA = convertTo24Hour(a.time);
        const timeB = convertTo24Hour(b.time);
        return timeA.localeCompare(timeB);
      }));
      setNewMeal({ 
        name: '', 
        hour: '12', 
        minute: '00', 
        period: 'AM', 
        calories: '', 
        description: '', 
        completed: false 
      });
      setShowAddForm(false);
    }
  };

  const addMedicine = () => {
    if (newMedicine.name && newMedicine.hour && newMedicine.minute) {
      const medicine = {
        id: Date.now(),
        ...newMedicine,
        time: `${newMedicine.hour.padStart(2, '0')}:${newMedicine.minute} ${newMedicine.period}`,
        alarmTriggered: false,
        completed: false
      };
      setMedicineAlerts(prev => [...prev, medicine].sort((a, b) => {
        const timeA = convertTo24Hour(a.time);
        const timeB = convertTo24Hour(b.time);
        return timeA.localeCompare(timeB);
      }));
      setNewMedicine({ 
        name: '', 
        hour: '12', 
        minute: '00', 
        period: 'AM', 
        dosage: '', 
        instructions: '', 
        completed: false 
      });
      setShowMedicineForm(false);
    }
  };

  const convertTo24Hour = (time12h) => {
    const [time, period] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (period === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    }
    if (period === 'AM' && hours === '12') {
      hours = '00';
    }
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const deleteMeal = (id) => {
    setDietPlans(prev => prev.filter(meal => meal.id !== id));
  };

  const deleteMedicine = (id) => {
    setMedicineAlerts(prev => prev.filter(medicine => medicine.id !== id));
  };

  const toggleMealCompletion = (id) => {
    setDietPlans(prev => 
      prev.map(meal => 
        meal.id === id ? { ...meal, completed: !meal.completed } : meal
      )
    );
  };

  const toggleMedicineCompletion = (id) => {
    setMedicineAlerts(prev => 
      prev.map(medicine => 
        medicine.id === id ? { ...medicine, completed: !medicine.completed } : medicine
      )
    );
  };

  const addWater = (amount) => {
    setWaterIntake(prev => {
      const newAmount = prev + amount;
      if (newAmount >= waterGoal) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('🎉 Water Goal Achieved!', {
            body: `You've reached your daily water goal of ${waterGoal}ml!`,
            icon: '/favicon.ico'
          });
        }
      }
      return newAmount;
    });
  };

  const resetWater = () => {
    setWaterIntake(0);
  };

  const setWaterReminder = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          const alarm = {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            active: true
          };
          setWaterAlarms(prev => [...prev, alarm]);
        }
      });
    }
  };

  const calculateWaterPercentage = () => {
    return Math.min((waterIntake / waterGoal) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Health Manager
          </h1>
          <p className="text-xl text-gray-600">Track your diet, medicine, and hydration</p>
        </div>

        {/* Water Intake Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 border-2 border-blue-400">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FaWater className="text-3xl text-blue-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Water Intake</h2>
                <p className="text-gray-600">Stay hydrated throughout the day</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {waterIntake}ml / {waterGoal}ml
              </div>
              <div className="text-sm text-gray-500">
                Next reminder: {nextWaterAlarm}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Water Progress</span>
              <span>{calculateWaterPercentage().toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${calculateWaterPercentage()}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button 
              onClick={() => addWater(250)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              +250ml
            </button>
            <button 
              onClick={() => addWater(500)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              +500ml
            </button>
            <button 
              onClick={setWaterReminder}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <FaBell />
              <span>Set Reminder</span>
            </button>
            <button 
              onClick={() => setWaterGoal(prev => prev + 500)}
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Goal +500ml
            </button>
            <button 
              onClick={resetWater}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Diet Plan Controls */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-yellow-400">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FaUtensils className="text-2xl text-yellow-500" />
                <h3 className="text-2xl font-bold text-gray-800">Diet Plan</h3>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                {dietPlans.length} meals
              </span>
            </div>
            <p className="text-gray-600 mb-4">Manage your daily meals and nutrition</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add Meal</span>
              </button>
              <button
                onClick={requestNotificationPermission}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <FaBell />
                <span>Enable Alerts</span>
              </button>
            </div>
          </div>

          {/* Medicine Controls */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-red-400">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FaPills className="text-2xl text-red-500" />
                <h3 className="text-2xl font-bold text-gray-800">Medicine Alerts</h3>
              </div>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                {medicineAlerts.length} alerts
              </span>
            </div>
            <p className="text-gray-600 mb-4">Set reminders for your medications</p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowMedicineForm(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add Medicine</span>
              </button>
              <button
                onClick={requestNotificationPermission}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <FaBell />
                <span>Enable Alerts</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add Meal Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 border-2 border-green-400">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaPlus className="mr-2 text-green-500" />
              Add New Meal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Name *
                </label>
                <select
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a meal type</option>
                  {mealOptions.map(meal => (
                    <option key={meal} value={meal}>{meal}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <div className="flex space-x-2">
                  <select
                    value={newMeal.hour}
                    onChange={(e) => setNewMeal({...newMeal, hour: e.target.value})}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {hours.map(hour => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                  <select
                    value={newMeal.minute}
                    onChange={(e) => setNewMeal({...newMeal, minute: e.target.value})}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {minutes.map(minute => (
                      <option key={minute} value={minute}>{minute}</option>
                    ))}
                  </select>
                  <select
                    value={newMeal.period}
                    onChange={(e) => setNewMeal({...newMeal, period: e.target.value})}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calories
                </label>
                <input
                  type="number"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Calories"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newMeal.description}
                  onChange={(e) => setNewMeal({...newMeal, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Meal details"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={addMeal}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Add Meal
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Medicine Form */}
        {showMedicineForm && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 border-2 border-red-400">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaPlus className="mr-2 text-red-500" />
              Add Medicine Alert
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicine Name *
                </label>
                <input
                  type="text"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., Aspirin, Vitamin D"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <div className="flex space-x-2">
                  <select
                    value={newMedicine.hour}
                    onChange={(e) => setNewMedicine({...newMedicine, hour: e.target.value})}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {hours.map(hour => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                  <select
                    value={newMedicine.minute}
                    onChange={(e) => setNewMedicine({...newMedicine, minute: e.target.value})}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {minutes.map(minute => (
                      <option key={minute} value={minute}>{minute}</option>
                    ))}
                  </select>
                  <select
                    value={newMedicine.period}
                    onChange={(e) => setNewMedicine({...newMedicine, period: e.target.value})}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage
                </label>
                <input
                  type="text"
                  value={newMedicine.dosage}
                  onChange={(e) => setNewMedicine({...newMedicine, dosage: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 1 tablet, 5ml"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                <input
                  type="text"
                  value={newMedicine.instructions}
                  onChange={(e) => setNewMedicine({...newMedicine, instructions: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., After food, With water"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={addMedicine}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Add Medicine
              </button>
              <button
                onClick={() => setShowMedicineForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Diet Plan Cards */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaUtensils className="mr-2 text-yellow-500" />
            Your Meal Plan ({dietPlans.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dietPlans.map((meal) => (
              <div
                key={meal.id}
                className={`bg-white rounded-2xl shadow-2xl p-6 border-2 transition-all duration-500 transform hover:scale-105 ${
                  meal.completed 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-yellow-400'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{meal.name}</h3>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaClock className="text-yellow-500" />
                      <span className="font-semibold">{meal.time}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleMealCompletion(meal.id)}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        meal.completed
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      onClick={() => deleteMeal(meal.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {meal.description && (
                  <p className="text-gray-600 mb-3">{meal.description}</p>
                )}

                {meal.calories && (
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3">
                    {meal.calories} calories
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    meal.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {meal.completed ? 'Completed' : 'Pending'}
                  </div>
                  {meal.alarmTriggered && (
                    <div className="text-sm text-blue-600 flex items-center space-x-1">
                      <FaBell />
                      <span>Alarm Set</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {dietPlans.length === 0 && (
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border-2 border-dashed border-gray-300">
              <FaUtensils className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Meals Scheduled</h3>
              <p className="text-gray-500 mb-6">Start by adding your first meal to your diet plan</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Add Your First Meal
              </button>
            </div>
          )}
        </div>

        {/* Medicine Alert Cards */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <FaPills className="mr-2 text-red-500" />
            Medicine Alerts ({medicineAlerts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicineAlerts.map((medicine) => (
              <div
                key={medicine.id}
                className={`bg-white rounded-2xl shadow-2xl p-6 border-2 transition-all duration-500 transform hover:scale-105 ${
                  medicine.completed 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-red-400'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{medicine.name}</h3>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FaClock className="text-red-500" />
                      <span className="font-semibold">{medicine.time}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleMedicineCompletion(medicine.id)}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        medicine.completed
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      onClick={() => deleteMedicine(medicine.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {medicine.dosage && (
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold inline-block mb-2">
                    Dosage: {medicine.dosage}
                  </div>
                )}

                {medicine.instructions && (
                  <p className="text-gray-600 mb-3">{medicine.instructions}</p>
                )}

                <div className="flex justify-between items-center mt-4">
                  <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    medicine.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {medicine.completed ? 'Taken' : 'Pending'}
                  </div>
                  {medicine.alarmTriggered && (
                    <div className="text-sm text-blue-600 flex items-center space-x-1">
                      <FaBell />
                      <span>Alarm Set</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {medicineAlerts.length === 0 && (
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border-2 border-dashed border-gray-300">
              <FaPills className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Medicine Alerts</h3>
              <p className="text-gray-500 mb-6">Add your first medicine reminder</p>
              <button
                onClick={() => setShowMedicineForm(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Add Medicine Alert
              </button>
            </div>
          )}
        </div>

        {/* Daily Summary */}
        {(dietPlans.length > 0 || medicineAlerts.length > 0) && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-purple-400">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Daily Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">{dietPlans.length}</div>
                <div className="text-gray-600">Total Meals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{medicineAlerts.length}</div>
                <div className="text-gray-600">Medicine Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {dietPlans.filter(m => m.completed).length + medicineAlerts.filter(m => m.completed).length}
                </div>
                <div className="text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {waterIntake}ml
                </div>
                <div className="text-gray-600">Water Intake</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DietPlan;