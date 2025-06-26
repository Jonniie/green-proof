import express from "express";
import Product from "../models/Product.js";
import { auth, authorize } from "../middleware/auth.js";
import { generateQRCode } from "../utils/qrCode.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Producer)
router.post("/", auth, authorize("producer", "admin"), async (req, res) => {
  try {
    const { name, description, category, specifications, pricing, images } =
      req.body;

    // Generate unique SKU
    const sku = `GP-${category.toUpperCase()}-${Date.now()}-${uuidv4().slice(
      0,
      8
    )}`;

    const product = new Product({
      name,
      description,
      category,
      sku,
      producer: req.user.id,
      specifications,
      pricing,
      images,
    });

    await product.save();

    // Generate QR code
    const qrCodeData = await generateQRCode(product.qrCode);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        product,
        qrCode: qrCodeData,
      },
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// @route   GET /api/products
// @desc    Get all products (with filters)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const {
      category,
      producer,
      status,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (producer) filter.producer = producer;
    if (status) filter.status = status;

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate("producer", "name organization")
      .populate("certifications")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("producer", "name organization profile")
      .populate("certifications")
      .populate("supplyChain.evidence.verifiedBy", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// @route   GET /api/products/qr/:qrCode
// @desc    Get product by QR code
// @access  Public
router.get("/qr/:qrCode", async (req, res) => {
  try {
    const product = await Product.findOne({ qrCode: req.params.qrCode })
      .populate("producer", "name organization profile")
      .populate("certifications")
      .populate("supplyChain.evidence.verifiedBy", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    res.json({
      success: true,
      data: { product },
    });
  } catch (error) {
    console.error("Get product by QR error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Producer/Owner)
router.put("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Check if user is the producer or admin
    if (
      product.producer.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this product",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("producer", "name organization");

    res.json({
      success: true,
      message: "Product updated successfully",
      data: { product: updatedProduct },
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// @route   POST /api/products/:id/supply-chain
// @desc    Add supply chain stage
// @access  Private (Producer/Owner)
router.post("/:id/supply-chain", auth, async (req, res) => {
  try {
    const { stage, location, carbonFootprint, dataSource, evidence } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Check if user is the producer or admin
    if (
      product.producer.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this product",
      });
    }

    product.supplyChain.push({
      stage,
      location,
      carbonFootprint,
      dataSource,
      evidence,
    });

    // Recalculate total carbon footprint
    product.calculateTotalCarbonFootprint();

    // Recalculate sustainability score
    const newScore = product.calculateSustainabilityScore();
    product.sustainabilityScore = newScore;

    await product.save();

    res.json({
      success: true,
      message: "Supply chain stage added successfully",
      data: { product },
    });
  } catch (error) {
    console.error("Add supply chain error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Producer/Owner)
router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    // Check if user is the producer or admin
    if (
      product.producer.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to delete this product",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

export default router;
