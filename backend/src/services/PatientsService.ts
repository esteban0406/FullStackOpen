import patients from '../../data/patients'
import { Patient, NewPatientEntry } from '../types'
import { v1 as uuid } from 'uuid'

const getEntries = (): Patient[] => {
  return patients
}

const addEntry = (entry: NewPatientEntry): Patient => {
  const newPatient = {
    ...entry,
    id: uuid()
  };
  patients.push(newPatient);
  return newPatient;
};

export default {
  getEntries,
  addEntry
}