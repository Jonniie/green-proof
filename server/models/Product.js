import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    producer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Producer is required"],
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: [
        "agriculture",
        "textiles",
        "electronics",
        "food",
        "cosmetics",
        "energy",
        "other",
      ],
    },
    sku: {
      type: String,
      unique: true,
      required: [true, "SKU is required"],
    },
    qrCode: {
      type: String,
      unique: true,
    },
    hederaTokenId: {
      type: String,
      unique: true,
      sparse: true,
    },
    supplyChain: [
      {
        stage: {
          type: String,
          enum: [
            "raw_materials",
            "production",
            "packaging",
            "transport",
            "retail",
            "end_of_life",
          ],
        },
        location: {
          country: String,
          city: String,
          coordinates: {
            lat: Number,
            lng: Number,
          },
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        carbonFootprint: {
          value: Number,
          unit: {
            type: String,
            default: "kg CO2e",
          },
          calculationMethod: String,
        },
        dataSource: {
          type: String,
          enum: ["manual", "iot", "api", "document"],
        },
        evidence: [
          {
            type: {
              type: String,
              enum: ["image", "document", "sensor_data", "certificate"],
            },
            url: String,
            description: String,
            uploadedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
    sustainabilityScore: {
      overall: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      carbon: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      social: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      environmental: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
    },
    totalCarbonFootprint: {
      value: {
        type: Number,
        default: 0,
      },
      unit: {
        type: String,
        default: "kg CO2e",
      },
      lastCalculated: {
        type: Date,
        default: Date.now,
      },
    },
    certifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Credential",
      },
    ],
    status: {
      type: String,
      enum: [
        "draft",
        "pending_verification",
        "verified",
        "rejected",
        "archived",
      ],
      default: "draft",
    },
    images: [
      {
        url: String,
        alt: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    specifications: {
      weight: Number,
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: {
          type: String,
          default: "cm",
        },
      },
      materials: [String],
      packaging: String,
    },
    pricing: {
      currency: {
        type: String,
        default: "USD",
      },
      price: Number,
      unit: String,
    },
    metadata: {
      tags: [String],
      keywords: [String],
      customFields: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Generate QR code before saving
productSchema.pre("save", function (next) {
  if (!this.qrCode) {
    this.qrCode = `GP-${this.sku}-${Date.now()}`;
  }
  next();
});

// Calculate sustainability score
productSchema.methods.calculateSustainabilityScore = function () {
  // This would implement the scoring algorithm based on:
  // - Carbon footprint
  // - Certifications
  // - Supply chain transparency
  // - Social impact
  // For now, returning a placeholder calculation
  return {
    overall: 75,
    carbon: 80,
    social: 70,
    environmental: 75,
  };
};

// Calculate total carbon footprint
productSchema.methods.calculateTotalCarbonFootprint = function () {
  const total = this.supplyChain.reduce((sum, stage) => {
    return sum + (stage.carbonFootprint?.value || 0);
  }, 0);

  this.totalCarbonFootprint = {
    value: total,
    unit: "kg CO2e",
    lastCalculated: new Date(),
  };

  return total;
};

export default mongoose.model("Product", productSchema);
