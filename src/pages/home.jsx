import React, { useState, useEffect } from 'react';
import { FaHeart, FaHeartbeat, FaThermometerHalf, FaTint, FaStethoscope, FaClock } from 'react-icons/fa';

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [heartRate, setHeartRate] = useState(72);
  const [oxygenLevel, setOxygenLevel] = useState(98);
  const [bloodPressure, setBloodPressure] = useState({ systolic: 120, diastolic: 80 });
  const [temperature, setTemperature] = useState(98.6);
  const [isBeating, setIsBeating] = useState(true);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate health data changes
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRate(prev => {
        const change = Math.random() * 4 - 2;
        return Math.max(60, Math.min(100, Math.round(prev + change)));
      });
      
      setOxygenLevel(prev => {
        const change = Math.random() * 0.4 - 0.2;
        return Math.max(95, Math.min(100, Math.round((prev + change) * 10) / 10));
      });
      
      setBloodPressure(prev => ({
        systolic: Math.max(110, Math.min(130, prev.systolic + Math.random() * 2 - 1)),
        diastolic: Math.max(70, Math.min(85, prev.diastolic + Math.random() * 2 - 1))
      }));
      
      setTemperature(prev => {
        const change = Math.random() * 0.2 - 0.1;
        return Math.max(97.5, Math.min(99.5, Math.round((prev + change) * 10) / 10));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Heart beat animation
  useEffect(() => {
    const beatInterval = setInterval(() => {
      setIsBeating(prev => !prev);
    }, 800);
    return () => clearInterval(beatInterval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Caretaker<span className="text-red-500">+</span>
          </h1>
          <p className="text-xl text-gray-600">Live Health Monitoring Dashboard</p>
        </div>

        {/* Main Health Monitoring - Horizontal Rectangular Layout */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8 justify-center items-stretch">
          
          {/* Left Column */}
          <div className="flex flex-col gap-6 lg:w-1/3">
            {/* Timer */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-yellow-400 transition-all duration-500 transform hover:scale-105 hover:shadow-3xl flex items-center justify-between h-32">
              <div className="flex items-center space-x-4">
                <FaClock className="text-3xl text-yellow-500 animate-pulse" />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Current Time</h3>
                  <div className="text-xl font-mono font-bold text-gray-900">
                    {formatTime(currentTime)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">{formatDate(currentTime)}</div>
              </div>
            </div>

            {/* Heartbeat Checker */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-red-400 transition-all duration-500 transform hover:scale-105 hover:shadow-3xl flex items-center justify-between h-32 relative">
              <div className={`absolute inset-0 bg-red-400 rounded-2xl opacity-5 ${
                isBeating ? 'animate-ping' : ''
              }`}></div>
              <div className="flex items-center space-x-4 relative z-10">
                <div className={`transition-transform duration-300 ${isBeating ? 'scale-110' : 'scale-100'}`}>
                  <FaHeart className="text-3xl text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Heart Rate</h3>
                  <div className="text-2xl font-bold text-gray-900">
                    {heartRate} <span className="text-lg text-gray-600">BPM</span>
                  </div>
                </div>
              </div>
              <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                heartRate >= 60 && heartRate <= 100 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {heartRate >= 60 && heartRate <= 100 ? 'Normal' : 'Check'}
              </div>
            </div>

            {/* Oxygen Level Checker */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-blue-400 transition-all duration-500 transform hover:scale-105 hover:shadow-3xl flex items-center justify-between h-32">
              <div className="flex items-center space-x-4">
                <FaTint className="text-3xl text-blue-500 animate-pulse" />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Oxygen Level</h3>
                  <div className="text-2xl font-bold text-gray-900">
                    {oxygenLevel}%
                  </div>
                </div>
              </div>
              <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                oxygenLevel >= 95 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {oxygenLevel >= 95 ? 'Normal' : 'Low'}
              </div>
            </div>
          </div>

          {/* Center Column */}
          <div className="flex flex-col gap-6 lg:w-1/3">
            {/* ECG Checker */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-green-400 transition-all duration-500 transform hover:scale-105 hover:shadow-3xl h-32">
              <div className="flex items-center justify-between h-full">
                <div className="flex items-center space-x-4">
                  <FaHeartbeat className="text-3xl text-green-500 animate-bounce" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">ECG Monitor</h3>
                    <div className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      Live Reading
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900 rounded-lg p-2 w-32">
                  <div className="h-8 bg-gray-800 rounded relative overflow-hidden">
                    <div className="absolute inset-0">
                      <svg viewBox="0 0 100 20" className="w-full h-full">
                        <path
                          d="M0,10 Q10,5 20,10 Q30,15 40,10 Q50,5 60,10 Q70,15 80,10 Q90,5 100,10"
                          stroke="#00ff00"
                          strokeWidth="0.3"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Beating Heart Visual */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-2xl p-6 border-2 border-pink-400 transition-all duration-500 transform hover:scale-105 hover:shadow-3xl flex items-center justify-center h-64">
              <div className="text-center">
                <div className="relative mb-4">
                  <div className={`absolute inset-0 bg-red-400 rounded-full opacity-20 ${
                    isBeating ? 'animate-ping' : ''
                  }`} style={{ width: '100px', height: '100px', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
                  <div className={`transform transition-all duration-300 ${
                    isBeating ? 'scale-110' : 'scale-100'
                  }`}>
                    <FaHeart className="text-6xl text-red-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Live Heart Beat</h3>
                <p className="text-gray-600">Monitoring in real-time</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 lg:w-1/3">
            {/* BP Checker */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-purple-400 transition-all duration-500 transform hover:scale-105 hover:shadow-3xl flex items-center justify-between h-32">
              <div className="flex items-center space-x-4">
                <FaStethoscope className="text-3xl text-purple-500 animate-bounce" />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Blood Pressure</h3>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(bloodPressure.systolic)}/{Math.round(bloodPressure.diastolic)}
                    <span className="text-lg text-gray-600 ml-1">mmHg</span>
                  </div>
                </div>
              </div>
              <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                bloodPressure.systolic <= 120 && bloodPressure.diastolic <= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {bloodPressure.systolic <= 120 && bloodPressure.diastolic <= 80 ? 'Normal' : 'Elevated'}
              </div>
            </div>

            {/* Temperature Checker */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-orange-400 transition-all duration-500 transform hover:scale-105 hover:shadow-3xl flex items-center justify-between h-32">
              <div className="flex items-center space-x-4">
                <FaThermometerHalf className="text-3xl text-orange-500 animate-pulse" />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Temperature</h3>
                  <div className="text-2xl font-bold text-gray-900">
                    {temperature}°F
                  </div>
                </div>
              </div>
              <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                temperature >= 97.5 && temperature <= 99.5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {temperature >= 97.5 && temperature <= 99.5 ? 'Normal' : 'Fever'}
              </div>
            </div>

            {/* Health Summary */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-gray-300 transition-all duration-500 transform hover:scale-105 hover:shadow-3xl h-32">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Overall Health</h3>
                <div className="flex justify-around">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mx-auto mb-1"></div>
                    <div className="text-xs text-gray-600">Stable</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">✓</div>
                    <div className="text-xs text-gray-600">Good</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-800">6/6</div>
                    <div className="text-xs text-gray-600">Metrics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Status Bar */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-gray-200 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold text-gray-800">Live Monitoring Active</span>
            </div>
            <div className="text-gray-600">
              Last updated: {formatTime(currentTime)}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg">
              Health History
            </button>
            <button className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg">
              Emergency
            </button>
            <button className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg">
              Share Report
            </button>
            <button className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg">
              Export Data
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;