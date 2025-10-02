import React, { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaSave, FaTimes, FaIdCard, FaHeart, FaPhone, FaEnvelope, FaMapMarkerAlt, FaShieldAlt, FaSyringe, FaAllergies, FaPills } from 'react-icons/fa';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    personalInfo: {
      fullName: 'Samruddhi Jagdale',
      dateOfBirth: '2003-08-23',
      gender: 'female',
      bloodGroup: 'A+',
      height: '151 cm',
      weight: '45 kg',
      emergencyContact: '+1 (555) 123-4567'
    },
    contactInfo: {
      email: 'jagdalsamruddhi23@example.com',
      phone: '+1 (555) 987-6543',
      address: 'Sp Collage,Tilak Road,Pune-411030',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411030'
    },
    medicalInfo: {
      aadhaarNumber: '',
      abhaNumber: '',
      allergies: ['Penicillin', 'Peanuts'],
      currentMedications: ['Metformin 500mg', 'Atorvastatin 20mg'],
      chronicConditions: ['Type 2 Diabetes', 'Hypertension'],
      pastSurgeries: ['Appendectomy - 2015'],
      bloodPressure: '120/80 mmHg',
      bloodSugar: '95 mg/dL',
      cholesterol: '180 mg/dL'
    },
    insuranceInfo: {
      provider: 'United Health',
      policyNumber: 'UH-789456123',
      groupNumber: 'GRP-456789',
      validUntil: '2025-12-31'
    }
  });

  const [tempData, setTempData] = useState({});
  const [aadhaarVerification, setAadhaarVerification] = useState({
    loading: false,
    verified: false,
    error: ''
  });

  // Load data from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserData(JSON.parse(savedProfile));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userData));
  }, [userData]);

  const handleEdit = () => {
    setTempData(JSON.parse(JSON.stringify(userData))); // Deep copy
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({});
    setIsEditing(false);
  };

  const handleInputChange = (section, field, value) => {
    setTempData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayUpdate = (section, field, index, value) => {
    setTempData(prev => {
      const newArray = [...prev[section][field]];
      newArray[index] = value;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray
        }
      };
    });
  };

  const handleArrayAdd = (section, field, value = '') => {
    setTempData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], value]
      }
    }));
  };

  const handleArrayRemove = (section, field, index) => {
    setTempData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_, i) => i !== index)
      }
    }));
  };

  // Mock Aadhaar verification API call
  const verifyAadhaar = async (aadhaarNumber) => {
    setAadhaarVerification({ loading: true, verified: false, error: '' });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock verification - in real app, this would call UIDAI API
    if (aadhaarNumber.length === 12 && /^\d+$/.test(aadhaarNumber)) {
      // Mock successful verification with sample data
      const mockAadhaarData = {
        personalInfo: {
          fullName: 'Rajesh Kumar',
          dateOfBirth: '1985-08-20',
          gender: 'Male',
        },
        contactInfo: {
          address: '456 Gandhi Road, Mumbai, Maharashtra 400001',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001'
        }
      };
      
      setTempData(prev => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, ...mockAadhaarData.personalInfo },
        contactInfo: { ...prev.contactInfo, ...mockAadhaarData.contactInfo }
      }));
      
      setAadhaarVerification({ loading: false, verified: true, error: '' });
    } else {
      setAadhaarVerification({ 
        loading: false, 
        verified: false, 
        error: 'Invalid Aadhaar number format. Must be 12 digits.' 
      });
    }
  };

  // Mock ABHA number generation
  const generateABHA = () => {
    const randomABHA = `11-${Math.random().toString().slice(2, 10)}-${Math.random().toString().slice(2, 6)}`;
    handleInputChange('medicalInfo', 'abhaNumber', randomABHA);
  };

  const currentData = isEditing ? tempData : userData;

  const InfoSection = ({ title, icon: Icon, children, color = 'blue' }) => (
    <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 transition-all duration-500 hover:shadow-3xl mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon className={`text-2xl text-${color}-500`} />
          <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
        </div>
      </div>
      {children}
    </div>
  );

  const InfoField = ({ label, value, editable = false, field, section, type = 'text' }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {isEditing && editable ? (
        <input
          type={type}
          value={value}
          onChange={(e) => handleInputChange(section, field, e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      ) : (
        <div className="p-3 bg-gray-50 rounded-lg text-gray-800">{value || 'Not provided'}</div>
      )}
    </div>
  );

  const ArrayField = ({ label, items, editable = false, field, section, placeholder = "Add new item" }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            {isEditing && editable ? (
              <>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayUpdate(section, field, index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleArrayRemove(section, field, index)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                >
                  <FaTimes />
                </button>
              </>
            ) : (
              <div className="flex-1 p-2 bg-gray-50 rounded-lg text-gray-800">{item}</div>
            )}
          </div>
        ))}
        {isEditing && editable && (
          <button
            onClick={() => handleArrayAdd(section, field)}
            className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-all duration-300"
          >
            + {placeholder}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <FaUser className="text-6xl text-white" />
            </div>
            {isEditing && (
              <button className="absolute bottom-2 right-2 bg-yellow-500 text-white p-2 rounded-full shadow-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-110">
                <FaEdit />
              </button>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {currentData.personalInfo.fullName}
          </h1>
          <p className="text-xl text-gray-600">Health Profile & Medical Records</p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <FaEdit />
              <span>Edit Profile</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <FaSave />
                <span>Save Changes</span>
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <FaTimes />
                <span>Cancel</span>
              </button>
            </>
          )}
        </div>

        {/* Personal Information */}
        <InfoSection title="Personal Information" icon={FaUser} color="purple">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoField 
              label="Full Name" 
              value={currentData.personalInfo.fullName} 
              editable={true} 
              field="fullName" 
              section="personalInfo" 
            />
            <InfoField 
              label="Date of Birth" 
              value={currentData.personalInfo.dateOfBirth} 
              editable={true} 
              field="dateOfBirth" 
              section="personalInfo" 
              type="date" 
            />
            <InfoField 
              label="Gender" 
              value={currentData.personalInfo.gender} 
              editable={true} 
              field="gender" 
              section="personalInfo" 
            />
            <InfoField 
              label="Blood Group" 
              value={currentData.personalInfo.bloodGroup} 
              editable={true} 
              field="bloodGroup" 
              section="personalInfo" 
            />
            <InfoField 
              label="Height" 
              value={currentData.personalInfo.height} 
              editable={true} 
              field="height" 
              section="personalInfo" 
            />
            <InfoField 
              label="Weight" 
              value={currentData.personalInfo.weight} 
              editable={true} 
              field="weight" 
              section="personalInfo" 
            />
            <InfoField 
              label="Emergency Contact" 
              value={currentData.personalInfo.emergencyContact} 
              editable={true} 
              field="emergencyContact" 
              section="personalInfo" 
            />
          </div>
        </InfoSection>

        {/* Contact Information */}
        <InfoSection title="Contact Information" icon={FaMapMarkerAlt} color="blue">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoField 
              label="Email" 
              value={currentData.contactInfo.email} 
              editable={true} 
              field="email" 
              section="contactInfo" 
              type="email" 
            />
            <InfoField 
              label="Phone" 
              value={currentData.contactInfo.phone} 
              editable={true} 
              field="phone" 
              section="contactInfo" 
            />
            <div className="md:col-span-2">
              <InfoField 
                label="Address" 
                value={currentData.contactInfo.address} 
                editable={true} 
                field="address" 
                section="contactInfo" 
              />
            </div>
            <InfoField 
              label="City" 
              value={currentData.contactInfo.city} 
              editable={true} 
              field="city" 
              section="contactInfo" 
            />
            <InfoField 
              label="State" 
              value={currentData.contactInfo.state} 
              editable={true} 
              field="state" 
              section="contactInfo" 
            />
            <InfoField 
              label="ZIP Code" 
              value={currentData.contactInfo.zipCode} 
              editable={true} 
              field="zipCode" 
              section="contactInfo" 
            />
          </div>
        </InfoSection>

        {/* Medical Information */}
        <InfoSection title="Medical Information" icon={FaHeart} color="red">
          <div className="space-y-6">
            {/* Aadhaar Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhaar Number
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentData.medicalInfo.aadhaarNumber}
                    onChange={(e) => handleInputChange('medicalInfo', 'aadhaarNumber', e.target.value)}
                    disabled={!isEditing}
                    maxLength={12}
                    placeholder="12-digit Aadhaar number"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  {isEditing && (
                    <button
                      onClick={() => verifyAadhaar(currentData.medicalInfo.aadhaarNumber)}
                      disabled={aadhaarVerification.loading || currentData.medicalInfo.aadhaarNumber.length !== 12}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {aadhaarVerification.loading ? 'Verifying...' : 'Verify Aadhaar'}
                    </button>
                  )}
                </div>
                {aadhaarVerification.error && (
                  <p className="text-red-500 text-sm mt-2">{aadhaarVerification.error}</p>
                )}
                {aadhaarVerification.verified && (
                  <p className="text-green-500 text-sm mt-2">✓ Aadhaar verified successfully</p>
                )}
              </div>

              {/* ABHA Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ABHA Number (Health ID)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={currentData.medicalInfo.abhaNumber}
                    onChange={(e) => handleInputChange('medicalInfo', 'abhaNumber', e.target.value)}
                    disabled={!isEditing}
                    placeholder="ABHA number"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  {isEditing && (
                    <button
                      onClick={generateABHA}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <FaIdCard />
                      <span>Generate ABHA</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Medical Arrays */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArrayField
                label="Allergies"
                items={currentData.medicalInfo.allergies}
                editable={true}
                field="allergies"
                section="medicalInfo"
                placeholder="Add allergy"
              />
              <ArrayField
                label="Current Medications"
                items={currentData.medicalInfo.currentMedications}
                editable={true}
                field="currentMedications"
                section="medicalInfo"
                placeholder="Add medication"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArrayField
                label="Chronic Conditions"
                items={currentData.medicalInfo.chronicConditions}
                editable={true}
                field="chronicConditions"
                section="medicalInfo"
                placeholder="Add condition"
              />
              <ArrayField
                label="Past Surgeries"
                items={currentData.medicalInfo.pastSurgeries}
                editable={true}
                field="pastSurgeries"
                section="medicalInfo"
                placeholder="Add surgery"
              />
            </div>

            {/* Medical Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoField 
                label="Blood Pressure" 
                value={currentData.medicalInfo.bloodPressure} 
                editable={true} 
                field="bloodPressure" 
                section="medicalInfo" 
              />
              <InfoField 
                label="Blood Sugar" 
                value={currentData.medicalInfo.bloodSugar} 
                editable={true} 
                field="bloodSugar" 
                section="medicalInfo" 
              />
              <InfoField 
                label="Cholesterol" 
                value={currentData.medicalInfo.cholesterol} 
                editable={true} 
                field="cholesterol" 
                section="medicalInfo" 
              />
            </div>
          </div>
        </InfoSection>

        {/* Insurance Information */}
        <InfoSection title="Insurance Information" icon={FaShieldAlt} color="green">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoField 
              label="Insurance Provider" 
              value={currentData.insuranceInfo.provider} 
              editable={true} 
              field="provider" 
              section="insuranceInfo" 
            />
            <InfoField 
              label="Policy Number" 
              value={currentData.insuranceInfo.policyNumber} 
              editable={true} 
              field="policyNumber" 
              section="insuranceInfo" 
            />
            <InfoField 
              label="Group Number" 
              value={currentData.insuranceInfo.groupNumber} 
              editable={true} 
              field="groupNumber" 
              section="insuranceInfo" 
            />
            <InfoField 
              label="Valid Until" 
              value={currentData.insuranceInfo.validUntil} 
              editable={true} 
              field="validUntil" 
              section="insuranceInfo" 
              type="date" 
            />
          </div>
        </InfoSection>

        {/* Health Summary */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-yellow-400">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaHeart className="mr-2 text-yellow-500" />
            Health Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{currentData.medicalInfo.allergies.length}</div>
              <div className="text-sm text-gray-600">Allergies</div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{currentData.medicalInfo.currentMedications.length}</div>
              <div className="text-sm text-gray-600">Medications</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{currentData.medicalInfo.chronicConditions.length}</div>
              <div className="text-sm text-gray-600">Conditions</div>
            </div>
            <div className="p-4 bg-red-50 rounded-xl">
              <div className="text-2xl font-bold text-red-600">{currentData.medicalInfo.pastSurgeries.length}</div>
              <div className="text-sm text-gray-600">Surgeries</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
