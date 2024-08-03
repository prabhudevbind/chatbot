import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
const StudentDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [studentProfile, setStudentProfile] = useState({});
  const studentId  = Cookies.get('id');
  const Navigater =useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await axios.get(`/profiledetails/${studentId}`);
        setStudentProfile(profileResponse.data);

        const attendanceResponse = await axios.get(`/students/${studentId}/attendance`);
        setAttendance(attendanceResponse.data);

        const paymentsResponse = await axios.get(`/students/${studentId}/payments`);
        setPayments(paymentsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [studentId]);

  const checkIn = async () => {
    try {
      const response = await axios.post(`/students/${studentId}/checkin`);
      if (response.status === 201) {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        setAttendance([...attendance, { date, checkInTime: time, checkOutTime: '-' }]);
      } else {
        alert('Check-in failed. You might have already checked in.');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      alert('Check-in failed.');
    }
  };

  const checkOut = async () => {
    try {
      const response = await axios.post(`/students/${studentId}/checkout`);
      if (response.status === 200) {
        const updatedAttendance = attendance.map((record, index) => {
          if (index === attendance.length - 1 && record.checkOutTime === '-') {
            return { ...record, checkOutTime: new Date().toLocaleTimeString() };
          }
          return record;
        });
        setAttendance(updatedAttendance);
      } else {
        alert('Check-out failed. Please ensure you have checked in first.');
      }
    } catch (error) {
      console.error('Check-out error:', error);
      alert('Check-out failed.');
    }
  };

  const handleLogout = () => {
    Cookies.remove('id'); // Remove specific cookies if necessary
    Cookies.remove('token');
    Cookies.remove('adminToken');
    Navigater('/');
  };

  return (
    <div className="container mx-auto my-8 p-8 bg-white shadow-md rounded-lg">
       <button
        onClick={handleLogout}
        className="absolute top-4 right-4  border-2 border-gray-200   shadow-2xl rounded-full p-3 text-white font-bold "
      >
        <img className=' w-5' src="https://img.icons8.com/?size=100&id=8119&format=png&color=FA5252" alt="" />
      </button>
      <div className="flex items-center mb-8 flex-col justify-center">
        <div>
          <img
            src={studentProfile.profilePicture || 'https://via.placeholder.com/100'}
            alt="Profile "
            className="w-24 h-24 rounded-full mr-4"
          />
        </div>

        <div className=' text-center'>
          <h1 className="text-2xl font-bold capitalize">{studentProfile.name || 'Student Name'}</h1>
          <p className="text-gray-700 m-3">
          Seat No: 
            <span className=' font-bold' >
              {studentProfile?.seatNumber || ''}
            </span>
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="mb-6 gap-5 grind  grid-cols-2">
          <button
            onClick={checkIn}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Check In
          </button>
          <button
            onClick={checkOut}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Check Out
          </button>
        </div>
        <div className="w-full mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance History</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="py-2 px-4 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check-in Time</th>
                <th className="py-2 px-4 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Check-out Time</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {attendance.map((record, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-200">{record.date}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{record.checkInTime}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{record.checkOutTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Last Payment Details</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Month</th>
                <th className="py-2 px-4 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="py-2 px-4 bg-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Mode</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {payments.map((payment, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b border-gray-200">{payment.month}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{payment.amount}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{payment.paymentMode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
