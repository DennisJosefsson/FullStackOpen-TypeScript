import {
    Gender,
    newPatient,
    EntryWithoutId,
    Diagnosis,
    HealthCheckRating,
    EntryFields,
    EntryType,
} from '../types';

const isCheckRating = (healthCheckRating: number): boolean => {
    return Object.values(HealthCheckRating).includes(healthCheckRating);
};

const parseHealthCheckRating = (
    healthCheckRating: unknown
): HealthCheckRating => {
    if (
        healthCheckRating == undefined ||
        !isNumber(healthCheckRating) ||
        !isCheckRating(healthCheckRating)
    ) {
        throw new Error(
            'Incorrect or missing healthCheckRating: ' + healthCheckRating
        );
    }
    return healthCheckRating as HealthCheckRating;
};

const isString = (text: unknown): text is string => {
    return typeof text === 'string' || text instanceof String;
};

const isNumber = (num: unknown): num is number => {
    return typeof num === 'number' || num instanceof Number;
};

const parseString = (stringParam: unknown): string => {
    if (!isString(stringParam)) {
        throw new Error('Incorrect string: ' + stringParam);
    }
    return stringParam;
};

const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
};

const parseDate = (dateOfBirth: unknown): string => {
    if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
        throw new Error('Incorrect date: ' + dateOfBirth);
    }
    return dateOfBirth;
};

const isGender = (param: string): param is Gender => {
    return Object.values(Gender)
        .map((v) => v.toString())
        .includes(param);
};

const parseGender = (gender: unknown): Gender => {
    if (!isString(gender) || !isGender(gender)) {
        throw new Error('Incorrect gender: ' + gender);
    }
    return gender;
};

const isType = (param: string): param is EntryType => {
    return Object.values(EntryType)
        .map((v) => v.toString())
        .includes(param);
};

const parseType = (type: unknown): EntryType => {
    if (!type || !isString(type) || !isType(type)) {
        throw new Error('Incorrect type: ' + type);
    }
    return type;
};

const parseDescription = (description: unknown): string => {
    if (!description || !isString(description)) {
        throw new Error('Incorrect description: ' + description);
    }
    return description;
};

const parseSpecialist = (specialist: unknown): string => {
    if (!specialist || !isString(specialist)) {
        throw new Error('Incorrect specialist: ' + specialist);
    }
    return specialist;
};

const parseEmployerName = (employerName: unknown): string => {
    if (!employerName || !isString(employerName)) {
        throw new Error('Incorrect employerName: ' + employerName);
    }
    return employerName;
};

const parseDischarge = (
    object: unknown
): { date: string; criteria: string } => {
    if (
        !object ||
        typeof object !== 'object' ||
        !('date' in object) ||
        !('criteria' in object)
    ) {
        throw new Error(
            'Wrong format, discharge date and criteria must be included'
        );
    } else if (
        !isString(object.date) ||
        !isDate(object.date) ||
        !isString(object.criteria)
    ) {
        throw new Error('Wrong format, discharge');
    }
    return { date: object.date, criteria: object.criteria };
};

const parseSickLeave = (
    object: unknown
): { endDate: string; startDate: string } | undefined => {
    if (
        !object ||
        typeof object !== 'object' ||
        !('endDate' in object) ||
        !('startDate' in object) ||
        !object.startDate ||
        !object.endDate
    ) {
        return undefined;
    } else if (
        !isString(object.endDate) ||
        !isDate(object.endDate) ||
        !isString(object.startDate) ||
        !isDate(object.startDate)
    ) {
        throw new Error('Wrong format, sickLeave');
    }
    return { endDate: object.endDate, startDate: object.startDate };
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis['code']> => {
    if (
        !object ||
        typeof object !== 'object' ||
        !('diagnosisCodes' in object)
    ) {
        return [] as Array<Diagnosis['code']>;
    }

    return object.diagnosisCodes as Array<Diagnosis['code']>;
};

export const validatedPatient = (object: unknown): newPatient => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }

    if (
        'name' in object &&
        'dateOfBirth' in object &&
        'ssn' in object &&
        'gender' in object &&
        'occupation' in object
    ) {
        const validPatientData: newPatient = {
            name: parseString(object.name),
            dateOfBirth: parseDate(object.dateOfBirth),
            ssn: parseString(object.ssn),
            gender: parseGender(object.gender),
            occupation: parseString(object.occupation),
            entries: [],
        };
        return validPatientData;
    }

    throw new Error('Incorrect data: some fields are missing');
};

export const validatedEntry = (object: EntryFields): EntryWithoutId => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }
    parseType(object.type);
    if (
        'description' in object &&
        'date' in object &&
        'specialist' in object &&
        'type' in object
    ) {
        const validEntry = {
            description: parseDescription(object.description),
            date: parseDate(object.date),
            specialist: parseSpecialist(object.specialist),
            diagnosisCodes: parseDiagnosisCodes(object),
        };

        switch (object.type) {
            case 'HealthCheck':
                return {
                    ...validEntry,
                    type: 'HealthCheck',
                    healthCheckRating: parseHealthCheckRating(
                        object.healthCheckRating
                    ),
                };
            case 'Hospital':
                return {
                    ...validEntry,
                    type: 'Hospital',
                    discharge: parseDischarge({
                        date: object.discharge?.date,
                        criteria: object.discharge?.criteria,
                    }),
                };
            case 'OccupationalHealthcare':
                return {
                    ...validEntry,
                    type: 'OccupationalHealthcare',
                    employerName: parseEmployerName(object.employerName),
                    sickLeave: parseSickLeave({
                        endDate: object.sickLeave?.endDate,
                        startDate: object.sickLeave?.startDate,
                    }),
                };
            default:
                throw new Error(
                    `Unhandled type entry: ${JSON.stringify(object.type)}`
                );
        }
    } else {
        throw new Error('Something went wrong, wrong formatted entry');
    }
};
