import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaStethoscope, FaBell, FaTrash, FaSearch, FaUserMd, FaHospital } from 'react-icons/fa';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [newAppointment, setNewAppointment] = useState({
    doctorName: '',
    specialty: '',
    hospital: '',
    date: '',
    time: '',
    hour: '10',
    minute: '00',
    period: 'AM',
    reason: '',
    address: '',
    phone: ''
  });

  // Mock data for nearby hospitals and doctors
  const nearbyHospitals = [
    {
      id: 1,
      name: "City General Hospital",
      type: "Hospital",
      address: "123 Medical Center Dr, City",
      distance: "0.8 km",
      rating: 4.5,
      phone: "+1 (555) 123-4567",
      doctors: [
        { id: 101, name: "Dr. Sarah Johnson", specialty: "Cardiology", available: true },
        { id: 102, name: "Dr. Michael Chen", specialty: "Dermatology", available: true },
        { id: 103, name: "Dr. Emily Davis", specialty: "Pediatrics", available: false }
      ]
    },
    {
      id: 2,
      name: "Community Health Clinic",
      type: "Clinic",
      address: "456 Health St, Downtown",
      distance: "1.2 km",
      rating: 4.2,
      phone: "+1 (555) 234-5678",
      doctors: [
        { id: 201, name: "Dr. Robert Wilson", specialty: "Family Medicine", available: true },
        { id: 202, name: "Dr. Maria Garcia", specialty: "Internal Medicine", available: true }
      ]
    },
    {
      id: 3,
      name: "Metropolitan Medical Center",
      type: "Hospital",
      address: "789 Care Avenue, Metro",
      distance: "2.1 km",
      rating: 4.7,
      phone: "+1 (555) 345-6789",
      doctors: [
        { id: 301, name: "Dr. James Anderson", specialty: "Orthopedics", available: true },
        { id: 302, name: "Dr. Lisa Brown", specialty: "Neurology", available: true }
      ]
    },
    {
      id: 4,
      name: "Family Care Practice",
      type: "Family Doctor",
      address: "321 Wellness Lane, Suburb",
      distance: "0.5 km",
      rating: 4.8,
      phone: "+1 (555) 456-7890",
      doctors: [
        { id: 401, name: "Dr. David Miller", specialty: "Family Medicine", available: true },
        { id: 402, name: "Dr. Jennifer Taylor", specialty: "General Practice", available: true }
      ]
    }
  ];

  // Load appointments from localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  // Save appointments to localStorage
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Check for appointment alarms
  useEffect(() => {
    const checkAppointmentAlarms = () => {
      const now = new Date();
      appointments.forEach(appointment => {
        const appointmentTime = new Date(`${appointment.date}T${convertTo24Hour(appointment.time)}`);
        const timeDiff = appointmentTime - now;
        
        // Trigger alarm 1 hour before appointment
        if (timeDiff > 0 && timeDiff <= 3600000 && !appointment.alarmTriggered) {
          triggerAppointmentAlarm(appointment);
        }
      });
    };

    const interval = setInterval(checkAppointmentAlarms, 60000);
    return () => clearInterval(interval);
  }, [appointments]);

  const triggerAppointmentAlarm = (appointment) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`🏥 Appointment Reminder`, {
        body: `You have an appointment with ${appointment.doctorName} in 1 hour at ${appointment.hospital}`,
        icon: '/favicon.ico'
      });
    }

    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointment.id ? { ...apt, alarmTriggered: true } : apt
      )
    );
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  // Filter hospitals based on search
  const filteredHospitals = nearbyHospitals.filter(hospital => 
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.doctors.some(doctor => 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

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

  const handleDoctorSelect = (hospital, doctor) => {
    setSelectedDoctor({ ...doctor, hospital: hospital.name, address: hospital.address, phone: hospital.phone });
    setNewAppointment({
      ...newAppointment,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      hospital: hospital.name,
      address: hospital.address,
      phone: hospital.phone
    });
    setShowBookingForm(true);
  };

  const bookAppointment = () => {
    if (newAppointment.doctorName && newAppointment.date && newAppointment.hour && newAppointment.minute) {
      const appointment = {
        id: Date.now(),
        ...newAppointment,
        time: `${newAppointment.hour.padStart(2, '0')}:${newAppointment.minute} ${newAppointment.period}`,
        alarmTriggered: false,
        status: 'upcoming'
      };
      setAppointments(prev => [...prev, appointment].sort((a, b) => 
        new Date(`${a.date}T${convertTo24Hour(a.time)}`) - new Date(`${b.date}T${convertTo24Hour(b.time)}`)
      ));
      setNewAppointment({
        doctorName: '',
        specialty: '',
        hospital: '',
        date: '',
        time: '',
        hour: '10',
        minute: '00',
        period: 'AM',
        reason: '',
        address: '',
        phone: ''
      });
      setSelectedDoctor(null);
      setShowBookingForm(false);
    }
  };

  const cancelAppointment = (id) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const getAppointmentStatus = (appointment) => {
    const appointmentTime = new Date(`${appointment.date}T${convertTo24Hour(appointment.time)}`);
    const now = new Date();
    
    if (appointmentTime < now) return 'completed';
    if (appointmentTime - now <= 3600000) return 'soon'; // Within 1 hour
    return 'upcoming';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Book Appointments
          </h1>
          <p className="text-xl text-gray-600">Find nearby healthcare providers and schedule your visits</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 border-2 border-blue-400">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Find Healthcare Providers</h2>
              <p className="text-gray-600">Search for hospitals, clinics, or specialists near you</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={requestNotificationPermission}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <FaBell />
                <span>Enable Reminders</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="Search for hospitals, clinics, or doctors..."
            />
          </div>
        </div>

        {/* Nearby Healthcare Providers */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-red-500" />
            Nearby Healthcare Providers
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map(hospital => (
              <div key={hospital.id} className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-green-400 transition-all duration-500 transform hover:scale-105">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {hospital.type === 'Hospital' ? (
                      <FaHospital className="text-2xl text-blue-500" />
                    ) : hospital.type === 'Clinic' ? (
                      <FaStethoscope className="text-2xl text-green-500" />
                    ) : (
                      <FaUserMd className="text-2xl text-purple-500" />
                    )}
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{hospital.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {hospital.type}
                        </span>
                        <span>•</span>
                        <span>{hospital.distance}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          ⭐ {hospital.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-red-400" />
                    <span className="text-sm">{hospital.address}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    📞 {hospital.phone}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h5 className="font-semibold text-gray-800 mb-3">Available Doctors:</h5>
                  <div className="space-y-2">
                    {hospital.doctors.map(doctor => (
                      <div key={doctor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-semibold text-gray-800">{doctor.name}</div>
                          <div className="text-sm text-gray-600">{doctor.specialty}</div>
                        </div>
                        <button
                          onClick={() => handleDoctorSelect(hospital, doctor)}
                          disabled={!doctor.available}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                            doctor.available
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {doctor.available ? 'Book Now' : 'Unavailable'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredHospitals.length === 0 && (
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border-2 border-dashed border-gray-300">
              <FaSearch className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Results Found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search terms</p>
            </div>
          )}
        </div>

        {/* Booking Form */}
        {showBookingForm && selectedDoctor && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 mb-8 border-2 border-purple-400">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-purple-500" />
              Book Appointment with {selectedDoctor.name}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor Information
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-800">{selectedDoctor.name}</div>
                    <div className="text-gray-600">{selectedDoctor.specialty}</div>
                    <div className="text-sm text-gray-500 mt-2">{selectedDoctor.hospital}</div>
                    <div className="text-sm text-gray-500">{selectedDoctor.address}</div>
                    <div className="text-sm text-gray-500">📞 {selectedDoctor.phone}</div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Time *
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={newAppointment.hour}
                      onChange={(e) => setNewAppointment({...newAppointment, hour: e.target.value})}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {hours.map(hour => (
                        <option key={hour} value={hour}>{hour}</option>
                      ))}
                    </select>
                    <select
                      value={newAppointment.minute}
                      onChange={(e) => setNewAppointment({...newAppointment, minute: e.target.value})}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {minutes.map(minute => (
                        <option key={minute} value={minute}>{minute}</option>
                      ))}
                    </select>
                    <select
                      value={newAppointment.period}
                      onChange={(e) => setNewAppointment({...newAppointment, period: e.target.value})}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Visit
                  </label>
                  <textarea
                    value={newAppointment.reason}
                    onChange={(e) => setNewAppointment({...newAppointment, reason: e.target.value})}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Briefly describe the reason for your appointment..."
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={bookAppointment}
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => {
                  setShowBookingForm(false);
                  setSelectedDoctor(null);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* My Appointments */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-orange-400">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaCalendarAlt className="mr-2 text-orange-500" />
              My Appointments ({appointments.length})
            </h3>
            <div className="text-sm text-gray-600">
              {appointments.filter(apt => getAppointmentStatus(apt) === 'upcoming').length} upcoming
            </div>
          </div>

          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map(appointment => {
                const status = getAppointmentStatus(appointment);
                return (
                  <div
                    key={appointment.id}
                    className={`p-6 rounded-xl border-2 transition-all duration-500 transform hover:scale-105 ${
                      status === 'completed'
                        ? 'border-green-400 bg-green-50'
                        : status === 'soon'
                        ? 'border-red-400 bg-red-50'
                        : 'border-blue-400 bg-blue-50'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-800">{appointment.doctorName}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : status === 'soon'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {status === 'completed' ? 'Completed' : status === 'soon' ? 'Soon' : 'Upcoming'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FaStethoscope className="mr-2 text-purple-500" />
                            <span>{appointment.specialty}</span>
                          </div>
                          <div className="flex items-center">
                            <FaHospital className="mr-2 text-blue-500" />
                            <span>{appointment.hospital}</span>
                          </div>
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-green-500" />
                            <span>{formatDate(appointment.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <FaClock className="mr-2 text-orange-500" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                        {appointment.reason && (
                          <div className="mt-2 text-gray-600">
                            <strong>Reason:</strong> {appointment.reason}
                          </div>
                        )}
                        {appointment.alarmTriggered && (
                          <div className="mt-2 text-blue-600 flex items-center space-x-1">
                            <FaBell />
                            <span className="text-sm">Reminder set for 1 hour before</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => cancelAppointment(appointment.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                      >
                        <FaTrash />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaCalendarAlt className="text-6xl text-gray-400 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-gray-600 mb-2">No Appointments Booked</h4>
              <p className="text-gray-500">Book your first appointment with a healthcare provider above</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Appointments;