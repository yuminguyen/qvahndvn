let questions = [];
let currentQuestion = 0;
let score = 0;  //Biến lưu số đáp án đúng
let currentPart = 2; //Theo dõi phần câu hỏi
let currentTopic = '';

// Tải file JSON đầu tiên
document.addEventListener('DOMContentLoaded', function () {
    fetchQuestion('assets/question-KTNN.json');
});

function fetchQuestion(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            questions = data;
            // shuffleQuestions();
            // displayQuestion();
            currentTopic = questions[0].topic;
            console.log('Questions fetched:', questions); // Kiểm tra dữ liệu có tải thành công không
            displayTopic();
        })
        .catch(error => console.error('Error fetching questions:', error));
}


// Hàm xáo trộn mảng
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Xáo trộn thứ tự các câu hỏi
function shuffleQuestions() {
    shuffle(questions);
}

//Hiển thị tên chuyên đề
function displayTopic() {
    const questionContainer = document.querySelector('.quiz-container');
    questionContainer.innerHTML = `
        <h1>${currentTopic}</h1>
        <button id="start-btn">Start</button>
    `;

    console.log(document.getElementById('start-btn')); // Kiểm tra xem nút đã được thêm chưa

    // Gán sự kiện onclick vào container để bắt đầu quiz
    const startButton = document.getElementById('start-btn');
    if (startButton) {
        startButton.onclick = startQuiz;
    } else {
        console.error("Start button not found in the DOM.");
    }
}


//Bắt đầu hiển thị câu hỏi
function startQuiz() {
    // Hủy bỏ nội dung trước đó trong container
    const questionContainer = document.querySelector('.quiz-container');
    questionContainer.innerHTML = `
        <h1 id="question"></h1>
        <div id="choices"></div>
        <button class="next-btn" onclick="nextQuestion()">Next</button>
    `;

    // Xáo trộn câu hỏi và hiển thị câu hỏi đầu tiên
    shuffleQuestions();
    displayQuestion();

    // Gán sự kiện onclick cho nút Next để chuyển câu hỏi
    document.getElementById('next-btn').onclick = nextQuestion;
}

// Hiển thị câu hỏi
function displayQuestion() {
    if (currentQuestion >= questions.length) {
        if (currentPart === 2) {
            alert(`Hoàn thành phần 2! Bạn đã trả lời đúng ${score}/${questions.length} câu.`)
            currentPart = 1;
            currentQuestion = 0;
            score = 0;
            fetchQuestion('assets/question-KTC.json');
        } else {
            //Nếu đã xong phần 2, kết thúc chương trình
            alert(`Hoàn thành phần 1! Bạn đã trả lời đúng ${score}/${questions.length} câu.`);
        }
        return;
    }

    const q = questions[currentQuestion];
    document.getElementById("question").innerText = q.question;
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = '';
    
    q.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.innerText = choice;
        button.onclick = () => checkAnswer(index, button);
        choicesDiv.appendChild(button);
    });
}

// Kiểm tra đáp án
function checkAnswer(selectedIndex, button) {
    const correctIndex = questions[currentQuestion].correct;
    if (selectedIndex === correctIndex) {
        button.classList.add('correct');
        score++;
    } else {
        button.classList.add('incorrect');
    }

    // Tô màu đáp án đúng và khóa tất cả các nút
    document.querySelectorAll('#choices button').forEach(btn => {
        btn.classList.add('disabled');
        if (questions[currentQuestion].choices.indexOf(btn.innerText) === correctIndex) {
            btn.classList.add('correct');
        }
    });
}

// Chuyển sang câu hỏi tiếp theo
function nextQuestion() {
    currentQuestion++;
    displayQuestion();

}
