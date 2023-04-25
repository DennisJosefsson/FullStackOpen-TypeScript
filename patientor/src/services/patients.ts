import axios from 'axios';
import { EntryWithoutId, Patient, PatientFormValues, Entry } from '../types';

import { apiBaseUrl } from '../constants';

const getAll = async () => {
    const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

    return data;
};

const create = async (object: PatientFormValues) => {
    const { data } = await axios.post<Patient>(
        `${apiBaseUrl}/patients`,
        object
    );

    return data;
};

const createEntry = async (object: EntryWithoutId, patientId: string) => {
    const { data } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${patientId}/entries`,
        object
    );
    return data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getAll,
    create,
    createEntry,
};
