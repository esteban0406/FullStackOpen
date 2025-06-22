import patients from '../../data/patients'
import { Patient } from '../types'
import { v1 as uuid } from 'uuid'
const id = uuid()

const getEntries = (): Patient[] => {
  return patients
}

const addEntry = (entry: Patient): Patient => {
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