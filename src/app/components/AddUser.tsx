'use client';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { setResponseMessage } from "../redux/slices/userSlice";
import { UserData } from '../types/common';

const AddUser: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const responseMessage = useSelector((state: RootState) => state.user.responseMessage);

  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const validatePassword = (password: string, confirmPassword: string): boolean => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return false;
    }
    if (!/[!@#$%^&*()_+.]/.test(password)) {
      setPasswordError("Password must contain at least one special character.");
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword(password, confirmPassword)) {
      return;
    }

    const data: UserData = { email, first_name: firstName, last_name: lastName, password };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/createuser/', data);

      if (response.status === 201) {
        dispatch(setResponseMessage('User created successfully. Please confirm your identity for access.'));
      } else {
        dispatch(setResponseMessage(response.data.error || 'An error occurred'));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          dispatch(setResponseMessage(error.response.data.error || 'An error occurred'));
        } else {
          dispatch(setResponseMessage('An error occurred while creating the user.'));
        }
      } else {
        dispatch(setResponseMessage('An unexpected error occurred.'));
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-sm shadow-xl p-8">
      <h2 className="text-2xl font-medium mb-6 text-center">Chord site</h2>

        <form onSubmit={handleSubmit}>
          
        <div className="mb-6">
          <input
            type="text"
            id="first_name"
            name="first_name"
            autoComplete="off"
            placeholder='First Name'
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="text"
              id="last_name"
              placeholder='Last Name'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="email"
              id="email"
              placeholder='Email'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              id="password"
              placeholder='Password'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              id="confirmPassword"
              placeholder='Confirm Password'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-sm shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border-none rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-0"
        >
          Sign up
        </button>
        </form>
        {responseMessage && <p className="mt-4 text-center text-gray-500">{responseMessage}</p>}
      </div>
    </div>
  );
};

export default AddUser;
