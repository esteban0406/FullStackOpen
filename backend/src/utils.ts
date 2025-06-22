import { Gender, Patient } from "./types";
import { v1 as uuid } from 'uuid';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
}

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !Object.values(Gender).includes(gender as Gender)) {
    throw new Error('Incorrect gender: ' + gender);
  }
  return gender as Gender;
};

const parseName = (name: unknown): string => {
  if (!isString(name) || name.length < 1) {
    throw new Error('Incorrect or missing name: ' + name);
  }
  return name;
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !Boolean(Date.parse(date))) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation) || occupation.length < 1) {
    throw new Error('Incorrect or missing occupation: ' + occupation);
  }
  return occupation;
};

const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn) || ssn.length < 1) {
    throw new Error('Incorrect or missing SSN: ' + ssn);
  }
  return ssn;
};

export const parsePatient = (object: unknown): Patient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'gender' in object && 'occupation' in object && 'ssn' in object) {
    const newPatient: Patient = {
      id: uuid(),
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      ssn: parseSsn(object.ssn)
    };

    return newPatient;
  }

  throw new Error('Incorrect data: some fields are missing');
};
