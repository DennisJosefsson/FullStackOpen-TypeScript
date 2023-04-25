import { useEffect, useState } from 'react';
import { DiaryEntry } from './types';
import { getDiaries, postNewDiary } from './services/diaryService';
import axios, { AxiosError } from 'axios';

function App() {
    const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        getDiaries()
            .then((data) => setDiaries(data))
            .catch((error: Error | AxiosError) => {
                if (axios.isAxiosError(error)) {
                    setErrorMessage(error.message);
                    setTimeout(() => {
                        setErrorMessage('');
                    }, 5000);
                }
            });
    }, []);

    const Content = ({ diaries }: { diaries: DiaryEntry[] }) => {
        return (
            <div>
                <h2>Diary entries</h2>
                {diaries.map((diary) => {
                    return (
                        <div key={diary.id}>
                            <h4>{diary.date} </h4>
                            <p>
                                Visibility: {diary.visibility}
                                <br />
                                Weather: {diary.weather}
                                <br />
                                Comment: {diary.comment}
                            </p>
                        </div>
                    );
                })}
            </div>
        );
    };

    const Notification = ({ errorMessage }: { errorMessage: string }) => {
        return <div style={{ color: 'red' }}>{errorMessage}</div>;
    };

    const DiaryForm = () => {
        const [date, setDate] = useState('');
        const [visibility, setVisibility] = useState('');
        const [weather, setWeather] = useState('');
        const [comment, setComment] = useState('');

        const handleSubmit = (event: React.SyntheticEvent) => {
            event.preventDefault();
            const diaryEntry = { date, visibility, weather, comment };
            postNewDiary(diaryEntry)
                .then((data) => setDiaries([...diaries, data]))
                .catch((error: Error | AxiosError) => {
                    if (axios.isAxiosError(error)) {
                        setErrorMessage(error.response?.data);
                        setTimeout(() => {
                            setErrorMessage('');
                        }, 5000);
                    }
                });

            setDate('');
            setVisibility('');
            setWeather('');
            setComment('');
        };

        return (
            <div>
                <h3>Add new diary entry</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        Date:
                        <input
                            type="date"
                            name="date"
                            value={date}
                            onChange={(event) => setDate(event.target.value)}
                        />
                    </div>
                    <div>
                        Visibility: Great:
                        <input
                            type="radio"
                            name="visibility"
                            value={visibility}
                            onChange={() => setVisibility('great')}
                        />
                        Good:
                        <input
                            type="radio"
                            name="visibility"
                            value={visibility}
                            onChange={() => setVisibility('good')}
                        />
                        Ok:
                        <input
                            type="radio"
                            name="visibility"
                            value={visibility}
                            onChange={() => setVisibility('ok')}
                        />
                        Poor:
                        <input
                            type="radio"
                            name="visibility"
                            value={visibility}
                            onChange={() => setVisibility('poor')}
                        />
                    </div>
                    <div>
                        Weather: Sunny:
                        <input
                            type="radio"
                            name="weather"
                            value={weather}
                            onChange={() => setWeather('sunny')}
                        />
                        Rainy:
                        <input
                            type="radio"
                            name="weather"
                            value={weather}
                            onChange={() => setWeather('rainy')}
                        />
                        Cloudy:
                        <input
                            type="radio"
                            name="weather"
                            value={weather}
                            onChange={() => setWeather('cloudy')}
                        />
                        Stormy:
                        <input
                            type="radio"
                            name="weather"
                            value={weather}
                            onChange={() => setWeather('stormy')}
                        />
                        Windy:
                        <input
                            type="radio"
                            name="weather"
                            value={weather}
                            onChange={() => setWeather('windy')}
                        />
                    </div>
                    <div>
                        Comment:
                        <textarea
                            value={comment}
                            name="comment"
                            onChange={(event) => setComment(event.target.value)}
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    };

    return (
        <div>
            <Notification errorMessage={errorMessage} />
            <DiaryForm />
            <Content diaries={diaries} />
        </div>
    );
}

export default App;
