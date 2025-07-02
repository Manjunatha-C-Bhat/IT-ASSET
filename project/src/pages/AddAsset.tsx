import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Select from '../components/UI/Select';

const AddAsset = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    asset_id: '',
    name: '',
    category: '',
    brand: '',
    model: '',
    serial_number: '',
    purchase_date: '',
    purchase_price: '',
    warranty_end: '',
    location: '',
    assigned_to: '',
    status: 'available',
    condition_rating: '5',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'Laptop', label: 'Laptop' },
    { value: 'Desktop', label: 'Desktop' },
    { value: 'Monitor', label: 'Monitor' },
    { value: 'Printer', label: 'Printer' },
    { value: 'Server', label: 'Server' },
    { value: 'Network Equipment', label: 'Network Equipment' },
    { value: 'Mobile Device', label: 'Mobile Device' },
    { value: 'Other', label: 'Other' }
  ];

  const statuses = [
    { value: 'available', label: 'Available' },
    { value: 'in_use', label: 'In Use' },
    { value: 'damaged', label: 'Damaged' },
    { value: 'e_waste', label: 'E-Waste' }
  ];

  const conditionRatings = [
    { value: '1', label: '1 - Poor' },
    { value: '2', label: '2 - Fair' },
    { value: '3', label: '3 - Good' },
    { value: '4', label: '4 - Very Good' },
    { value: '5', label: '5 - Excellent' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.asset_id.trim()) newErrors.asset_id = 'Asset ID is required';
    if (!formData.name.trim()) newErrors.name = 'Asset name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    if (formData.purchase_price && isNaN(Number(formData.purchase_price))) {
      newErrors.purchase_price = 'Purchase price must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
          condition_rating: parseInt(formData.condition_rating)
        })
      });

      if (response.ok) {
        navigate('/assets');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to create asset');
      }
    } catch (error) {
      console.error('Error creating asset:', error);
      alert('Error creating asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/assets')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Add New Asset
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Asset ID *"
              name="asset_id"
              value={formData.asset_id}
              onChange={handleChange}
              placeholder="e.g., LAPTOP-001"
              error={errors.asset_id}
            />

            <Input
              label="Asset Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., MacBook Pro 16&quot;"
              error={errors.name}
            />

            <Select
              label="Category *"
              name="category"
              options={categories}
              value={formData.category}
              onChange={handleChange}
              error={errors.category}
            />

            <Input
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="e.g., Apple"
            />

            <Input
              label="Model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g., M2 Pro"
            />

            <Input
              label="Serial Number"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              placeholder="e.g., ABC123DEF456"
            />

            <Input
              label="Purchase Date"
              name="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={handleChange}
            />

            <Input
              label="Purchase Price"
              name="purchase_price"
              type="number"
              step="0.01"
              value={formData.purchase_price}
              onChange={handleChange}
              placeholder="0.00"
              error={errors.purchase_price}
            />

            <Input
              label="Warranty End Date"
              name="warranty_end"
              type="date"
              value={formData.warranty_end}
              onChange={handleChange}
            />

            <Input
              label="Location *"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Office Floor 2"
              error={errors.location}
            />

            <Input
              label="Assigned To"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              placeholder="e.g., John Doe"
            />

            <Select
              label="Status"
              name="status"
              options={statuses}
              value={formData.status}
              onChange={handleChange}
            />

            <Select
              label="Condition Rating"
              name="condition_rating"
              options={conditionRatings}
              value={formData.condition_rating}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Additional notes about the asset..."
            />
          </div>

          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Creating...' : 'Create Asset'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/assets')}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddAsset;