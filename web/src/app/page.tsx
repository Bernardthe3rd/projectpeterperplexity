'use client';

import { useState, useEffect } from 'react';
import { getBusinesses, Business, BusinessResponse } from '@/lib/api';
import LeafletMap from "@/components/Map/LeafletMap";

export default function HomePage() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');

    // Fetch businesses from Go API
    useEffect(() => {
        fetchBusinesses();
    }, [selectedCategory, selectedCity]);

    const fetchBusinesses = async () => {
        try {
            setLoading(true);
            const filters: any = {};
            if (selectedCategory) filters.category = selectedCategory;
            if (selectedCity) filters.city = selectedCity;

            const response: BusinessResponse = await getBusinesses(filters);
            setBusinesses(response.businesses);
        } catch (error) {
            console.error('Error fetching businesses:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                🇩🇪 Duitse Bedrijven Platform
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Ontdek restaurants, tankstations en winkels in Duitsland
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <a
                                href="/login"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                🔐 Inloggen
                            </a>
                            <a
                                href="/admin"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                🏢 Admin Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            </header>


            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <h2 className="text-xl font-semibold mb-4">🔍 Zoeken & Filteren</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categorie
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Alle categorieën</option>
                                <option value="restaurant">🍽️ Restaurants</option>
                                <option value="tankstation">⛽ Tankstations</option>
                                <option value="supermarkt">🛒 Supermarkten</option>
                            </select>
                        </div>

                        {/* City Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stad
                            </label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Alle steden</option>
                                <option value="Düsseldorf">Düsseldorf</option>
                                <option value="Köln">Köln</option>
                                <option value="Aachen">Aachen</option>
                            </select>
                        </div>

                        {/* Reset Button */}
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSelectedCategory('');
                                    setSelectedCity('');
                                }}
                                className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                🔄 Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Map Section - Voeg dit toe na de Filters div, voor de Results div */}
                <div className="bg-white rounded-lg shadow-sm mb-8">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">🗺️ Kaart Weergave</h2>
                        <p className="text-gray-600 text-sm mt-1">
                            Nederlands-Duitse grensgebied met alle bedrijven
                        </p>
                    </div>
                    <div className="p-6">
                        <LeafletMap businesses={businesses} />
                    </div>
                </div>

                {/* Results */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">
                            📋 Bedrijven ({businesses.length})
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Bedrijven laden...</p>
                        </div>
                    ) : businesses.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Geen bedrijven gevonden met de huidige filters.
                        </div>
                    ) : (
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {businesses.map((business) => (
                                    <BusinessCard key={business.id} business={business} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Business Card Component
function BusinessCard({ business }: { business: Business }) {
    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'restaurant': return '🍽️';
            case 'tankstation': return '⛽';
            case 'supermarkt': return '🛒';
            default: return '🏢';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category.toLowerCase()) {
            case 'restaurant': return 'bg-green-100 text-green-800';
            case 'tankstation': return 'bg-blue-100 text-blue-800';
            case 'supermarkt': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-lg text-gray-900 flex-1">
                    {business.name}
                </h3>
                <span className="text-2xl">
          {getCategoryIcon(business.category)}
        </span>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(business.category)}`}>
            {business.category}
          </span>
                    {business.sub_category && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              {business.sub_category}
            </span>
                    )}
                </div>

                <p className="text-sm text-gray-600">
                    📍 {business.address}, {business.city}
                </p>

                {business.phone && (
                    <p className="text-sm text-gray-600">
                        📞 {business.phone}
                    </p>
                )}

                {business.description && (
                    <p className="text-sm text-gray-700 mt-2">
                        {business.description}
                    </p>
                )}

                {business.website && (
                    <a
                        href={business.website.startsWith('http') ? business.website : `https://${business.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                        🌐 Website bezoeken
                    </a>
                )}
            </div>
        </div>
    );
}