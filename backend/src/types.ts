import z from 'zod';
import { NewPatientEntrySchema } from './utils';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export interface Diagnosis {
  code: string
  name: string
  latin?: string
}

export interface Patient {
  id: string
  name: string
  dateOfBirth: string
  gender: Gender
  occupation: string
  ssn: string
}

export type NewPatientEntry = z.infer<typeof NewPatientEntrySchema>;