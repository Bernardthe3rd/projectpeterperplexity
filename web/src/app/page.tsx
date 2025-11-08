'use client';

import { useState, useEffect } from 'react';
import { getBusinesses, Business } from '@/lib/api';
import dynamic from 'next/dynamic';

// Dynamic import - NO SSR for map!
const LeafletMap = dynamic(() => import('@/components/Map/LeafletMap'), {
    ssr: false,
    loading: () => (
        <div className="h-96 w-full bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Kaart laden...</p>
        </div>
    )
});

export default function HomePage() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        try {
            const response = await getBusinesses();
            setBusinesses(response.businesses || []);
        } catch (error) {
            console.error('Error fetching businesses:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter logic
    const filteredBusinesses = businesses.filter(business => {
        const matchesCategory = !selectedCategory || business.category === selectedCategory;
        const matchesCity = !selectedCity || business.city === selectedCity;
        return matchesCategory && matchesCity;
    });

    const categories = [...new Set(businesses.map(b => b.category))];
    const cities = [...new Set(businesses.map(b => b.city))];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Laden...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                🇩🇪 Deutsche Bedrijven Platform
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Ontdek Duitse bedrijven in de grensregio
                            </p>
                        </div>
                        <a
                            href="/login"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
                        >
                            Inloggen
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">🔍 Filters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categorie
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Alle categorieën</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stad
                            </label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Alle steden</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSelectedCategory('');
                                    setSelectedCity('');
                                }}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Map */}
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">🗺️ Kaart Weergave</h2>
                        <p className="text-gray-600 text-sm mt-1">
                            Nederlands-Duitse grensgebied
                        </p>
                    </div>
                    <div className="p-6">
                        <LeafletMap businesses={filteredBusinesses} />
                    </div>
                </div>

                {/* Business Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBusinesses.map(business => (
                        <div key={business.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                            <h3 className="text-xl font-semibold mb-2">{business.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{business.category}</p>
                            <div className="space-y-2 text-sm">
                                <p>📍 {business.address}, {business.city}</p>
                                {business.phone && <p>📞 {business.phone}</p>}
                                {business.email && <p>✉️ {business.email}</p>}
                                {business.website && (
                                    <a
                                        href={business.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline block"
                                    >
                                        🌐 Website
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBusinesses.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">
                            Geen bedrijven gevonden met de huidige filters.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}