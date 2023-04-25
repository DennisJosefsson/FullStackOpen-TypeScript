import { validatedPatient, validatedEntry } from '../utilities/utils';

import express from 'express';
import patientService from '../services/patientService';

const router = express.Router();

router.get('/', (_req, res) => {
    return res.send(patientService.getPatients());
});

router.get('/:id', (req, res) => {
    return res.send(patientService.getSinglePatient(req.params.id));
});

router.post('/', (req, res) => {
    try {
        const validPatient = validatedPatient(req.body);
        const addedPatient = patientService.addPatient(validPatient);
        res.json(addedPatient);
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
    }
});

router.post('/:id/entries', (req, res) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const validEntry = validatedEntry(req.body);

        const newEntry = patientService.addEntry(validEntry, req.params.id);

        res.json(newEntry);
    } catch (error: unknown) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage += ' Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
    }
});

export default router;
