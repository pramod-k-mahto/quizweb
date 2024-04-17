
const quiz = document.getElementById('quiz');
const answerEls = document.querySelectorAll('.answer');
const questionEl = document.getElementById('question');
const aText = document.getElementById('a_text');
const bText = document.getElementById('b_text');
const cText = document.getElementById('c_text');
const dText = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
let currentQuiz = 0;
let score = 0;
let correctAnswer = '';
loadQuiz();

let quizData; // Store quiz data globally to access it later
async function getQuiz() {
    try {
        let response = await fetch("http://localhost:3000/quiz");
        quizData = await response.json();
        console.log("quizData", quizData)
        if (quizData && quizData.length > 0) {
            displayQuestions(quizData);
        } else {
            console.error("Quiz data is empty or undefined.");
        }
    } catch (error) {
        console.error("Error fetching quiz:", error);
    }
}



async function fetchQuizData() {
    try {
        let response = await fetch("http://localhost:3000/quiz");
        response = await response.json();

        if (response.status === 429) {
            console.error('Rate limit exceeded. Please wait before making additional requests.');
            return null;
        }


        return response;
    } catch (error) {
        console.error('Error fetching quiz data:', error);

        return null;
    }
}

async function loadQuiz() {
    try {
        const data = await fetchQuizData();
        console.log(data)
        if (data) {
            const question = data[currentQuiz].question_text;
            // console.log("question", question)

            const correctAnswerData = data[currentQuiz].correct_answer;
            // console.log("correctAnswerData", correctAnswerData)

            const incorrect_answers = data[currentQuiz].options.filter(item => item !== correctAnswerData);

            const incorrectAnswers = [...incorrect_answers];
            // console.log("incorrectAnswers", incorrectAnswers)

            const randomNumber = Math.floor(Math.random() * 4);
            incorrectAnswers.splice(randomNumber, 0, correctAnswerData);

            correctAnswer = correctAnswerData;
            questionEl.innerText = question;

            const textArray = [aText, bText, cText, dText];
            textArray.forEach((item, index) => {
                item.innerText = incorrectAnswers[index];
            });
        }
    } catch (error) {
        console.error('Error loading quiz:', error);
    }
}

function deselectAnswers() {
    answerEls.forEach(answerEl => (answerEl.checked = false));
}


//get user given answer
function getSelected() {
    let answer;
    answerEls.forEach(answerEl => {
        if (answerEl.checked) {
            const labelForAnswer = document.querySelector(`label[for="${answerEl.id}"]`);
            console.log(labelForAnswer)
            answer = labelForAnswer.textContent.trim();
            console.log(answer)
        }
    });
    return answer;
}

submitBtn.addEventListener('click', async () => {
    const selectedAnswer = getSelected();

    if (selectedAnswer) {
        if (selectedAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
            alert('You are Correct!');
            score++;
        } else {
            alert('You are wrong.');
        }

        currentQuiz++;

        if (currentQuiz < 10) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Introduce delay
            loadQuiz();
        } else {
            quiz.innerHTML = `
                <h2>You answered ${score}/10 questions correctly</h2>
                <button id="btn" onclick="location.reload()">Reload</button>
            `;
        }

        deselectAnswers();
    } else {
        alert('Please select an answer.');
    }
});

















