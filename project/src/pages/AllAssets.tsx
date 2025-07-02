import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';

interface Asset {
  id: number;
  asset_id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  status: string;
  assigned_to: string | null;
  purchase_price: number;
  condition_rating: number;
  location: string;
  created_at: string;
}

const AllAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || ''
  });

  const statusConfig = {
    available: { label: 'Available', icon: Package, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20' },
    in_use: { label: 'In Use', icon: CheckCircle, color: 'text-green-600 bg-green-100 dark:bg-green-900/20' },
    damaged: { label: 'Damaged', icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20' },
    e_waste: { label: 'E-Waste', icon: XCircle, color: 'text-red-600 bg-red-100 dark:bg-red-900/20' }
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Laptop', label: 'Laptop' },
    { value: 'Desktop', label: 'Desktop' },
    { value: 'Monitor', label: 'Monitor' },
    { value: 'Printer', label: 'Printer' },
    { value: 'Server', label: 'Server' },
    { value: 'Other', label: 'Other' }
  ];

  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'available', label: 'Available' },
    { value: 'in_use', label: 'In Use' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'e_waste', label: 'E-Waste' }
  ];

  useEffect(() => {
    fetchAssets();
  }, [filters]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.status) params.set('status', filters.status);
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);

      const response = await fetch(`http://localhost:5000/api/assets?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAssets(data.assets);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assetId: number) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/assets/${assetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchAssets(); // Refresh the list
      } else {
        alert('Failed to delete asset');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      alert('Error deleting asset');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          All Assets
        </h1>
        <Link to="/assets/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </Link>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search assets..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            options={categories}
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          />
          <Select
            options={statuses}
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => {
          const statusInfo = statusConfig[asset.status as keyof typeof statusConfig];
          const StatusIcon = statusInfo?.icon || Package;

          return (
            <Card key={asset.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {asset.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {asset.asset_id}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${statusInfo?.color}`}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo?.label}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="text-gray-900 dark:text-white">{asset.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Brand:</span>
                  <span className="text-gray-900 dark:text-white">{asset.brand}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Model:</span>
                  <span className="text-gray-900 dark:text-white">{asset.model}</span>
                </div>
                {asset.assigned_to && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Assigned to:</span>
                    <span className="text-gray-900 dark:text-white">{asset.assigned_to}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Location:</span>
                  <span className="text-gray-900 dark:text-white">{asset.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Value:</span>
                  <span className="text-gray-900 dark:text-white">
                    ${asset.purchase_price?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Link to={`/assets/edit/${asset.id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                {user?.role === 'admin' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(asset.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {assets.length === 0 && (
        <Card className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No assets found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {filters.search || filters.category || filters.status
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by adding your first asset.'}
          </p>
          <Link to="/assets/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add First Asset
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default AllAssets;