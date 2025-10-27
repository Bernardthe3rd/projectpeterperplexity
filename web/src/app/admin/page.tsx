'use client';

import { useState, useEffect } from 'react';
import { getBusinesses, Business, BusinessResponse, createBusiness } from '@/lib/api';
import { getProfile, removeToken, User } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchBusinesses();
    }, []);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const profile = await getProfile();
            setCurrentUser(profile);
        } catch (error) {
            router.push('/login');
        }
    };

    const handleLogout = () => {
        removeToken();
        router.push('/login');
    };

    const fetchBusinesses = async () => {
        try {
            setLoading(true);
            const response: BusinessResponse = await getBusinesses();
            setBusinesses(response.businesses);
        } catch (error) {
            console.error('Error fetching businesses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBusiness = async (businessData: Partial<Business>) => {
        try {
            await createBusiness(businessData);
            await fetchBusinesses(); // Refresh list
            setShowAddForm(false);
        } catch (error) {
            console.error('Error adding business:', error);
            alert('Fout bij toevoegen bedrijf');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <header className="bg-blue-600 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">🏢 Admin Dashboard</h1>
                            <p className="mt-2 text-blue-100">
                                Beheer bedrijven op het Duitse platform
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {currentUser && (
                                <div className="text-right">
                                    <div className="text-sm text-blue-100">Ingelogd als Admin</div>
                                    <div className="font-medium">{currentUser.first_name} {currentUser.last_name}</div>
                                </div>
                            )}
                            <a
                                href="/"
                                className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg transition-colors"
                            >
                                👁️ Bekijk Frontend
                            </a>
                            <button
                                onClick={handleLogout}
                                className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg transition-colors"
                            >
                                Uitloggen
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Totaal Bedrijven"
                        value={businesses.length}
                        icon="🏢"
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Restaurants"
                        value={businesses.filter(b => b.category === 'restaurant').length}
                        icon="🍽️"
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Tankstations"
                        value={businesses.filter(b => b.category === 'tankstation').length}
                        icon="⛽"
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Supermarkten"
                        value={businesses.filter(b => b.category === 'supermarkt').length}
                        icon="🛒"
                        color="bg-purple-500"
                    />
                </div>

                {/* Business Management Table */}
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold">📋 Bedrijven Beheer</h2>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Bedrijven laden...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Bedrijf
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Categorie
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Locatie
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acties
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {businesses.map((business) => (
                                    <BusinessRow key={business.id} business={business} onRefresh={fetchBusinesses} />
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Business Modal */}
            {showAddForm && (
                <AddBusinessModal
                    onClose={() => setShowAddForm(false)}
                    onAdd={handleAddBusiness}
                />
            )}
        </div>
    );
}

// Statistics Card Component
function StatCard({ title, value, icon, color }: {
    title: string;
    value: number;
    icon: string;
    color: string;
}) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
                <div className={`${color} rounded-lg p-3 text-white text-2xl mr-4`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}

// Business Table Row Component
function BusinessRow({ business, onRefresh }: {
    business: Business;
    onRefresh: () => void;
}) {
    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'restaurant': return '🍽️';
            case 'tankstation': return '⛽';
            case 'supermarkt': return '🛒';
            default: return '🏢';
        }
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
          <span className="text-2xl mr-3">
            {getCategoryIcon(business.category)}
          </span>
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {business.name}
                        </div>
                        <div className="text-sm text-gray-500">
                            ID: {business.id}
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
          {business.category}
        </span>
                {business.sub_category && (
                    <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {business.sub_category}
          </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>{business.city}, {business.country}</div>
                <div className="text-gray-500">{business.address}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {business.phone && <div>📞 {business.phone}</div>}
                {business.email && <div>✉️ {business.email}</div>}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            business.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {business.is_active ? 'Actief' : 'Inactief'}
        </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                    ✏️ Bewerken
                </button>
                <button className="text-red-600 hover:text-red-900">
                    🗑️ Verwijderen
                </button>
            </td>
        </tr>
    );
}

// Add Business Modal Component
function AddBusinessModal({ onClose, onAdd }: {
    onClose: () => void;
    onAdd: (business: Partial<Business>) => void;
}) {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        sub_category: '',
        address: '',
        city: '',
        postal_code: '',
        phone: '',
        website: '',
        email: '',
        description: '',
        latitude: 0,
        longitude: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">➕ Nieuw Bedrijf Toevoegen</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Basic Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bedrijfsnaam *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categorie *
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Kies categorie</option>
                                <option value="restaurant">🍽️ Restaurant</option>
                                <option value="tankstation">⛽ Tankstation</option>
                                <option value="supermarkt">🛒 Supermarkt</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subcategorie
                            </label>
                            <input
                                type="text"
                                value={formData.sub_category}
                                onChange={(e) => setFormData({...formData, sub_category: e.target.value})}
                                placeholder="bijv. grieks, italiaans"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stad *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Adres *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Contact Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Telefoon
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website
                            </label>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => setFormData({...formData, website: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Latitude *
                            </label>
                            <input
                                type="number"
                                step="any"
                                required
                                value={formData.latitude}
                                onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Longitude *
                            </label>
                            <input
                                type="number"
                                step="any"
                                required
                                value={formData.longitude}
                                onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Beschrijving
                            </label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                        >
                            Annuleren
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            Bedrijf Toevoegen
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}