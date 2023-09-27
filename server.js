const express = require('express');
const app = express();
const cors = require('cors');
const port = 8001;

app.use(express.json());
app.use(cors());

let startTime;

function formatTime(nanoseconds) {
    const seconds = Math.floor(nanoseconds / 1e9);
    nanoseconds -= seconds * 1e9;
    const deciseconds = Math.floor(nanoseconds / 1e8);
    nanoseconds -= deciseconds * 1e8;
    const centiseconds = Math.floor(nanoseconds / 1e7);
    nanoseconds -= centiseconds * 1e7;
    const milliseconds = Math.floor(nanoseconds / 1e6);
    nanoseconds -= milliseconds * 1e6;
    const microseconds = Math.floor(nanoseconds / 1e3);
    nanoseconds -= microseconds * 1e3;

    return `${seconds} second ${deciseconds} deciseconds ${centiseconds} centiseconds ${milliseconds} milliseconds ${microseconds} microseconds ${nanoseconds} nanoseconds`;
}

app.use(express.static('public'));

app.post('/api/start-timer', (req, res) => {
    try {
        if (!startTime) {
            startTime = process.hrtime();
            res.json({ message: 'Timer started' });
        } else {
            res.status(400).json({ message: 'Timer is already running' });
        }
    } catch (error) {
        console.error('Error starting timer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/stop-timer', (req, res) => {
    try {
        if (!startTime) {
            res.status(400).json({ message: 'Timer is not running' });
            return;
        }

        const now = process.hrtime(startTime);
        const nanosecondsPassed = now[0] * 1e9 + now[1];
        startTime = undefined;
        const formattedTime = formatTime(nanosecondsPassed);
        res.json({ message: 'Timer stopped', timeElapsed: formattedTime });
    } catch (error) {
        console.error('Error stopping timer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
