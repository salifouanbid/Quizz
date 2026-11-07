const root = document.getElementById("root");

// Banque de questions : "reponses" contient le numéro de la bonne option
// en commençant à 1 (1 = première proposition, 2 = deuxième, etc.).
const questions = [
    { question: "Qu'utilise-t-on pour afficher du texte en Python ?", options: ["print('Hello')", "printf('Hello')", "echo('Hello')", "display('Hello')"], reponses: 1 },
    { question: "Quel symbole utilise-t-on pour écrire un commentaire en Python ?", options: ["//", "#", "**", "&&"], reponses: 2 },
    { question: "Quelle est la bonne syntaxe pour déclarer une variable ?", options: ["my_score = 223", "my score = 223", "2my_score = 223", "++my score == 223"], reponses: 1 },
    { question: "Quelle est la nature de cette variable : var = 'Laureen' ?", options: ["integer", "string", "boolean", "list"], reponses: 2 },
    { question: "Quelle fonction permet de vérifier le type d'une variable ?", options: ["dtype()", "d_type()", "type()", "find_type()"], reponses: 3 },
    { question: "Quelle fonction permet de demander une saisie à l'utilisateur ?", options: ["scanf()", "getchar()", "input()", "type()"], reponses: 3 },
    { question: "Quel type de donnée renvoie input() par défaut ?", options: ["string", "boolean", "integer", "dictionnaire"], reponses: 1 },
    { question: "Pour récupérer un nombre avec input(), que faut-il généralement faire ?", options: ["Convertir la saisie en int ou float", "Ne rien faire", "Laisser le compilateur gérer", "Utiliser type()"], reponses: 1 },
    { question: "Quelle fonction permet de convertir une valeur en entier ?", options: ["int()", "float()", "string()", "bool()"], reponses: 1 },
    { question: "Quel opérateur réalise la division entière en Python ?", options: ["/", "//", "*", "%"], reponses: 2 },
    { question: "Quel opérateur réalise la division classique ?", options: ["/", "//", "*", "%", "**"], reponses: 1 },
    { question: "Quel opérateur permet de calculer le reste d'une division ?", options: ["/", "//", "*", "%", "**"], reponses: 4 },
    { question: "Quel opérateur permet d'élever un nombre à une puissance ?", options: ["/", "//", "*", "%", "**"], reponses: 5 },
    { question: "Quel mot-clé permet de commencer une condition en Python ?", options: ["if", "else", "else if", "elif"], reponses: 1 },
    { question: "Quel opérateur teste l'égalité entre deux valeurs ?", options: ["=", "=="], reponses: 2 },
    { question: "Quel caractère termine généralement une ligne de condition if ?", options: ["//", "==", ":", "!!"], reponses: 3 },
    { question: "Une boucle permet de répéter des instructions.", options: ["Faux", "Vrai"], reponses: 2 },
    { question: "À quoi sert principalement range() ?", options: ["À générer une suite de nombres", "À parcourir un seul nombre", "À afficher un texte", "À créer un dictionnaire"], reponses: 1 },
    { question: "Quelle boucle utilise-t-on souvent lorsque le nombre d'itérations est connu ?", options: ["for", "while", "do while"], reponses: 1 },
    { question: "Quelles valeurs prend i dans for i in range(3) ?", options: ["0, 1, 2", "1, 2, 3", "5, 4, 8"], reponses: 1 },
    { question: "Quelle fonction du module random permet de tirer un entier dans un intervalle ?", options: ["random", "random.randint", "choice", "randint sans import"], reponses: 2 },
    { question: "Une liste Python est-elle immuable ?", options: ["Vrai", "Faux", "Je ne sais pas"], reponses: 2 },
    { question: "Un tuple Python est-il immuable ?", options: ["Vrai", "Faux", "Je ne sais pas"], reponses: 1 },
    { question: "Un dictionnaire Python est composé de paires clé-valeur.", options: ["Vrai", "Faux", "Je ne sais pas"], reponses: 1 },
    { question: "Quelle méthode ajoute un élément à la fin d'une liste ?", options: [".append()", ".find()", ".sort()", ".add()"], reponses: 1 }
];

let quizQuestions = [];
let currentQuestion = 0;
let score = 0;
let answered = false;
let selectedCount = questions.length;
const ADMIN_PIN = "1234"; // À personnaliser avant de publier le site.
const STORAGE_KEY = "quizlab_custom_questions_v1";

function getAllQuestions() {
    let custom = [];
    try { custom = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
    catch (error) { custom = []; }
    return [...questions, ...custom];
}

function saveCustomQuestions(items) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        return true;
    } catch (error) {
        window.alert("Impossible d'enregistrer les questions dans ce navigateur. Vérifie l'espace de stockage disponible.");
        return false;
    }
}

function renderHome() {
    root.innerHTML = `
        <main class="app-shell">
            <header class="topbar">
                <a class="brand" href="#" aria-label="Accueil QuizLab"><span class="brand-mark">Q</span> QuizLab</a>
                <div class="topbar-actions"><span class="topbar-note"><span class="status-dot"></span> Apprendre en s'amusant</span><button class="admin-link" id="openAdmin">Administration ↗</button></div>
            </header>

            <section class="hero">
                <div class="hero-copy">
                    <span class="eyebrow"><span class="eyebrow-line"></span> TON ESPACE D'ENTRAÎNEMENT</span>
                    <h1>Teste tes connaissances.<br><span>Progresse à ton rythme.</span></h1>
                    <p class="hero-description">Des questions, des défis et une bonne dose de logique pour faire évoluer tes compétences en programmation.</p>
                    <div class="hero-actions">
                        <button class="primary-btn" id="startQuiz">Commencer le quiz <span aria-hidden="true">→</span></button>
                        <span class="duration"><span aria-hidden="true">◷</span> Environ ${Math.ceil(questions.length * 0.5)} min</span>
                    </div>
                </div>
                <div class="hero-visual" aria-hidden="true">
                    <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
                    <div class="code-card">
                        <div class="code-card-top"><span></span><span></span><span></span><small>python.py</small></div>
                        <div class="code-lines">
                            <p><i>01</i> <b class="code-purple">def</b> <strong>apprendre</strong>():</p>
                            <p><i>02</i> &nbsp;&nbsp; compétences = <em>"Python"</em></p>
                            <p><i>03</i> &nbsp;&nbsp; <b class="code-purple">return</b> progrès</p>
                            <p><i>04</i></p>
                            <p><i>05</i> <strong>apprendre</strong>() <span class="cursor">▌</span></p>
                        </div>
                        <div class="code-card-footer"><span>● ENTRAÎNEMENT ACTIF</span><span>⌘ 01</span></div>
                    </div>
                    <div class="floating-chip chip-top">✦ Curiosité</div>
                    <div class="floating-chip chip-bottom">✓ Progression</div>
                </div>
            </section>

            <section class="quiz-panel">
                <div class="section-heading">
                    <div><span class="eyebrow">CHOISIS TON PARCOURS</span><h2>Prêt à relever le défi ?</h2></div>
                    <span class="available-tag">${getAllQuestions().length} questions disponibles</span>
                </div>
                <article class="quiz-card">
                    <div class="quiz-icon">Py</div>
                    <div class="quiz-info">
                        <div class="quiz-meta"><span class="category-label">PROGRAMMATION</span><span class="level-label">DÉBUTANT</span></div>
                        <h3>Les fondamentaux de Python</h3>
                        <p>Variables, conditions, boucles, types et structures de données.</p>
                        <div class="quiz-stats"><span>▤ ${getAllQuestions().length} questions</span><span>◷ 10–15 min</span><span>◎ QCM</span></div>
                    </div>
                    <button class="card-play-btn" id="startQuizCard" aria-label="Lancer le quiz">→</button>
                </article>
                <div class="home-tip"><span>✦</span><p><strong>Un conseil :</strong> prends le temps de lire chaque question. Le but n'est pas seulement d'obtenir un bon score, mais aussi de comprendre.</p></div>
            </section>
            <footer class="footer"><span>QuizLab</span><span>Apprendre • Tester • Progresser</span></footer>
        </main>`;

    document.getElementById("startQuiz").addEventListener("click", startQuiz);
    document.getElementById("startQuizCard").addEventListener("click", startQuiz);
    document.getElementById("openAdmin").addEventListener("click", openAdmin);
}

function startQuiz() {
    quizQuestions = getAllQuestions();
    currentQuestion = 0;
    score = 0;
    renderQuestion();
}

function renderQuestion() {
    answered = false;
    const q = quizQuestions[currentQuestion];
    const progress = (currentQuestion / quizQuestions.length) * 100;

    root.innerHTML = `
        <main class="app-shell quiz-shell">
            <header class="topbar">
                <a class="brand" href="#" id="quitQuiz"><span class="brand-mark">Q</span> QuizLab</a>
                <span class="quiz-mode">QUIZ <span>•</span> PYTHON</span>
            </header>
            <section class="question-area">
                <button class="back-link" id="quitButton">← Quitter le quiz</button>
                <div class="progress-block">
                    <div class="progress-label"><span>TA PROGRESSION</span><strong>Question ${currentQuestion + 1}<small> / ${quizQuestions.length}</small></strong></div>
                    <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
                </div>
                <div class="question-card">
                    <div class="question-overline"><span class="question-number">QUESTION ${String(currentQuestion + 1).padStart(2, "0")}</span><span class="question-type">CHOIX MULTIPLE</span></div>
                    <h1>${escapeHTML(q.question)}</h1>
                    <p class="question-instruction">Sélectionne la bonne réponse parmi les propositions.</p>
                    <div class="answers-list">
                        ${q.options.map((option, index) => `
                            <button class="answer-option" data-index="${index}">
                                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                                <span class="option-text">${escapeHTML(option)}</span>
                                <span class="option-check"></span>
                            </button>`).join("")}
                    </div>
                    <div class="answer-feedback" id="feedback" aria-live="polite"></div>
                    <div class="question-footer"><span>✦ Fais de ton mieux !</span><button class="primary-btn next-btn" id="nextButton" disabled>${currentQuestion === quizQuestions.length - 1 ? "Voir mon résultat" : "Question suivante"} <span>→</span></button></div>
                </div>
            </section>
        </main>`;

    document.getElementById("quitQuiz").addEventListener("click", (e) => { e.preventDefault(); confirmQuit(); });
    document.getElementById("quitButton").addEventListener("click", confirmQuit);
    document.querySelectorAll(".answer-option").forEach(button => {
        button.addEventListener("click", () => chooseAnswer(Number(button.dataset.index)));
    });
    document.getElementById("nextButton").addEventListener("click", nextQuestion);
}

function chooseAnswer(index) {
    if (answered) return;
    answered = true;

    const correctIndex = quizQuestions[currentQuestion].reponses - 1;
    const buttons = document.querySelectorAll(".answer-option");
    const feedback = document.getElementById("feedback");

    buttons.forEach((button, i) => {
        button.disabled = true;
        if (i === correctIndex) button.classList.add("correct");
        if (i === index && index !== correctIndex) button.classList.add("incorrect");
    });

    if (index === correctIndex) {
        score++;
        feedback.innerHTML = `<span class="feedback-icon">✓</span><span><strong>Bonne réponse !</strong><small>Bien joué, continue comme ça.</small></span>`;
        feedback.className = "answer-feedback feedback-good";
    } else {
        feedback.innerHTML = `<span class="feedback-icon">!</span><span><strong>Pas tout à fait…</strong><small>La bonne réponse est : ${escapeHTML(quizQuestions[currentQuestion].options[correctIndex])}</small></span>`;
        feedback.className = "answer-feedback feedback-bad";
    }

    document.getElementById("nextButton").disabled = false;
    document.querySelector(".progress-fill").style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
}

function nextQuestion() {
    if (!answered) return;
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) renderQuestion();
    else renderResults();
}

function renderResults() {
    const percent = Math.round((score / quizQuestions.length) * 100);
    let message = "Continue tes efforts, chaque essai te fait progresser.";
    let title = "Chaque étape compte !";
    if (percent >= 80) { message = "Excellent travail ! Tu maîtrises déjà de nombreuses notions."; title = "Impressionnant !"; }
    else if (percent >= 50) { message = "Bon travail ! Encore un peu de pratique et tu progresseras davantage."; title = "Bien joué !"; }

    root.innerHTML = `
        <main class="app-shell results-shell">
            <header class="topbar"><a class="brand" href="#" id="homeBrand"><span class="brand-mark">Q</span> QuizLab</a><span class="quiz-mode">RÉSULTAT DU QUIZ</span></header>
            <section class="result-card">
                <div class="result-sparkle">✦</div>
                <span class="eyebrow">QUIZ TERMINÉ</span>
                <h1>${title}</h1>
                <p class="result-message">${message}</p>
                <div class="score-circle" style="--score:${percent * 3.6}deg"><div><strong>${percent}<small>%</small></strong><span>TON SCORE</span></div></div>
                <div class="score-details">
                    <div><strong>${score}</strong><span>Bonnes réponses</span></div>
                    <div><strong>${quizQuestions.length - score}</strong><span>À revoir</span></div>
                    <div><strong>${quizQuestions.length}</strong><span>Questions</span></div>
                </div>
                <div class="result-actions"><button class="primary-btn" id="retryQuiz">Recommencer <span>↻</span></button><button class="secondary-btn" id="homeButton">Retour à l'accueil</button></div>
            </section>
            <footer class="footer"><span>QuizLab</span><span>Continue à apprendre !</span></footer>
        </main>`;

    document.getElementById("retryQuiz").addEventListener("click", startQuiz);
    document.getElementById("homeButton").addEventListener("click", renderHome);
    document.getElementById("homeBrand").addEventListener("click", (e) => { e.preventDefault(); renderHome(); });
}


function openAdmin() {
    const pin = window.prompt("Code administrateur :");
    if (pin === null) return;
    if (pin !== ADMIN_PIN) {
        window.alert("Code incorrect.");
        return;
    }
    renderAdmin();
}

function renderAdmin() {
    const custom = (() => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
        catch (error) { return []; }
    })();

    root.innerHTML = `
        <main class="app-shell admin-shell">
            <header class="topbar">
                <a class="brand" href="#" id="adminHome"><span class="brand-mark">Q</span> QuizLab</a>
                <span class="quiz-mode">ESPACE ADMINISTRATEUR</span>
            </header>
            <section class="admin-area">
                <button class="back-link" id="adminBack">← Retour à l'accueil</button>
                <div class="admin-heading"><span class="eyebrow">GESTION DU CONTENU</span><h1>Administration</h1><p>Crée tes propres questions et gère celles que tu as ajoutées.</p></div>
                <div class="admin-stats"><div><strong>${questions.length}</strong><span>Questions intégrées</span></div><div><strong>${custom.length}</strong><span>Questions personnelles</span></div><div><strong>${getAllQuestions().length}</strong><span>Total disponible</span></div></div>
                <div class="admin-grid">
                    <form class="admin-form" id="questionForm">
                        <div class="admin-form-title"><span class="admin-form-icon">＋</span><div><h2 id="formTitle">Ajouter une question</h2><p>Renseigne l'énoncé et ses réponses.</p></div></div>
                        <input type="hidden" id="editIndex" value="">
                        <label for="questionText">Énoncé de la question</label>
                        <textarea id="questionText" rows="3" placeholder="Ex. : Quelle fonction affiche un texte en Python ?" required></textarea>
                        <div class="admin-fields-grid">
                            <div><label for="option0">Proposition A</label><input id="option0" required placeholder="Réponse A"></div>
                            <div><label for="option1">Proposition B</label><input id="option1" required placeholder="Réponse B"></div>
                            <div><label for="option2">Proposition C</label><input id="option2" placeholder="Réponse C"></div>
                            <div><label for="option3">Proposition D</label><input id="option3" placeholder="Réponse D"></div>
                        </div>
                        <label for="correctAnswer">Bonne réponse</label>
                        <select id="correctAnswer" required><option value="1">A — Proposition A</option><option value="2">B — Proposition B</option><option value="3">C — Proposition C</option><option value="4">D — Proposition D</option></select>
                        <p class="admin-hint">Les propositions C et D sont facultatives. La bonne réponse doit correspondre à une proposition remplie.</p>
                        <div class="admin-form-actions"><button class="primary-btn" type="submit" id="saveQuestion">Enregistrer la question</button><button class="secondary-btn" type="button" id="cancelEdit">Annuler</button></div>
                        <p class="admin-message" id="adminMessage" aria-live="polite"></p>
                    </form>
                    <section class="admin-list-panel"><div class="admin-list-heading"><div><h2>Mes questions</h2><p>Questions ajoutées depuis cet espace</p></div><span class="admin-count">${custom.length}</span></div>
                        <div class="admin-question-list">${custom.length ? custom.map((q, i) => `<article class="admin-question-item"><div><strong>${escapeHTML(q.question)}</strong><small>${q.options.length} propositions · Réponse ${String.fromCharCode(64 + q.reponses)}</small></div><div class="admin-item-actions"><button type="button" class="edit-question" data-index="${i}" aria-label="Modifier">✎</button><button type="button" class="delete-question" data-index="${i}" aria-label="Supprimer">×</button></div></article>`).join("") : `<div class="admin-empty"><span>＋</span><strong>Aucune question personnelle</strong><p>Utilise le formulaire pour ajouter ta première question.</p></div>`}</div>
                    </section>
                </div>
                <div class="admin-warning">ⓘ Les questions personnelles sont enregistrées dans le navigateur avec localStorage. Elles ne sont pas partagées entre les appareils.</div>
            </section>
        </main>`;

    document.getElementById("adminHome").addEventListener("click", e => { e.preventDefault(); renderHome(); });
    document.getElementById("adminBack").addEventListener("click", renderHome);
    document.getElementById("cancelEdit").addEventListener("click", resetAdminForm);
    document.getElementById("questionForm").addEventListener("submit", saveAdminQuestion);
    document.querySelectorAll(".edit-question").forEach(btn => btn.addEventListener("click", () => editAdminQuestion(Number(btn.dataset.index))));
    document.querySelectorAll(".delete-question").forEach(btn => btn.addEventListener("click", () => deleteAdminQuestion(Number(btn.dataset.index))));
}

function saveAdminQuestion(event) {
    event.preventDefault();
    const question = document.getElementById("questionText").value.trim();
    const options = [0, 1, 2, 3].map(i => document.getElementById(`option${i}`).value.trim()).filter(Boolean);
    const chosen = Number(document.getElementById("correctAnswer").value);
    const originalOptions = [0, 1, 2, 3].map(i => document.getElementById(`option${i}`).value.trim());
    const correctText = originalOptions[chosen - 1];
    const correctIndex = options.indexOf(correctText) + 1;
    const message = document.getElementById("adminMessage");

    if (!question || options.length < 2 || !correctText || correctIndex < 1) {
        message.textContent = "Ajoute au moins deux propositions et sélectionne une bonne réponse remplie.";
        message.className = "admin-message error";
        return;
    }

    let custom;
    try {
        custom = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        if (!Array.isArray(custom)) custom = [];
    } catch (error) {
        custom = [];
    }

    const editIndex = document.getElementById("editIndex").value;
    const item = { question, options, reponses: correctIndex };

    if (editIndex === "") {
        custom.push(item);
    } else {
        const index = Number(editIndex);
        if (!Number.isInteger(index) || index < 0 || index >= custom.length) {
            message.textContent = "Cette question n'existe plus. Actualise la liste puis réessaie.";
            message.className = "admin-message error";
            return;
        }
        custom[index] = item;
    }

    if (saveCustomQuestions(custom)) renderAdmin();
}

function editAdminQuestion(index) {
    let custom;
    try {
        custom = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        if (!Array.isArray(custom)) custom = [];
    } catch (error) {
        custom = [];
    }
    const q = custom[index];
    if (!q) return;
    document.getElementById("editIndex").value = index;
    document.getElementById("questionText").value = q.question;
    [0, 1, 2, 3].forEach(i => document.getElementById(`option${i}`).value = q.options[i] || "");
    document.getElementById("correctAnswer").value = String(q.reponses);
    document.getElementById("formTitle").textContent = "Modifier la question";
    document.getElementById("saveQuestion").textContent = "Enregistrer les modifications";
    document.getElementById("questionText").scrollIntoView({ behavior: "smooth", block: "center" });
}

function deleteAdminQuestion(index) {
    if (!window.confirm("Supprimer définitivement cette question personnelle ?")) return;
    let custom;
    try {
        custom = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        if (!Array.isArray(custom)) custom = [];
    } catch (error) {
        custom = [];
    }
    custom.splice(index, 1);
    if (saveCustomQuestions(custom)) renderAdmin();
}

function resetAdminForm() {
    document.getElementById("questionForm").reset();
    document.getElementById("editIndex").value = "";
    document.getElementById("formTitle").textContent = "Ajouter une question";
    document.getElementById("saveQuestion").textContent = "Enregistrer la question";
    document.getElementById("adminMessage").textContent = "";
}

function confirmQuit() {
    if (window.confirm("Veux-tu vraiment quitter ce quiz ? Ta progression actuelle sera perdue.")) renderHome();
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[char]);
}

renderHome();
