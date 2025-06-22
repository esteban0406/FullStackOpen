import { Gender, NewPatientEntry } from "./types";
import z from 'zod';

export const NewPatientEntrySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  dateOfBirth: z.string().date(),
  ssn: z.string().min(1, { message: "SSN is required" }),
  gender: z.nativeEnum(Gender),
  occupation: z.string().min(1, { message: "Occupation is required" })
});

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  return NewPatientEntrySchema.parse(object);
};