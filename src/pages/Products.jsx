import { Package } from "lucide-react";

const Products = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <Package className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Products Management
        </h1>
        <p className="text-gray-600 mb-8">
          Manage your products, track sustainability metrics, and generate QR
          codes for traceability.
        </p>
        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-gray-600">
            Product management functionality will be implemented soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Products;
