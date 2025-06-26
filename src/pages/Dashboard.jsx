import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Package,
  Shield,
  TrendingUp,
  BarChart3,
  Plus,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCredentials: 0,
    verifiedCredentials: 0,
    pendingCredentials: 0,
    totalCarbonFootprint: 0,
    averageSustainabilityScore: 0,
  });

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/overview", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  const getRoleSpecificContent = () => {
    switch (user?.role) {
      case "producer":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Products
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalProducts}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Credentials
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalCredentials}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Carbon Footprint
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalCarbonFootprint} kg CO2e
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Avg. Sustainability
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.averageSustainabilityScore}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "verifier":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Verified Credentials
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.totalVerifiedCredentials}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Reviews
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.pendingCredentials}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Welcome to GreenProof
            </h3>
            <p className="text-gray-600">
              Explore sustainable products and verify their credentials through
              our blockchain-powered platform.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.name}! Here's an overview of your sustainability
          activities.
        </p>
      </div>

      {getRoleSpecificContent()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            {user?.role === "producer" && (
              <Link
                to="/products"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Plus className="h-5 w-5 mr-3 text-green-600" />
                Add New Product
              </Link>
            )}

            <Link
              to="/credentials"
              className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <Shield className="h-5 w-5 mr-3 text-blue-600" />
              View Credentials
            </Link>

            {user?.role === "verifier" && (
              <Link
                to="/verification"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Eye className="h-5 w-5 mr-3 text-orange-600" />
                Review Pending Verifications
              </Link>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <span>Product "Organic Cotton T-Shirt" was verified</span>
              <span className="ml-auto text-xs">2 hours ago</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span>New credential issued for "Fair Trade Coffee"</span>
              <span className="ml-auto text-xs">1 day ago</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
              <span>Carbon footprint updated for "Solar Panel"</span>
              <span className="ml-auto text-xs">3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
