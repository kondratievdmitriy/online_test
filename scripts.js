let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let wrongAnswers = [];
let answerCount = 1;

function addAnswer() {
    answerCount++;
    const answersContainer = document.getElementById('answers-container');
    const label = document.createElement('label');
    label.setAttribute('for', `answer-${answerCount}`);
    label.innerText = `Ответ ${answerCount}:`;
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `answer-${answerCount}`;
    answersContainer.appendChild(label);
    answersContainer.appendChild(input);
}

function addQuestion() {
    const questionText = document.getElementById('question').value;
    const answers = [];
    for (let i = 1; i <= answerCount; i++) {
        const answerText = document.getElementById(`answer-${i}`).value;
        if (answerText) {
            answers.push(answerText);
        }
    }
    const rightAnswer = parseInt(document.getElementById('right-answer').value);

    if (questionText && answers.length > 0 && rightAnswer > 0 && rightAnswer <= answers.length) {
        questions.push({
            question: questionText,
            answers: answers,
            right_answer: rightAnswer
        });

        // Clear inputs
        document.getElementById('question').value = '';
        const answersContainer = document.getElementById('answers-container');
        while (answersContainer.firstChild) {
            answersContainer.removeChild(answersContainer.firstChild);
        }
        answerCount = 1;
        const initialLabel = document.createElement('label');
        initialLabel.setAttribute('for', 'answer-1');
        initialLabel.innerText = 'Ответ 1:';
        const initialInput = document.createElement('input');
        initialInput.type = 'text';
        initialInput.id = 'answer-1';
        answersContainer.appendChild(initialLabel);
        answersContainer.appendChild(initialInput);
        document.getElementById('right-answer').value = '';
    }
}

function finishTest() {
    document.getElementById('create-test-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    displayQuestion();
}

function displayQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';

    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];

        const questionElement = document.createElement('div');
        questionElement.className = 'question';
        questionElement.innerText = question.question;
        quizContainer.appendChild(questionElement);

        const answersElement = document.createElement('div');
        answersElement.className = 'answers';
        question.answers.forEach((answer, index) => {
            const answerElement = document.createElement('button');
            answerElement.innerText = `${index + 1}. ${answer}`;
            answerElement.onclick = () => checkAnswer(index + 1);
            answersElement.appendChild(answerElement);
        });
        quizContainer.appendChild(answersElement);
    } else {
        displayResult();
    }
}

function checkAnswer(selectedAnswer) {
    const question = questions[currentQuestionIndex];
    if (selectedAnswer === question.right_answer) {
        score++;
    } else {
        wrongAnswers.push({
            question: question.question,
            correctAnswer: question.answers[question.right_answer - 1]
        });
    }
    currentQuestionIndex++;
    displayQuestion();
}

function displayResult() {
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.getElementById('result-container');
    const scoreElement = document.getElementById('score');
    const resultElement = document.getElementById('result');
    const wrongAnswersElement = document.getElementById('wrong-answers');

    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    const totalQuestions = questions.length;
    const percentage = (score / totalQuestions) * 100;

    scoreElement.innerText = `Верных ответов: ${score} из ${totalQuestions}`;
    resultElement.innerText = `Процент правильных ответов: ${percentage.toFixed(2)}%`;

    if (wrongAnswers.length > 0) {
        wrongAnswersElement.innerHTML = 'Исправление ошибок:<br>';
        wrongAnswers.forEach(item => {
            wrongAnswersElement.innerHTML += `${item.question} - Правильный ответ: ${item.correctAnswer}<br>`;
        });
    }
}

function retryTest() {
    currentQuestionIndex = 0;
    score = 0;
    wrongAnswers = [];
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    displayQuestion();
}

function clearLocalStorage() {
    localStorage.removeItem('questions');
    questions = [];
    alert('Локальное хранилище очищено!');
}

window.onload = () => {
    // Load existing questions from local storage if available
    const savedQuestions = localStorage.getItem('questions');
    if (savedQuestions) {
        questions = JSON.parse(savedQuestions);
    }
};

window.onbeforeunload = () => {
    // Save questions to local storage
    localStorage.setItem('questions', JSON.stringify(questions));
};
