import mongoose from "mongoose";

const credentialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Credential name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Credential type is required"],
      enum: [
        "organic_certification",
        "fair_trade",
        "carbon_neutral",
        "recyclable",
        "cruelty_free",
        "sustainable_materials",
        "energy_efficient",
        "water_conservation",
        "biodiversity_protection",
        "social_responsibility",
        "regenerative_agriculture",
        "circular_economy",
      ],
    },
    issuer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Issuer is required"],
    },
    holder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Holder is required"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    guardianPolicyId: {
      type: String,
      required: [true, "Guardian policy ID is required"],
    },
    guardianCredentialId: {
      type: String,
      unique: true,
      sparse: true,
    },
    hederaTokenId: {
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "pending_verification",
        "verified",
        "rejected",
        "expired",
        "revoked",
      ],
      default: "draft",
    },
    validityPeriod: {
      issuedAt: {
        type: Date,
        default: Date.now,
      },
      expiresAt: {
        type: Date,
        required: [true, "Expiration date is required"],
      },
      isExpired: {
        type: Boolean,
        default: false,
      },
    },
    evidence: [
      {
        type: {
          type: String,
          enum: [
            "document",
            "image",
            "sensor_data",
            "test_result",
            "audit_report",
            "certificate",
          ],
        },
        title: String,
        description: String,
        url: String,
        hash: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        verifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        verifiedAt: Date,
      },
    ],
    criteria: {
      standard: {
        type: String,
        required: [true, "Standard is required"],
      },
      version: String,
      requirements: [
        {
          criterion: String,
          isMet: {
            type: Boolean,
            default: false,
          },
          evidence: String,
          verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
          verifiedAt: Date,
        },
      ],
    },
    verification: {
      verifier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      verifiedAt: Date,
      verificationMethod: {
        type: String,
        enum: [
          "document_review",
          "site_visit",
          "third_party_audit",
          "automated_check",
        ],
      },
      notes: String,
      score: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
    impact: {
      carbonReduction: {
        value: Number,
        unit: {
          type: String,
          default: "kg CO2e",
        },
      },
      socialImpact: String,
      environmentalImpact: String,
      economicImpact: String,
    },
    metadata: {
      tags: [String],
      keywords: [String],
      customFields: mongoose.Schema.Types.Mixed,
    },
    auditTrail: [
      {
        action: {
          type: String,
          enum: [
            "created",
            "submitted",
            "verified",
            "rejected",
            "expired",
            "revoked",
            "updated",
          ],
        },
        performedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        notes: String,
        changes: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Check if credential is expired
credentialSchema.pre("save", function (next) {
  if (
    this.validityPeriod.expiresAt &&
    new Date() > this.validityPeriod.expiresAt
  ) {
    this.validityPeriod.isExpired = true;
    if (this.status === "verified") {
      this.status = "expired";
    }
  }
  next();
});

// Add audit trail entry
credentialSchema.methods.addAuditEntry = function (
  action,
  performedBy,
  notes = "",
  changes = {}
) {
  this.auditTrail.push({
    action,
    performedBy,
    notes,
    changes,
    timestamp: new Date(),
  });
};

// Verify credential
credentialSchema.methods.verify = function (verifier, method, notes, score) {
  this.status = "verified";
  this.verification = {
    verifier,
    verifiedAt: new Date(),
    verificationMethod: method,
    notes,
    score,
  };
  this.addAuditEntry("verified", verifier, notes);
};

// Revoke credential
credentialSchema.methods.revoke = function (performedBy, reason) {
  this.status = "revoked";
  this.addAuditEntry("revoked", performedBy, reason);
};

export default mongoose.model("Credential", credentialSchema);
