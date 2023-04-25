import express from 'express';
import cors from 'cors';
import diagnoseRoute from './routes/diagnoses';
import patientRoute from './routes/patients';
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/diagnosis', diagnoseRoute);
app.use('/api/patients', patientRoute);

const PORT = 3001;

app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
