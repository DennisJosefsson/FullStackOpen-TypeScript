import { useState, useEffect } from 'react';

import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Button, Divider, Container, Typography } from '@mui/material';

import { Patient, Diagnosis, Entry } from './types';

import patientService from './services/patients';
import diagnosisService from './services/diagnosis';
import PatientListPage from './components/PatientListPage';
import SinglePatient from './components/SinglePatient';

const App = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [diagnosis, setDiagnosis] = useState<Diagnosis[]>([]);
    const [entries, setEntries] = useState<Entry[]>([]);

    useEffect(() => {
        const fetchPatientList = async () => {
            const patients = await patientService.getAll();
            setPatients(patients);
        };
        const fetchDiagnosisList = async () => {
            const diagnosis = await diagnosisService.getAllDiagnosis();
            setDiagnosis(diagnosis);
        };

        void fetchPatientList();
        void fetchDiagnosisList();
    }, []);

    return (
        <div className="App">
            <Router>
                <Container>
                    <Typography variant="h3" style={{ marginBottom: '0.5em' }}>
                        Patientor
                    </Typography>
                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        color="primary"
                    >
                        Home
                    </Button>
                    <Divider hidden />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PatientListPage
                                    patients={patients}
                                    setPatients={setPatients}
                                />
                            }
                        />
                        <Route
                            path="/patients/:id"
                            element={
                                <SinglePatient
                                    diagnosis={diagnosis}
                                    patients={patients}
                                    entries={entries}
                                    setEntries={setEntries}
                                />
                            }
                        />
                    </Routes>
                </Container>
            </Router>
        </div>
    );
};

export default App;
