import { useState, SyntheticEvent } from 'react';

import {
    TextField,
    InputLabel,
    MenuItem,
    Select,
    Grid,
    Button,
    SelectChangeEvent,
    OutlinedInput,
    Checkbox,
    ListItemText,
} from '@mui/material';

import { EntryWithoutId, EntryType, Diagnosis } from '../../../types';

interface Props {
    onCancel: () => void;
    onSubmit: (values: EntryWithoutId) => void;
    diagnosis: Diagnosis[];
}

interface TypeOption {
    value: EntryType;
    label: string;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const typeOptions: TypeOption[] = Object.values(EntryType).map((v) => ({
    value: v,
    label: v.toString(),
}));

const ratingOptions: Array<{ value: number; label: string }> = [
    { value: 0, label: 'Healthy' },
    { value: 1, label: 'Low risk' },
    { value: 2, label: 'High risk' },
    { value: 3, label: 'Critical risk' },
];

const AddEntryForm = ({ onCancel, onSubmit, diagnosis }: Props) => {
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [specialist, setSpecialist] = useState('');
    const [diagnosisCodes, setDiagnosisCodes] = useState(Array<string>);

    const [type, setType] = useState('');
    const [healthCheckRating, setHealthCheckRating] = useState(0);
    const [employerName, setEmployerName] = useState('');

    const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
    const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');

    const [dischargeDate, setDischargeDate] = useState('');
    const [dischargeCriteria, setDischargeCriteria] = useState('');

    const onTypeChange = (event: SelectChangeEvent<string>) => {
        event.preventDefault();
        if (typeof event.target.value === 'string') {
            const value = event.target.value;
            const type = Object.values(EntryType).find(
                (g) => g.toString() === value
            );
            if (type) {
                setType(type);
            }
        }
    };

    const addHealthCheckEntry = (event: SyntheticEvent) => {
        event.preventDefault();
        onSubmit({
            description,
            type: EntryType.HealthCheck,
            date,
            specialist,
            diagnosisCodes,
            healthCheckRating,
        });
        setDescription('');
        setType('');
        setDate('');
        setSpecialist('');
        setDiagnosisCodes([]);
        setHealthCheckRating(0);
    };

    const addHospitalEntry = (event: SyntheticEvent) => {
        event.preventDefault();
        onSubmit({
            description,
            type: EntryType.Hospital,
            date,
            specialist,
            diagnosisCodes,
            discharge: { date: dischargeDate, criteria: dischargeCriteria },
        });
        setDescription('');
        setType('');
        setDate('');
        setSpecialist('');
        setDiagnosisCodes([]);
        setDischargeCriteria('');
        setDischargeDate('');
    };

    const addOccupationalHealthcareEntry = (event: SyntheticEvent) => {
        event.preventDefault();
        onSubmit({
            description,
            type: EntryType.OccupationalHealthcare,
            date,
            specialist,
            diagnosisCodes,
            employerName,
            sickLeave: {
                endDate: sickLeaveEndDate,
                startDate: sickLeaveStartDate,
            },
        });
        setDescription('');
        setType('');
        setDate('');
        setSpecialist('');
        setDiagnosisCodes([]);
        setSickLeaveEndDate('');
        setSickLeaveStartDate('');
        setEmployerName('');
    };

    const handleDiagnosisChange = (
        event: SelectChangeEvent<typeof diagnosisCodes>
    ) => {
        const {
            target: { value },
        } = event;
        setDiagnosisCodes(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value
        );
    };

    return (
        <div>
            <form>
                <InputLabel style={{ marginTop: 20 }}>
                    Select type of entry (Fields marked with * are mandatory)
                </InputLabel>
                <Select
                    label="Type"
                    fullWidth
                    value={type}
                    onChange={onTypeChange}
                >
                    {typeOptions.map((option) => (
                        <MenuItem key={option.label} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </form>
            {type === 'HealthCheck' && (
                <div>
                    <form onSubmit={addHealthCheckEntry}>
                        <InputLabel style={{ marginTop: 20 }}>
                            Description*:
                        </InputLabel>
                        <TextField
                            fullWidth
                            value={description}
                            onChange={({ target }) =>
                                setDescription(target.value)
                            }
                        />
                        <InputLabel style={{ marginTop: 20 }}>Date*</InputLabel>
                        <TextField
                            fullWidth
                            type="date"
                            value={date}
                            onChange={({ target }) => setDate(target.value)}
                        />
                        <InputLabel style={{ marginTop: 20 }}>
                            Specialist*
                        </InputLabel>
                        <TextField
                            fullWidth
                            value={specialist}
                            onChange={({ target }) =>
                                setSpecialist(target.value)
                            }
                        />
                        <InputLabel style={{ marginTop: 20 }}>
                            Select diagnosis
                        </InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            fullWidth
                            value={diagnosisCodes}
                            onChange={handleDiagnosisChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {diagnosis.map((diagnose) => (
                                <MenuItem
                                    key={diagnose.code}
                                    value={diagnose.code}
                                >
                                    <Checkbox
                                        checked={
                                            diagnosisCodes.indexOf(
                                                diagnose.code
                                            ) > -1
                                        }
                                    />
                                    <ListItemText primary={diagnose.name} />
                                </MenuItem>
                            ))}
                        </Select>
                        <InputLabel style={{ marginTop: 20 }}>
                            Rate the health status*
                        </InputLabel>
                        <Select
                            fullWidth
                            value={healthCheckRating}
                            onChange={({ target }) =>
                                setHealthCheckRating(target.value as number)
                            }
                        >
                            {ratingOptions.map((option) => (
                                <MenuItem
                                    key={option.label}
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <Grid>
                            <Grid item>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    style={{ float: 'left' }}
                                    type="button"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    style={{
                                        float: 'right',
                                    }}
                                    type="submit"
                                    variant="contained"
                                >
                                    Add
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            )}
            {type === 'Hospital' && (
                <div>
                    <form onSubmit={addHospitalEntry}>
                        <InputLabel style={{ marginTop: 20 }}>
                            Description*:
                        </InputLabel>
                        <TextField
                            fullWidth
                            value={description}
                            onChange={({ target }) =>
                                setDescription(target.value)
                            }
                        />
                        <InputLabel style={{ marginTop: 20 }}>Date*</InputLabel>
                        <TextField
                            fullWidth
                            type="date"
                            value={date}
                            onChange={({ target }) => setDate(target.value)}
                        />
                        <InputLabel style={{ marginTop: 20 }}>
                            Specialist*
                        </InputLabel>
                        <TextField
                            fullWidth
                            value={specialist}
                            onChange={({ target }) =>
                                setSpecialist(target.value)
                            }
                        />
                        <InputLabel style={{ marginTop: 20 }}>
                            Select diagnosis
                        </InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            fullWidth
                            value={diagnosisCodes}
                            onChange={handleDiagnosisChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {diagnosis.map((diagnose) => (
                                <MenuItem
                                    key={diagnose.code}
                                    value={diagnose.code}
                                >
                                    <Checkbox
                                        checked={
                                            diagnosisCodes.indexOf(
                                                diagnose.code
                                            ) > -1
                                        }
                                    />
                                    <ListItemText primary={diagnose.name} />
                                </MenuItem>
                            ))}
                        </Select>

                        <InputLabel style={{ marginTop: 20 }}>
                            Date of discharge from hospital*
                        </InputLabel>
                        <TextField
                            fullWidth
                            type="date"
                            value={dischargeDate}
                            onChange={({ target }) =>
                                setDischargeDate(target.value)
                            }
                        />
                        <InputLabel style={{ marginTop: 20 }}>
                            Criteria for discharge from hospital*
                        </InputLabel>
                        <TextField
                            fullWidth
                            value={dischargeCriteria}
                            onChange={({ target }) =>
                                setDischargeCriteria(target.value)
                            }
                        />
                        <Grid>
                            <Grid item>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    style={{ float: 'left' }}
                                    type="button"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    style={{
                                        float: 'right',
                                    }}
                                    type="submit"
                                    variant="contained"
                                >
                                    Add
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            )}
            {type === 'OccupationalHealthcare' && (
                <div>
                    <form onSubmit={addOccupationalHealthcareEntry}>
                        <InputLabel style={{ marginTop: 20 }}>
                            Description*:
                        </InputLabel>
                        <TextField
                            fullWidth
                            value={description}
                            onChange={({ target }) =>
                                setDescription(target.value)
                            }
                        />
                        <InputLabel style={{ marginTop: 20 }}>Date*</InputLabel>
                        <TextField
                            fullWidth
                            type="date"
                            value={date}
                            onChange={({ target }) => setDate(target.value)}
                        />
                        <InputLabel style={{ marginTop: 20 }}>
                            Specialist*
                        </InputLabel>
                        <TextField
                            fullWidth
                            value={specialist}
                            onChange={({ target }) =>
                                setSpecialist(target.value)
                            }
                        />
                        <InputLabel style={{ marginTop: 20 }}>
                            Select diagnosis
                        </InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            fullWidth
                            value={diagnosisCodes}
                            onChange={handleDiagnosisChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {diagnosis.map((diagnose) => (
                                <MenuItem
                                    key={diagnose.code}
                                    value={diagnose.code}
                                >
                                    <Checkbox
                                        checked={
                                            diagnosisCodes.indexOf(
                                                diagnose.code
                                            ) > -1
                                        }
                                    />
                                    <ListItemText primary={diagnose.name} />
                                </MenuItem>
                            ))}
                        </Select>
                        <InputLabel style={{ marginTop: 20 }}>
                            Employer*
                        </InputLabel>
                        <TextField
                            fullWidth
                            value={employerName}
                            onChange={({ target }) =>
                                setEmployerName(target.value)
                            }
                        />
                        <InputLabel style={{ marginTop: 20 }}>
                            Startdate of sickleave
                        </InputLabel>
                        <TextField
                            fullWidth
                            type="date"
                            value={sickLeaveStartDate}
                            onChange={({ target }) =>
                                setSickLeaveStartDate(target.value)
                            }
                        />
                        <InputLabel style={{ marginTop: 20 }}>
                            Enddate of sickleave
                        </InputLabel>
                        <TextField
                            fullWidth
                            type="date"
                            value={sickLeaveEndDate}
                            onChange={({ target }) =>
                                setSickLeaveEndDate(target.value)
                            }
                        />
                        <Grid>
                            <Grid item>
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    style={{ float: 'left' }}
                                    type="button"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    style={{
                                        float: 'right',
                                    }}
                                    type="submit"
                                    variant="contained"
                                >
                                    Add
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AddEntryForm;
