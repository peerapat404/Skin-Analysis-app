const questions = [
    {
        question: "How would you describe the shine of your skin throughout the day?",
        options: [
            { text: "shiny T-zone, but dry around the cheeks", skinType: "combination" },
            { text: "shiny all over", skinType: "oily" },
            { text: "rough or flaky everywhere", skinType: "dry" },
            { text: "get more stinging than shine", skinType: "sensitive" },
            { text: "not shine but not dry", skinType: "normal" }
        ]
    },
    {
        question: "How often do you need to reapply moisturizer?",
        options: [
            { text: "frequently, my skin feels dry", skinType: "dry" },
            { text: "rarely, my skin stays shiny", skinType: "oily" },
            { text: "only on some parts of my face", skinType: "combination" },
            { text: "have to use special products due to sensitivity", skinType: "sensitive" },
            { text: "not at all, my skin feels comfortable", skinType: "normal" }
        ]
    },
    {
        question: "How does your skin feel after washing your face and wait for 30 mins?",
        options: [
            { text: "itchy and a little bit dry", skinType: "dry" },
            { text: "clean for now, but the oil is coming soon", skinType: "oily" },
            { text: "Different reactions in different areas", skinType: "combination" },
            { text: "itching, or irritation", skinType: "sensitive" },
            { text: "clean and balanced", skinType: "normal" }
        ]
    }
];

const el = {};

let currentQuestionIndex = 0;
let score = { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 0};

/// Prepare the handlers for the elements on the page
function prepareHandlers() {
    el.question = document.querySelector("#question");
    el.options = document.querySelector("#options");
    el.nextBtn = document.querySelector("#next");
    el.backBtn = document.querySelector("#back");
    el.result = document.querySelector("#result");
    el.redoBtn = document.querySelector("#redo");
    el.predefinedRoutinesBtn = document.querySelector("#predefinedRoutinesBtn");
}
prepareHandlers();

/// Add event listeners to the elements
function showQuestion() {
    let q = questions[currentQuestionIndex];
    el.question.textContent = q.question;
    el.options.textContent = ""; 

    q.options.forEach(option => {
        let btn = document.createElement("div");
        btn.classList.add("option");
        btn.textContent = option.text;
        btn.onclick = () => selectAnswer(option.skinType);
        el.options.appendChild(btn);
    });

    el.backBtn.style.display = currentQuestionIndex > 0 ? "block" : "none";
    el.nextBtn.style.display = "none";
}

// Function to handle the selection of an answer
function selectAnswer(skinType) {
    score[skinType]++;
    el.nextBtn.style.display = "block";
}

el.nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
});

el.backBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
});

el.redoBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 0 };
    el.result.style.display = "none";
    el.redoBtn.style.display = "none";
    el.predefinedRoutinesBtn.style.display = "none";
    showQuestion();
});

// Function to display the result based on the scores
function showResult() {
    let bestSkinType = Object.keys(score).reduce((a, b) => score[a] > score[b] ? a : b);
    el.result.textContent = `Your skin type is: ${bestSkinType.charAt(0).toUpperCase() + bestSkinType.slice(1).toLowerCase()}`;
    el.result.style.display = "block";
    el.redoBtn.style.display = "block";
    el.predefinedRoutinesBtn.style.display = "block";
    el.nextBtn.style.display = "none";
    el.backBtn.style.display = "none";

    el.predefinedRoutinesBtn.onclick = () => {
        window.location.href = "/routines.html";
    }
    updateUserSkinType(bestSkinType);

      // Store the skin type locally for routines filtering
    localStorage.setItem("skin_type", bestSkinType);
}

// Function to load a sample user data from the server
async function loadUser() {
    try {
        const response = await fetch("users/:id");
        if (response.ok) {
            user = await response.json();
        } 
        localStorage.setItem("user-id", user.id);
    } catch (error) {
        console.error("Error loading user:", error);
    }
}

// Function to update the user's skin type in the database
async function updateUserSkinType(skinType) {
    try {
        const payload = { 
            id: localStorage.getItem("user-id"), 
            skin_type: skinType 
        };
        console.log('Payload', payload);
      
        const response = await fetch('/users/skin-type', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        console.log('Response', response);
        if (response.ok) {
            const updatedUser = await response.json();
            console.log("User skin type updated:", updatedUser);
        }
    } catch (error) {
        console.error("Error updating user skin type:", error);
    }
}

loadUser();
showQuestion();
