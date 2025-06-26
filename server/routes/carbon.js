import express from "express";
import Product from "../models/Product.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/carbon/calculate
// @desc    Calculate carbon footprint for a product
// @access  Private
router.post("/calculate", auth, async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Calculate total carbon footprint
    const totalCarbon = product.calculateTotalCarbonFootprint();

    // Calculate sustainability score
    const sustainabilityScore = product.calculateSustainabilityScore();

    product.sustainabilityScore = sustainabilityScore;
    await product.save();

    res.json({
      success: true,
      data: {
        totalCarbonFootprint: product.totalCarbonFootprint,
        sustainabilityScore: product.sustainabilityScore,
        supplyChainBreakdown: product.supplyChain.map((stage) => ({
          stage: stage.stage,
          carbonFootprint: stage.carbonFootprint,
          location: stage.location,
        })),
      },
    });
  } catch (error) {
    console.error("Calculate carbon error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// @route   GET /api/carbon/dashboard
// @desc    Get carbon dashboard data
// @access  Private
router.get("/dashboard", auth, async (req, res) => {
  try {
    const { timeframe = "30d" } = req.query;

    // Get user's products
    const products = await Product.find({ producer: req.user.id });

    const totalCarbon = products.reduce((sum, product) => {
      return sum + (product.totalCarbonFootprint?.value || 0);
    }, 0);

    const averageScore =
      products.length > 0
        ? products.reduce(
            (sum, product) => sum + (product.sustainabilityScore?.overall || 0),
            0
          ) / products.length
        : 0;

    res.json({
      success: true,
      data: {
        totalProducts: products.length,
        totalCarbonFootprint: totalCarbon,
        averageSustainabilityScore: Math.round(averageScore),
        carbonByCategory: products.reduce((acc, product) => {
          const category = product.category;
          acc[category] =
            (acc[category] || 0) + (product.totalCarbonFootprint?.value || 0);
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error("Carbon dashboard error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

export default router;
