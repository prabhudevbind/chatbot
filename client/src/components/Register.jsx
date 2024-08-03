import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const history = useNavigate();

  const onSubmit = async (data) => {
    // Handle form submission logic here
    // You might want to send the form data to your server
    // Example using Fetch API:
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('seatNumber', data.seatNumber);
    formData.append('email', data.email);
    formData.append('mobileNumber', data.mobileNumber);
    formData.append('profilePicture', data.profilePicture[0]);
    formData.append('password', data.password);

    try {
      const response = await fetch('/students', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        history('/login'); // Redirect to login page
      } else {
        // Handle registration error
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-8   shadow-md rounded-lg h-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className=' grid grid-cols-1 h-full' encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="seatNumber" className="block text-sm font-medium text-gray-700">Seat Number</label>
          <input
            id="seatNumber"
            type="text"
            {...register('seatNumber', { required: 'Seat number is required' })}
            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          />
          {errors.seatNumber && <p className="text-red-500 text-xs mt-1">{errors.seatNumber.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <input
            id="mobileNumber"
            type="text"
            {...register('mobileNumber', { required: 'Mobile number is required' })}
            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          />
          {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <input
            id="profilePicture"
            type="file"
            {...register('profilePicture', { required: 'Profile picture is required' })}
            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          />
          {errors.profilePicture && <p className="text-red-500 text-xs mt-1">{errors.profilePicture.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="py-3 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Register
        </button>
      </form>
      <div className="text-center mt-4">
        <Link to="/login" className="text-blue-600 hover:text-blue-800 underline">Login yourself</Link>
      </div>
    </div>
  );
}
