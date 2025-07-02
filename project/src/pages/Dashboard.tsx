import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  CheckCircle,
  AlertTriangle,
  Trash2,
  DollarSign,
  TrendingUp,
  Plus,
  Eye
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';

interface Stats {
  total: number;
  in_use: number;
  available: number;
  damaged: number;
  e_waste: number;
  total_value: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    in_use: 0,
    available: 0,
    damaged: 0,
    e_waste: 0,
    total_value: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/assets/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Assets',
      value: stats.total,
      icon: Package,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'In Use',
      value: stats.in_use,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Available',
      value: stats.available,
      icon: Package,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    {
      title: 'Damaged',
      value: stats.damaged,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      title: 'E-Waste',
      value: stats.e_waste,
      icon: Trash2,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      title: 'Total Value',
      value: `$${stats.total_value?.toLocaleString() || '0'}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

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
          Dashboard
        </h1>
        <div className="flex space-x-3">
          <Link to="/assets">
            <Button variant="secondary" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View All Assets
            </Button>
          </Link>
          <Link to="/assets/add">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Asset Distribution
          </h3>
          <div className="space-y-3">
            {[
              { label: 'In Use', value: stats.in_use, total: stats.total, color: 'bg-green-500' },
              { label: 'Available', value: stats.available, total: stats.total, color: 'bg-indigo-500' },
              { label: 'Damaged', value: stats.damaged, total: stats.total, color: 'bg-yellow-500' },
              { label: 'E-Waste', value: stats.e_waste, total: stats.total, color: 'bg-red-500' }
            ].map((item, index) => {
              const percentage = stats.total > 0 ? (item.value / stats.total) * 100 : 0;
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                    <span className="text-gray-900 dark:text-white">
                      {item.value} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link to="/assets/add" className="block">
              <div className="flex items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">Add New Asset</span>
              </div>
            </Link>
            <Link to="/assets?status=damaged" className="block">
              <div className="flex items-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3" />
                <span className="text-yellow-700 dark:text-yellow-300 font-medium">Review Damaged Assets</span>
              </div>
            </Link>
            <Link to="/assets?status=available" className="block">
              <div className="flex items-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <Package className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                <span className="text-green-700 dark:text-green-300 font-medium">View Available Assets</span>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;