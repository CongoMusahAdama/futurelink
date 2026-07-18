import mongoose from "mongoose";

const attendeeSchema = new mongoose.Schema(
  {
    registrationId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    preferredName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    organisation: { type: String, default: "" },
    hub: { type: String, default: "" },
    region: { type: String, default: "" },
    category: { type: String, default: "Guest" },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date, default: null },
    checkInStation: { type: String, default: "" },
    isWalkIn: { type: Boolean, default: true },
    futureLinkOptIn: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Attendee", attendeeSchema);
