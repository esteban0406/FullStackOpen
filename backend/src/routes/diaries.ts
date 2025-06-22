import express from 'express'
import diaryService from '../services/diaryService'
import { Response } from 'express'
import { NonSensitiveDiaryEntry } from '../types'
import {toNewDiaryEntry} from '../utils';

const router = express.Router()

router.get('/', (_req, res: Response<NonSensitiveDiaryEntry[]>) => {
  res.send(diaryService.getNonSensitiveEntries())
})

router.post('/', (req, res) => {
  const { date, weather, visibility, comment } = req.body

  const addedEntry = diaryService.addDiary({
    date,
    weather,
    visibility,
    comment,
  })
  res.json(addedEntry)
})

router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id))

  if (diary) {
    res.send(diary)
  } else {
    res.sendStatus(404)
  }
})

router.post('/', (req, res) => {
  try {
    const newDiaryEntry = toNewDiaryEntry(req.body);

    const addedEntry = diaryService.addDiary(newDiaryEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
})

export default router
