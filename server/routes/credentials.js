import express from "express";
import Credential from "../models/Credential.js";
import { auth, authorize } from "../middleware/auth.js";

const router = express.Router();

// @route   POST /api/credentials
// @desc    Create a new credential
// @access  Private (Issuer)
router.post("/", auth, authorize("producer", "admin"), async (req, res) => {
  try {
    const {
      name,
      type,
      holder,
      product,
      guardianPolicyId,
      validityPeriod,
      criteria,
      evidence,
    } = req.body;

    const credential = new Credential({
      name,
      type,
      issuer: req.user.id,
      holder,
      product,
      guardianPolicyId,
      validityPeriod,
      criteria,
      evidence,
    });

    await credential.save();

    res.status(201).json({
      success: true,
      message: "Credential created successfully",
      data: { credential },
    });
  } catch (error) {
    console.error("Create credential error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// @route   GET /api/credentials
// @desc    Get all credentials (with filters)
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const { type, status, issuer, holder, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (issuer) filter.issuer = issuer;
    if (holder) filter.holder = holder;

    // If user is not admin, only show their credentials
    if (req.user.role !== "admin") {
      filter.$or = [{ issuer: req.user.id }, { holder: req.user.id }];
    }

    const skip = (page - 1) * limit;

    const credentials = await Credential.find(filter)
      .populate("issuer", "name organization")
      .populate("holder", "name organization")
      .populate("product", "name sku")
      .populate("verification.verifier", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Credential.countDocuments(filter);

    res.json({
      success: true,
      data: {
        credentials,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get credentials error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// @route   GET /api/credentials/:id
// @desc    Get credential by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const credential = await Credential.findById(req.params.id)
      .populate("issuer", "name organization profile")
      .populate("holder", "name organization profile")
      .populate("product", "name sku category")
      .populate("verification.verifier", "name")
      .populate("evidence.verifiedBy", "name")
      .populate("criteria.requirements.verifiedBy", "name")
      .populate("auditTrail.performedBy", "name");

    if (!credential) {
      return res.status(404).json({
        success: false,
        error: "Credential not found",
      });
    }

    // Check if user has access to this credential
    if (
      req.user.role !== "admin" &&
      credential.issuer._id.toString() !== req.user.id &&
      credential.holder._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to view this credential",
      });
    }

    res.json({
      success: true,
      data: { credential },
    });
  } catch (error) {
    console.error("Get credential error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

// @route   PUT /api/credentials/:id/verify
// @desc    Verify a credential
// @access  Private (Verifier)
router.put(
  "/:id/verify",
  auth,
  authorize("verifier", "admin"),
  async (req, res) => {
    try {
      const { verificationMethod, notes, score } = req.body;

      const credential = await Credential.findById(req.params.id);

      if (!credential) {
        return res.status(404).json({
          success: false,
          error: "Credential not found",
        });
      }

      if (credential.status !== "pending_verification") {
        return res.status(400).json({
          success: false,
          error: "Credential is not pending verification",
        });
      }

      credential.verify(req.user.id, verificationMethod, notes, score);
      await credential.save();

      res.json({
        success: true,
        message: "Credential verified successfully",
        data: { credential },
      });
    } catch (error) {
      console.error("Verify credential error:", error);
      res.status(500).json({
        success: false,
        error: "Server error",
      });
    }
  }
);

// @route   PUT /api/credentials/:id/reject
// @desc    Reject a credential
// @access  Private (Verifier)
router.put(
  "/:id/reject",
  auth,
  authorize("verifier", "admin"),
  async (req, res) => {
    try {
      const { reason } = req.body;

      const credential = await Credential.findById(req.params.id);

      if (!credential) {
        return res.status(404).json({
          success: false,
          error: "Credential not found",
        });
      }

      credential.status = "rejected";
      credential.addAuditEntry("rejected", req.user.id, reason);
      await credential.save();

      res.json({
        success: true,
        message: "Credential rejected",
        data: { credential },
      });
    } catch (error) {
      console.error("Reject credential error:", error);
      res.status(500).json({
        success: false,
        error: "Server error",
      });
    }
  }
);

// @route   PUT /api/credentials/:id/revoke
// @desc    Revoke a credential
// @access  Private (Issuer/Admin)
router.put("/:id/revoke", auth, async (req, res) => {
  try {
    const { reason } = req.body;

    const credential = await Credential.findById(req.params.id);

    if (!credential) {
      return res.status(404).json({
        success: false,
        error: "Credential not found",
      });
    }

    // Check if user is authorized to revoke
    if (
      req.user.role !== "admin" &&
      credential.issuer.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to revoke this credential",
      });
    }

    credential.revoke(req.user.id, reason);
    await credential.save();

    res.json({
      success: true,
      message: "Credential revoked successfully",
      data: { credential },
    });
  } catch (error) {
    console.error("Revoke credential error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

export default router;
