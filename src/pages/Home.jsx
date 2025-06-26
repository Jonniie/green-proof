import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Leaf,
  Shield,
  BarChart3,
  QrCode,
  Globe,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      icon: Shield,
      title: "Verifiable Credentials",
      description:
        "Issue and verify sustainability credentials using Hedera Guardian framework with immutable blockchain records.",
    },
    {
      icon: BarChart3,
      title: "Carbon Tracking",
      description:
        "Real-time carbon emissions tracking across supply chains with IoT integration and automated calculations.",
    },
    {
      icon: QrCode,
      title: "QR Code Traceability",
      description:
        "Generate unique QR codes for each product linking to comprehensive sustainability data and verification.",
    },
    {
      icon: Globe,
      title: "Regenerative Finance",
      description:
        "Tokenize regenerative activities and create Proof of Regeneration (PoR) tokens for climate action.",
    },
  ];

  const benefits = [
    "Enhanced consumer trust through transparent sustainability data",
    "Compliance with ESG frameworks and sustainability standards",
    "Energy-efficient blockchain infrastructure on Hedera",
    "Real-time supply chain monitoring and verification",
    "Integration with existing ERP and CRM systems",
    "Comprehensive audit trails and immutable records",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-green-50 to-emerald-100 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-green-600 p-4 rounded-full">
                <Leaf className="h-12 w-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-green-600">GreenProof</span>
              <br />
              Sustainability Verification Platform
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Build trust with verifiable sustainability credentials, track
              carbon footprints, and enable regenerative finance on the Hedera
              blockchain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Comprehensive Sustainability Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to verify, track, and communicate your
                sustainability efforts with blockchain-backed transparency.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Why Choose GreenProof?
                </h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center">
                  <Users className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Trusted by Industry Leaders
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Join thousands of producers, verifiers, and consumers
                    building a more sustainable future with blockchain-verified
                    credentials.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        1000+
                      </div>
                      <div className="text-sm text-gray-600">
                        Products Verified
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        500+
                      </div>
                      <div className="text-sm text-gray-600">Active Users</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-green-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Sustainability Journey?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join the movement towards transparent, verifiable sustainability
              with blockchain-backed credentials and real-time tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-green-700 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
