import express from 'express'
import DiagnosisSerivice from '../services/DiagnosisSerivice'
import { Response } from 'express'
import { Diagnosis } from '../types'

const router = express.Router()

router.get('/', async (req, res: Response<Diagnosis[]>) => {
  res.send(DiagnosisSerivice.getEntries())
})

export default router
