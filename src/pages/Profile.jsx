import { User } from "lucide-react";

const Profile = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <User className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">User Profile</h1>
        <p className="text-gray-600 mb-8">
          Manage your account settings and preferences.
        </p>
        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-gray-600">
            Profile management functionality will be implemented soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
