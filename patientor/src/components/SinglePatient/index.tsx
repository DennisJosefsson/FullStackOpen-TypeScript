import { Patient, Diagnosis, EntryWithoutId, Entry } from '../../types';
import { useParams } from 'react-router-dom';
import {
    Table,
    TableCell,
    TableRow,
    TableBody,
    Typography,
    Button,
} from '@mui/material';
import EntryList from './Entry';
import AddEntryModal from './AddEntryModal';
import { useState, useEffect } from 'react';
import patientService from '../../services/patients';
import axios from 'axios';
import { apiBaseUrl } from '../../constants';

const SinglePatient = ({
    patients,
    diagnosis,
    entries,
    setEntries,
}: {
    patients: Patient[];
    diagnosis: Diagnosis[];
    entries: Entry[];
    setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
}) => {
    const [entryModalOpen, setEntryModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const entryOpenModal = (): void => setEntryModalOpen(true);

    const closeModal = (): void => {
        setEntryModalOpen(false);
        setError(undefined);
    };
    const id = useParams().id;
    const patient = patients.find((patient) => patient.id === id);
    useEffect(() => {
        const fetchEntries = async () => {
            const patient = await axios.get(`${apiBaseUrl}/patients/${id}`);

            setEntries(patient.data.entries);
        };

        fetchEntries();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitNewEntry = async (values: EntryWithoutId) => {
        try {
            const entry = await patientService.createEntry(
                values,
                id as string
            );
            setEntries(entries.concat(entry));

            setEntryModalOpen(false);
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                if (
                    e?.response?.data &&
                    typeof e?.response?.data === 'string'
                ) {
                    const message = e.response.data.replace(
                        'Something went wrong. Error: ',
                        ''
                    );
                    console.error(message);
                    setError(message);
                    setTimeout(() => {
                        setError('');
                    }, 5000);
                } else {
                    setError('Unrecognized axios error');
                    setTimeout(() => {
                        setError('');
                    }, 5000);
                }
            } else {
                console.error('Unknown error', e);
                setError('Unknown error');
                setTimeout(() => {
                    setError('');
                }, 5000);
            }
        }
    };

    return (
        <div className="app">
            <Table style={{ marginBottom: '1em' }}>
                <TableBody>
                    <TableRow>
                        <TableCell>Name: </TableCell>
                        <TableCell>{patient?.name}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Gender: </TableCell>
                        <TableCell>{patient?.gender}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Date of Birth: </TableCell>
                        <TableCell>{patient?.dateOfBirth}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Occupation: </TableCell>
                        <TableCell>{patient?.occupation}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <AddEntryModal
                modalOpen={entryModalOpen}
                onSubmit={submitNewEntry}
                error={error}
                onClose={closeModal}
                diagnosis={diagnosis}
            />
            <Button variant="contained" onClick={() => entryOpenModal()}>
                Add New Entry
            </Button>
            <Typography align="center" variant="h4">
                Entries
            </Typography>
            <EntryList entries={entries} diagnosis={diagnosis} />
        </div>
    );
};

export default SinglePatient;
