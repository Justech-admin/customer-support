import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function TicketFormPreview() {
  const router = useRouter();
  const [ticketNumber, setTicketNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJammer, setSelectedJammer] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [jammers, setJammers] = useState([]);
  
  // Use useRef to prevent duplicate generation
  const ticketGenerated = useRef(false);
  
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    contactNumber: '',
    location: '',
    incidentDate: '',
    incidentDetails: '',
    email: '',
  });
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    const fetchJammers = async () => {
      try {
        const response = await fetch('/api/rifle-jammers');
        const data = await response.json();
        setJammers(data);
      } catch (error) {
        console.error('Error fetching jammers:', error);
      }
    };

    // Only generate ticket number once using useRef
    if (!ticketGenerated.current) {
      const generatedNumber = generateTicketNumber();
      console.log('Generated in useEffect:', generatedNumber);
      ticketGenerated.current = true;
    }
    
    fetchJammers();
  }, []); // Empty dependency array is fine now

  const generateTicketNumber = () => {
  console.log('🔥 CORRECT generateTicketNumber function called!');
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  const ticketNumber = `TKT-${year}${month}${day}-${hours}${minutes}${seconds}-${randomNum}`;
  
  console.log('✅ Generated ticket number:', ticketNumber);
  
  setTicketNumber(ticketNumber);
  return ticketNumber;
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'contactNumber') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleIncidentDateChange = (e) => {
    const value = e.target.value;
  
    // Allow clearing the input
    if (!value) {
      setFormData(prev => ({ ...prev, incidentDate: '' }));
      return;
    }
  
    const selectedDate = new Date(value);
    const today = new Date();
    
    // Set both dates to midnight for proper comparison
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
  
    // Accept if selectedDate is today or in the past
    if (selectedDate <= today) {
      setFormData(prev => ({ ...prev, incidentDate: value }));
    } else {
      alert('Please select a date from today or earlier');
    }
  };

  const filteredJammers = jammers.filter(jammer => {
    const serial = jammer.serial_number.toLowerCase();
    return serial.includes(searchTerm.toLowerCase());
  });

  const handleJammerSelect = (jammer) => {
    if (!jammer) {
      alert('Invalid jammer data. Please select a different jammer.');
      return;
    }
    
    setSelectedJammer(jammer);
    setShowDropdown(false);
    setSearchTerm(jammer.serial_number);
    setFormData(prev => ({ ...prev, location: jammer.location_name || '' }));
  };

  const getModelNumber = (serial) => {
    return serial ? serial.split('/').slice(0, -1).join('/') : '';
  };

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedJammer) {
      alert('Please select a jammer');
      return;
    }

    if (attachments.length === 0) {
      alert('Please attach at least one file');
      return;
    }

    // Double-check we have a ticket number
    if (!ticketNumber) {
      alert('Error: No ticket number generated. Please refresh and try again.');
      return;
    }

    console.log('Submitting with ticket number:', ticketNumber); // Debug log

    const submitData = new FormData();
    submitData.append('ticketNumber', ticketNumber);
    submitData.append('name', formData.name.trim());
    submitData.append('designation', formData.designation.trim());
    submitData.append('serialNumber', selectedJammer.serial_number);
    submitData.append('contactNumber', formData.contactNumber);
    submitData.append('incidentDate', formData.incidentDate);
    submitData.append('incidentDetails', formData.incidentDetails.trim());
    submitData.append('email', formData.email.trim());
    submitData.append('status', 1); // Initial status: New

    attachments.forEach(file => {
      submitData.append('attachments', file);
    });

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        body: submitData,
      });
      
      if (!response.ok) {
        const data = await response.json();
        
        // If it's a duplicate entry error, regenerate ticket number and retry
        if (data.error && data.error.includes('Duplicate entry')) {
          console.log('Duplicate ticket number detected, regenerating...');
          ticketGenerated.current = false; // Reset the flag
          generateTicketNumber();
          alert('Ticket number collision detected. Please try submitting again.');
          return;
        }
        
        throw new Error(data.error || 'Error creating ticket');
      }

      const result = await response.json();
      alert('Ticket created successfully!');
      router.push(`/${router.query.username}/Tickets`);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.message || 'Error submitting ticket');
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
        <p className="text-gray-600 mt-1">Fill in the details below to submit a new service ticket</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-700">Ticket Number:</span>
            <span className="ml-2 font-mono text-blue-600">{ticketNumber || 'Generating...'}</span>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg space-y-4">
          <h2 className="font-semibold text-blue-900">Jammer Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-blue-900 mb-2">Serial Number Search *</label>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white" 
                placeholder="Search by serial number" 
                required 
              />
              {showDropdown && searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto">
                  {filteredJammers.map((jammer) => (
                    <div 
                      key={jammer.serial_number} 
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer" 
                      onClick={() => handleJammerSelect(jammer)}
                    >
                      {jammer.serial_number}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-2">Model</label>
              <input 
                type="text" 
                value={selectedJammer ? getModelNumber(selectedJammer.serial_number) : ''} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" 
                readOnly 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-gray-900">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter your full name" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
              <input 
                type="text" 
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter your designation" 
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
              <input 
                type="tel" 
                name="contactNumber"
                value={formData.contactNumber} 
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter 10 digit number"
                required 
                maxLength="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input 
                type="text" 
                value={formData.location} 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50" 
                readOnly 
              />
            </div>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                placeholder="Enter your email address"
                required 
              />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Incident Date *</label>
          <input 
            type="date" 
            name="incidentDate"
            value={formData.incidentDate} 
            onChange={handleIncidentDateChange}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Incident Details *</label>
          <textarea 
            rows={4} 
            name="incidentDetails"
            value={formData.incidentDetails}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
            placeholder="Please describe the incident in detail..." 
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Attachments *</label>
          <input 
            type="file" 
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg" 
            multiple 
            required 
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button 
            type="button" 
            onClick={() => router.push(`/${router.query.user}/tickets`)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={!ticketNumber}
          >
            Submit Ticket
          </button>
        </div>
      </form>
    </div>
  );
}
