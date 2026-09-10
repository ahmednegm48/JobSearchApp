import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "company name is required"],
      unique: true,
    },
    description: {
      type: String,
    },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
    },
    industry: {
      type: String,
    },
    address: {
      type: String,
    },
    numberOfEmployees: {
      type: Number,
      min: [5, "employees cannot be less than 5"],
      max: [120, "employees count cannot exceed 120"],
    },
    CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    Logo: String,
    coverPic: [String],
    HRs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    legalAttachment: [String],
    approvedByAdmin: Boolean,
    deletedAt: Date,
    bannedAt: Date,
  },
  {
    timestamps: true,
  },
);

companySchema.virtual("jobs", {
  ref: "JobOpportunity",
  localField: "_id",
  foreignField: "companyId",
});
companySchema.set("toJSON", { virtuals: true });

const companyModel = mongoose.model("Company", companySchema);
export default companyModel;
