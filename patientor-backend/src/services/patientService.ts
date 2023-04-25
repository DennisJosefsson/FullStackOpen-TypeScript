import patientData from '../../data/patients';
import { v1 as uuid } from 'uuid';

import {
    Patient,
    excludePatientSSN,
    newPatient,
    EntryWithoutId,
} from '../types';

const getPatients = (): excludePatientSSN[] => {
    return patientData.map(
        ({ id, name, dateOfBirth, gender, occupation, entries }) => {
            return { id, name, dateOfBirth, gender, occupation, entries };
        }
    );
};

const getSinglePatient = (id: string): Patient | unknown => {
    return patientData.find((patient) => patient.id === id);
};

const addPatient = (patient: newPatient) => {
    const id: string = uuid();
    const patientEntry = { ...patient, id };
    patientData.push(patientEntry);
    return patientEntry;
};

const addEntry = (entry: EntryWithoutId, patientId: string) => {
    const patient = patientData.find((pat) => pat.id === patientId);
    const id: string = uuid();
    const newEntry = { ...entry, id };
    patient?.entries.push(newEntry);
    return newEntry;
};

export default { getPatients, addPatient, getSinglePatient, addEntry };
