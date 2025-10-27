'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, saveToken, LoginRequest } from '@/lib/api';

export default function LoginPage() {
    const [credentials, setCredentials] = useState<LoginRequest>({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await login(credentials);

            // Save token
            saveToken(response.token);

            // Redirect based on role
            if (response.user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    // Quick login functions for demo
    const quickLogin = (email: string, password: string) => {
        setCredentials({ email, password });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        🇩🇪 Duitse Bedrijven Platform
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Log in om toegang te krijgen tot het systeem
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email adres
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={credentials.email}
                                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Wachtwoord
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                                <div className="flex">
                                    <div className="text-sm text-red-700">
                                        ❌ {error}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {loading ? 'Bezig met inloggen...' : 'Inloggen'}
                            </button>
                        </div>
                    </form>

                    {/* Demo Accounts */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Demo accounts</span>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            <button
                                type="button"
                                onClick={() => quickLogin('admin@deutschebedrijven.nl', 'admin123')}
                                className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded text-sm transition-colors"
                            >
                                🏢 Admin Login (Volledige toegang)
                            </button>

                            <button
                                type="button"
                                onClick={() => quickLogin('student@deutschebedrijven.nl', 'student123')}
                                className="w-full bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded text-sm transition-colors"
                            >
                                👨‍🎓 Student Login (Beperkte toegang)
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
                <a
                    href="/"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                >
                    ← Terug naar homepage
                </a>
            </div>
        </div>
    );
}