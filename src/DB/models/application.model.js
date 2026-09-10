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
  },
);

const applicationModel = mongoose.model("Application", applicationSchema);
export default applicationModel;
