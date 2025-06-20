import express from 'express'
import PatientsService from '../services/PatientsService'
import { Response } from 'express'
import { Patient } from '../types'

const router = express.Router()

router.get('/', async (req, res: Response<Patient[]>) => {
  res.send(PatientsService.getEntries())
})

export default router
