'use client';
import { useState } from 'react';
import { login } from '../../services/authService';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');

    const res = await login(form);
    if (res.token) {
      localStorage.setItem('token', res.token);
      router.push('/dashboard');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-gray-600"
          >
            {showPassword ? '👁️' : '🙈'}
          </button>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Login
        </button>
      </form>
      <p className="text-center mt-4 text-gray-600">
        New here?{' '}
        <Link href="/register" className="text-blue-500 hover:underline">
          Create a new account
        </Link>
      </p>
    </div>
  );
}
