import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["citizen", "officer"],
      required: true,
    },
    // Officer specific fields
    employeeId: {
      type: String,
      required: function (this: any) {
        return this.role === "officer";
      },
    },
    department: {
      type: String,
      required: function (this: any) {
        return this.role === "officer";
      },
    },
    governmentEmail: {
      type: String,
      required: function (this: any) {
        return this.role === "officer";
      },
    },
    officeLocation: {
      type: String,
      required: function (this: any) {
        return this.role === "officer";
      },
    },
    status: {
      type: String,
      enum: ["active", "pending", "rejected"],
      default: function (this: any) {
        return this.role === "officer" ? "pending" : "active";
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
