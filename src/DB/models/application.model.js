import mongoose from "mongoose";
import { statusEnum } from "../../common/utils/enum/enum.js";

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "JobOpportunity" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userCV: String,
    status: {
      type: String,
      enum: Object.values(statusEnum),
      default: statusEnum.pending,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

applicationSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: false,
});

applicationSchema.virtual("job", {
  ref: "JobOpportunity",
  localField: "jobId",
  foreignField: "_id",
  justOne: false,
});

const applicationModel = mongoose.model("Application", applicationSchema);
export default applicationModel;
