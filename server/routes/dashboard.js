import express from "express";
import Product from "../models/Product.js";
import Credential from "../models/Credential.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/dashboard/overview
// @desc    Get dashboard overview data
// @access  Private
router.get("/overview", auth, async (req, res) => {
  try {
    let filter = {};

    // If not admin, only show user's data
    if (req.user.role !== "admin") {
      if (req.user.role === "producer") {
        filter.producer = req.user.id;
      } else if (req.user.role === "verifier") {
        // For verifiers, show credentials they've verified
        const verifiedCredentials = await Credential.find({
          "verification.verifier": req.user.id,
        });
        return res.json({
          success: true,
          data: {
            totalVerifiedCredentials: verifiedCredentials.length,
            recentVerifications: verifiedCredentials.slice(0, 5),
          },
        });
      }
    }

    const products = await Product.find(filter);
    const credentials = await Credential.find(filter);

    const totalCarbon = products.reduce((sum, product) => {
      return sum + (product.totalCarbonFootprint?.value || 0);
    }, 0);

    const verifiedCredentials = credentials.filter(
      (c) => c.status === "verified"
    ).length;
    const pendingCredentials = credentials.filter(
      (c) => c.status === "pending_verification"
    ).length;

    res.json({
      success: true,
      data: {
        totalProducts: products.length,
        totalCredentials: credentials.length,
        verifiedCredentials,
        pendingCredentials,
        totalCarbonFootprint: totalCarbon,
        averageSustainabilityScore:
          products.length > 0
            ? Math.round(
                products.reduce(
                  (sum, p) => sum + (p.sustainabilityScore?.overall || 0),
                  0
                ) / products.length
              )
            : 0,
      },
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// @route   GET /api/dashboard/analytics
// @desc    Get analytics data
// @access  Private
router.get("/analytics", auth, async (req, res) => {
  try {
    const { timeframe = "30d" } = req.query;

    let filter = {};
    if (req.user.role !== "admin") {
      if (req.user.role === "producer") {
        filter.producer = req.user.id;
      }
    }

    const products = await Product.find(filter);
    const credentials = await Credential.find(filter);

    // Carbon footprint by category
    const carbonByCategory = products.reduce((acc, product) => {
      const category = product.category;
      acc[category] =
        (acc[category] || 0) + (product.totalCarbonFootprint?.value || 0);
      return acc;
    }, {});

    // Credentials by type
    const credentialsByType = credentials.reduce((acc, credential) => {
      const type = credential.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Credentials by status
    const credentialsByStatus = credentials.reduce((acc, credential) => {
      const status = credential.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        carbonByCategory,
        credentialsByType,
        credentialsByStatus,
        totalProducts: products.length,
        totalCredentials: credentials.length,
      },
    });
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

export default router;
