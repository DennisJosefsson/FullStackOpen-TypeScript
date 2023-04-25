import { Entry, Diagnosis } from '../../types';
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Divider,
} from '@mui/material';

const EntryList = ({
    entries,
    diagnosis,
}: {
    entries: Entry[] | undefined;
    diagnosis: Diagnosis[];
}) => {
    const assertNever = (value: never): never => {
        throw new Error(
            `Unhandled discriminated union member: ${JSON.stringify(value)}`
        );
    };

    const findByDiagnoseCode = (code: string) => {
        const diagnose = diagnosis.find((item) => item.code === code);
        return diagnose?.name;
    };

    return (
        <div>
            {entries?.map((entry) => {
                switch (entry.type) {
                    case 'HealthCheck':
                        return (
                            <div
                                key={entry.id}
                                style={{
                                    borderRadius: '25px',
                                    border: '1px solid #000000',
                                    padding: '20px',
                                    marginTop: '5px',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    {entry.date} {entry.description}
                                </Typography>
                                <Typography paragraph>
                                    Health rating: {entry.healthCheckRating}
                                    <br />
                                    Specialist: {entry.specialist}
                                </Typography>
                            </div>
                        );
                    case 'Hospital':
                        return (
                            <div
                                key={entry.id}
                                style={{
                                    borderRadius: '25px',
                                    border: '1px solid #000000',
                                    padding: '20px',
                                    marginTop: '5px',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    {entry.date} {entry.description}
                                </Typography>
                                <List>
                                    {entry.diagnosisCodes?.map((code) => {
                                        return (
                                            <ListItem key={code}>
                                                <ListItemText>
                                                    {code}:{' '}
                                                    {findByDiagnoseCode(code)}
                                                </ListItemText>
                                                <Divider />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                                <Typography paragraph>
                                    Discharge: {entry.discharge.date}{' '}
                                    {entry.discharge.criteria}
                                    <br />
                                    Specialist: {entry.specialist}
                                </Typography>
                            </div>
                        );
                    case 'OccupationalHealthcare':
                        return (
                            <div
                                key={entry.id}
                                style={{
                                    borderRadius: '25px',
                                    border: '1px solid #000000',
                                    padding: '20px',
                                    marginTop: '5px',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    {entry.date} {entry.description}
                                </Typography>
                                <List>
                                    {entry.diagnosisCodes?.map((code) => {
                                        return (
                                            <ListItem key={code}>
                                                <ListItemText>
                                                    {code}:{' '}
                                                    {findByDiagnoseCode(code)}
                                                </ListItemText>
                                                <Divider />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                                <Typography paragraph>
                                    Sickleave: {entry.sickLeave?.startDate} -{' '}
                                    {entry.sickLeave?.endDate}
                                    <br />
                                    Specialist: {entry.specialist}
                                    <br />
                                    Employer: {entry.employerName}
                                </Typography>
                            </div>
                        );
                    default:
                        return assertNever(entry);
                }
            })}
        </div>
    );
};

export default EntryList;
