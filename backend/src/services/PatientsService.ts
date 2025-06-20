import patients from '../../data/patients'

import { Patient } from '../types'

const getEntries = (): Patient[] => {
  return patients
}

export default {
  getEntries,
}