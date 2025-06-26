import { Shield } from "lucide-react";

const Credentials = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Sustainability Credentials
        </h1>
        <p className="text-gray-600 mb-8">
          Manage and verify sustainability credentials using the Guardian
          framework.
        </p>
        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-gray-600">
            Credentials management functionality will be implemented soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Credentials;
