import mongoose from "mongoose";
import {
  genderEnum,
  roleEnum,
  providerEnum,
  OTPTypeEnum,
} from "../../common/utils/enum/enum.js";
import { generateHash } from "../../common/utils/security/hash.security.js";
import { decrypt, encrypt } from "../../common/utils/security/encryption.security.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
      minLength: 2,
      maxLength: 25,
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
      minLength: 2,
      maxLength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == providerEnum.System;
      },
    },
    DOB: Date,
    mobileNumber: String,
    gender: {
      type: String,
      enum: Object.values(genderEnum),
      default: genderEnum.Male,
    },
    role: {
      type: String,
      enum: Object.values(roleEnum),
      default: roleEnum.User,
    },
    provider: {
      type: String,
      enum: Object.values(providerEnum),
      default: providerEnum.System,
    },
    isConfirmed: Boolean,
    profilePic: String,
    coverPic: String,
    changeCredentialsTime: Date,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deletedAt: Date,
    bannedAt: Date,
    // OTP: [
    //   {
    //     code: String,
    //     expiresIn: Date,
    //     type: { type: String, enum: Object.values(OTPTypeEnum) },
    //   },
    // ],
    //
    // I used redis caching for OTPs instead of storing them in the database for better performance and security.
    //
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

userSchema
  .virtual("userName")
  .set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return this.firstName + " " + this.lastName;
  });

  userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await generateHash({plaintext: this.password});
  }
  if (this.isModified("mobileNumber")) {
    this.mobileNumber = encrypt(this.mobileNumber);
  }
});

userSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], async function () {
  const update = this.getUpdate();

  if (update.password) {
    update.password = await generateHash({ plaintext: update.password });
  }
  if (update.mobileNumber) {
    update.mobileNumber = encrypt(update.mobileNumber);
  }
  this.setUpdate(update);
});

userSchema.post(/^find/, function (docs) {
  if (!docs) return;
  const list = Array.isArray(docs) ? docs : [docs];

  list.forEach((doc) => {
    if (doc?.mobileNumber) {
      doc.mobileNumber = decrypt(doc.mobileNumber);
    }
  });
});


const userModel = mongoose.model("User", userSchema);
export default userModel;
