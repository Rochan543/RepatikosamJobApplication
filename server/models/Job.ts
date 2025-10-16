import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String },
    description: { type: String, required: true },
    applyLink: { type: String, required: true },
  },
  { timestamps: true, collection: "jobs" },
);

export type JobDoc = {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  applyLink: string;
};

export const Job = models.Job || model("Job", JobSchema);
