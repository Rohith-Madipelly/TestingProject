let selectedAnswer = "";

function showQuiz() {
    // Hide the video
    const video = document.getElementById('video');
    video.style.display = 'none';

    // Show the quiz form and timer
    const quizForm = document.getElementById('quiz-form');
    const display = document.getElementById('display');

    quizForm.style.display = 'block';
    display.style.display = 'block';

    // Start the timer by hitting the API
    startTimer();
}

function startTimer() {
    // Check if the timer is already running
    fetch('http://localhost:8001/api/start-timer', {
        method: 'POST',
    })
    .then(response => {
        if (response.status === 400) {
            // Timer is already running
            return response.json();
        }
        return response.json();
    })
    .then(data => {
        if (data.message === 'Timer started') {
            console.log(data.message);
        } else if (data.message === 'Timer is already running') {
            alert('The timer is already running. Please wait for it to complete.');
        }
    })
    .catch(error => {
        console.error('Error starting timer:', error);
    });
}

function submitAnswer() {
    if (selectedAnswer === "") {
        alert("Please select an answer before submitting.");
        return;
    }

    // Check if the selected answer is correct
    const correctAnswer = 'two';
    const isCorrect = selectedAnswer === correctAnswer;

    // Construct the alert message for incorrect answer
    if (!isCorrect) {
        alert('Incorrect answer......');
    }

    // Make a POST request to stop the timer
    fetch('http://localhost:8001/api/stop-timer', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message); // Log the server's response message

        // If the answer is correct, display the correct message
        if (isCorrect) {
            if (data.timeElapsed) {
                alert(`You selected: ${selectedAnswer}\nYour answer is correct!\nTimer Elapsed: ${data.timeElapsed}`);
            } else {
                alert(`You selected: ${selectedAnswer}\nYour answer is correct!\nTimer stopped, but no time elapsed data received.`);
            }
        }
    })
    .catch(error => {
        console.error('Error stopping timer:', error);
        alert('There was an error stopping the timer. Please try again later.');
    });

    // Hide the quiz form and timer display
    const quizForm = document.getElementById('quiz-form');
    const display = document.getElementById('display');
    quizForm.style.display = 'none';
    display.style.display = 'none';
}


// Event listener for radio button clicks
const radioButtons = document.querySelectorAll('input[name="answer"]');
radioButtons.forEach(radio => {
    radio.addEventListener('click', (event) => {
        selectedAnswer = event.target.value;
    });
});
