'use client';

import { useState, useEffect } from 'react';
import { getProfile, getBusinesses, removeToken, User, Business, BusinessResponse } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            // Get user profile
            const profile = await getProfile();
            setUser(profile);

            // Get businesses for overview
            const response: BusinessResponse = await getBusinesses();
            setBusinesses(response.businesses);
        } catch (error) {
            console.error('Dashboard error:', error);
            // Redirect to login if auth fails
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        removeToken();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to login
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Student Header */}
            <header className="bg-green-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">👨‍🎓 Student Dashboard</h1>
                            <p className="mt-2 text-green-100">
                                Welkom {user.first_name} {user.last_name} - {user.university}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-sm text-green-100">Ingelogd als</div>
                                <div className="font-medium">{user.email}</div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded-lg transition-colors"
                            >
                                Uitloggen
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Quick Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <NavCard
                        title="Mijn Prospects"
                        description="Potentiële klanten"
                        icon="👥"
                        count={0}
                        color="bg-blue-500"
                    />
                    <NavCard
                        title="Actieve Klanten"
                        description="Bevestigde adverteerders"
                        icon="✅"
                        count={0}
                        color="bg-green-500"
                    />
                    <NavCard
                        title="Communicatie"
                        description="Berichten & emails"
                        icon="💬"
                        count={0}
                        color="bg-purple-500"
                    />
                    <NavCard
                        title="Commissies"
                        description="Verdiende commissie"
                        icon="💰"
                        amount="€0.00"
                        color="bg-yellow-500"
                    />
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">📋 Recente Activiteit</h2>
                        <p className="text-gray-600 text-sm mt-1">
                            Je laatste acties en updates
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="text-center text-gray-500 py-8">
                            <div className="text-4xl mb-4">📝</div>
                            <p>Nog geen activiteit gevonden.</p>
                            <p className="text-sm mt-2">Begin met het werven van nieuwe klanten om je eerste commissies te verdienen!</p>
                        </div>
                    </div>
                </div>

                {/* Platform Overview (Read-only for students) */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">🗺️ Platform Overzicht</h2>
                        <p className="text-gray-600 text-sm mt-1">
                            Huidige bedrijven op het platform ({businesses.length} totaal)
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {businesses.slice(0, 6).map((business) => (
                                <BusinessPreviewCard key={business.id} business={business} />
                            ))}
                        </div>
                        {businesses.length > 6 && (
                            <div className="text-center mt-6">
                                <a
                                    href="/"
                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Bekijk alle {businesses.length} bedrijven →
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Student Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                        💡 Hoe werkt het systeem?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                        <div>
                            <strong>1. Klanten werven:</strong> Zoek Duitse bedrijven die willen adverteren op ons platform
                        </div>
                        <div>
                            <strong>2. Contact leggen:</strong> Leg contact en leg uit hoe het platform werkt
                        </div>
                        <div>
                            <strong>3. Account aanmaken:</strong> Help ze bij het aanmaken van een adverteerder account
                        </div>
                        <div>
                            <strong>4. Commissie verdienen:</strong> Ontvang commissie voor elke succesvolle klant
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Navigation Card Component
function NavCard({ title, description, icon, count, amount, color }: {
    title: string;
    description: string;
    icon: string;
    count?: number;
    amount?: string;
    color: string;
}) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center">
                <div className={`${color} rounded-lg p-3 text-white text-2xl mr-4`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className="text-2xl font-bold text-gray-900">
                        {count !== undefined ? count : amount}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                </div>
            </div>
        </div>
    );
}

// Business Preview Card Component
function BusinessPreviewCard({ business }: { business: Business }) {
    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'restaurant': return '🍽️';
            case 'tankstation': return '⛽';
            case 'supermarkt': return '🛒';
            default: return '🏢';
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
        <span className="text-xl">
          {getCategoryIcon(business.category)}
        </span>
                <div>
                    <h4 className="font-medium text-sm">{business.name}</h4>
                    <p className="text-xs text-gray-500">{business.city}</p>
                </div>
            </div>
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
        {business.category}
      </span>
        </div>
    );
}