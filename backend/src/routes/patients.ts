import PatientsService from '../services/PatientsService'
import { Patient, NewPatientEntry } from '../types'
import z from 'zod'
import { NewPatientEntrySchema } from '../utils'
import express, { Request, Response, NextFunction } from 'express';

const router = express.Router()

router.get('/', async (req, res: Response<Patient[]>) => {
  res.send(PatientsService.getEntries())
})

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientEntrySchema.parse(req.body)
    console.log(req.body)
    next()
  } catch (error) {
    next(error)
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
  const newPatient = PatientsService.addEntry(req.body)
  res.status(201).send(newPatient)
})

router.use(errorMiddleware);

export default router
