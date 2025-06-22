import express from 'express'
import PatientsService from '../services/PatientsService'
import { Response } from 'express'
import { Patient } from '../types'

const router = express.Router()

router.get('/', async (req, res: Response<Patient[]>) => {
  res.send(PatientsService.getEntries())
})

router.post('/', async (req, res: Response<Patient>) => {
  const newPatient = PatientsService.addEntry(req.body)
  res.status(201).send(newPatient)
})

export default router
