// Global State
window.currentRole = 'student';
window.currentScore = 0;
window.currentStreak = 0;
window.gameTimer = null;
window.timeLeft = 60;
window.currentGameType = '';

const wordList = [
  { word: "Что", sound: "[што]", hint: "Пишется Ч, но произносится как Ш. Запомни это правило!" },
  { word: "Чтобы", sound: "[штобы]", hint: "Пишется слитно, если можно заменить на 'для того чтобы'." },
  { word: "Конечно", sound: "[конешна]", hint: "Сочетание ЧН произносится как ШН." },
  { word: "Скучно", sound: "[скушна]", hint: "Сочетание ЧН произносится как ШН." },
  { word: "Шорох", sound: "[шорох]", hint: "Слово-исключение! Пишется О после шипящих в корне." }
];
let currentWordIndex = 0;

// Role & Auth Management
window.selectRole = function(role) {
  window.currentRole = role;
  const studentBtn = document.getElementById('roleStudentBtn');
  const adminBtn = document.getElementById('roleAdminBtn');
  const adminPass = document.getElementById('adminPassContainer');

  if (role === 'student') {
    if (studentBtn) studentBtn.className = "flex-1 py-2.5 rounded-lg bg-white text-indigo-900 shadow-sm transition-all font-bold";
    if (adminBtn) adminBtn.className = "flex-1 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 transition-all font-bold";
    if (adminPass) adminPass.classList.add('hidden');
  } else {
    if (adminBtn) adminBtn.className = "flex-1 py-2.5 rounded-lg bg-white text-indigo-900 shadow-sm transition-all font-bold";
    if (studentBtn) studentBtn.className = "flex-1 py-2.5 rounded-lg text-slate-600 hover:text-slate-900 transition-all font-bold";
    if (adminPass) adminPass.classList.remove('hidden');
  }
};

window.loginUser = function() {
  const nameInput = document.getElementById('authName');
  const classInput = document.getElementById('authClass');
  const name = (nameInput && nameInput.value.trim()) ? nameInput.value : 'Алина Смирнова';
  const userClass = (classInput && classInput.value.trim()) ? classInput.value : '5 A';
  
  const userDisplayName = document.getElementById('userDisplayName');
  const userDisplayRole = document.getElementById('userDisplayRole');
  if (userDisplayName) userDisplayName.textContent = name;
  if (userDisplayRole) userDisplayRole.textContent = (window.currentRole === 'admin') ? 'Учитель / Аналитик' : `Ученик (${userClass})`;
  
  if (window.currentRole === 'admin') {
    const navAdminTab = document.getElementById('navAdminTab');
    if (navAdminTab) navAdminTab.classList.remove('hidden');
  }
  
  const authModal = document.getElementById('authModal');
  if (authModal) authModal.classList.add('hidden');
};

window.logout = function() {
  const authModal = document.getElementById('authModal');
  if (authModal) authModal.classList.remove('hidden');
};

// View Navigation
window.switchView = function(viewName) {
  const views = ['student', 'cards', 'games', 'history', 'admin'];
  views.forEach(v => {
    const el = document.getElementById(v + 'View');
    if (el) el.classList.add('hidden');
  });

  const targetView = document.getElementById(viewName + 'View');
  if (targetView) targetView.classList.remove('hidden');

  const tabs = {
    student: 'navStudentTab',
    cards: 'navCardsTab',
    games: 'navGamesTab',
    history: 'navHistoryTab',
    admin: 'navAdminTab'
  };

  Object.keys(tabs).forEach(key => {
    const tabBtn = document.getElementById(tabs[key]);
    if (tabBtn) {
      if (key === viewName) {
        tabBtn.className = "px-4 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 text-white shadow-sm transition-all flex items-center gap-2";
      } else {
        tabBtn.className = "px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm transition-all flex items-center gap-2";
      }
    }
  });

  if (viewName === 'cards') window.renderCards();
  if (viewName === 'history') window.loadHistory();
  if (viewName === 'admin') window.loadAdminDashboard();
};

// Dictation Analysis
window.checkText = function() {
  const studentInput = document.getElementById('studentInput');
  const text = studentInput ? studentInput.value : '';
  
  if (!text.trim()) {
    alert('Пожалуйста, введите текст диктанта или загрузите фото!');
    return;
  }
  
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  const resultContent = document.getElementById('resultContent');

  if (emptyState) emptyState.classList.add('hidden');
  if (loadingState) loadingState.classList.remove('hidden');
  
  setTimeout(() => {
    if (loadingState) loadingState.classList.add('hidden');
    if (resultContent) resultContent.classList.remove('hidden');
    
    const greetingBox = document.getElementById('greetingBox');
    const errorTableContainer = document.getElementById('errorTableContainer');
    const errorTableBody = document.getElementById('errorTableBody');
    const focusPointBox = document.getElementById('focusPointBox');
    const focusPointText = document.getElementById('focusPointText');
    const exercisesBox = document.getElementById('exercisesBox');
    const exerciseList = document.getElementById('exerciseList');

    if (greetingBox) {
      greetingBox.innerHTML = `<strong>Анализ завершен!</strong> В тексте найдена 1 орфографическая ошибка. Сформирован индивидуальный тренажер.`;
    }
    
    if (errorTableContainer) errorTableContainer.classList.remove('hidden');
    if (errorTableBody) {
      errorTableBody.innerHTML = `
        <tr>
          <td class="p-3 border-b border-slate-200 text-red-500 font-bold">шопот</td>
          <td class="p-3 border-b border-slate-200 text-emerald-600 font-bold">шепот</td>
          <td class="p-3 border-b border-slate-200">В корне существительных после шипящих под ударением пишется <strong>Ё</strong>, если можно подобрать однокоренное слово с <strong>Е</strong> (шептать).</td>
        </tr>
      `;
    }

    if (focusPointBox) focusPointBox.classList.remove('hidden');
    if (focusPointText) focusPointText.textContent = "Правописание гласных О/Ё после шипящих в корне слова.";

    if (exercisesBox) exercisesBox.classList.remove('hidden');
    if (exerciseList) {
      exerciseList.innerHTML = `
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
          <p class="font-bold text-slate-800 mb-2">1. Вставьте пропущенную букву: В тишине раздался легкий ш...рох.</p>
          <div class="flex gap-2">
            <button onclick="answerExercise(this, 'О', true)" class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold hover:bg-indigo-50">Буква О</button>
            <button onclick="answerExercise(this, 'Ё', false)" class="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold hover:bg-indigo-50">Буква Ё</button>
          </div>
        </div>
      `;
    }
  }, 1000);
};

window.answerExercise = function(btn, choice, isCorrect) {
  const parent = btn.parentElement;
  const buttons = parent.querySelectorAll('button');
  buttons.forEach(b => b.disabled = true);

  if (isCorrect) {
    btn.className = "px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold";
    btn.innerText += " (Правильно! 🎉)";
  } else {
    btn.className = "px-3 py-1.5 bg-red-600 text-white rounded-lg font-bold";
    btn.innerText += " (Ошибка ❌)";
  }
};

// Image & Camera Handlers
window.handleImageUpload = function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const preview = document.getElementById('imagePreview');
      const container = document.getElementById('imagePreviewContainer');
      const input = document.getElementById('studentInput');
      
      if (preview) preview.src = e.target.result;
      if (container) container.classList.remove('hidden');
      if (input) input.value = "В лесу слышался тихий шопот листьев и пение птиц.";
    };
    reader.readAsDataURL(file);
  }
};

window.removeUploadedImage = function() {
  const container = document.getElementById('imagePreviewContainer');
  if (container) container.classList.add('hidden');
  const fileInput = document.getElementById('imageFileInput');
  if (fileInput) fileInput.value = '';
};

window.openCamera = function() {
  const modal = document.getElementById('cameraModal');
  const video = document.getElementById('cameraVideo');
  if (modal) modal.classList.remove('hidden');

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        window.cameraStream = stream;
        if (video) video.srcObject = stream;
      })
      .catch(err => alert("Камераға рұқсат берілмеді немесе ол қолжетімсіз."));
  }
};

window.closeCamera = function() {
  const modal = document.getElementById('cameraModal');
  if (modal) modal.classList.add('hidden');
  if (window.cameraStream) {
    window.cameraStream.getTracks().forEach(track => track.stop());
  }
};

window.takePhoto = function() {
  const video = document.getElementById('cameraVideo');
  const canvas = document.getElementById('cameraCanvas');
  const preview = document.getElementById('imagePreview');
  const container = document.getElementById('imagePreviewContainer');
  const input = document.getElementById('studentInput');

  if (video && canvas) {
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    if (preview) preview.src = canvas.toDataURL('image/png');
    if (container) container.classList.remove('hidden');
    if (input) input.value = "Рукописный диктант: В лесу слышался тихий шопот листьев.";
    window.closeCamera();
  }
};

// Speech & Cards
window.speakWord = function(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Браузер дыбыстауды қолдамайды.");
  }
};

window.repeatCurrentWord = function() {
  const current = wordList[currentWordIndex];
  if (current) window.speakWord(current.word);
};

window.playNextWord = function() {
  currentWordIndex = (currentWordIndex + 1) % wordList.length;
  const item = wordList[currentWordIndex];
  
  const title = document.getElementById('playerWordTitle');
  const sound = document.getElementById('playerWordSound');
  const hint = document.getElementById('playerWordHint');

  if (title) title.textContent = item.word;
  if (sound) sound.textContent = `Произносим: ${item.sound}`;
  if (hint) hint.textContent = item.hint;

  window.speakWord(item.word);
};

window.renderCards = function() {
  const grid = document.getElementById('cardsGrid');
  if (!grid) return;
  grid.innerHTML = wordList.map(item => `
    <div onclick="window.speakWord('${item.word}')" class="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-500 cursor-pointer transition-all shadow-sm flex items-center justify-between">
      <div>
        <h4 class="font-extrabold text-slate-900 text-base">${item.word}</h4>
        <p class="text-xs text-indigo-600 font-mono">${item.sound}</p>
      </div>
      <button class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
        <i class="fa-solid fa-volume-high"></i>
      </button>
    </div>
  `).join('');
};

window.filterCards = function() {
  const val = (document.getElementById('cardSearchInput')?.value || '').toLowerCase();
  const grid = document.getElementById('cardsGrid');
  if (!grid) return;
  const filtered = wordList.filter(w => w.word.toLowerCase().includes(val));
  grid.innerHTML = filtered.map(item => `
    <div onclick="window.speakWord('${item.word}')" class="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-500 cursor-pointer transition-all shadow-sm flex items-center justify-between">
      <div>
        <h4 class="font-extrabold text-slate-900 text-base">${item.word}</h4>
        <p class="text-xs text-indigo-600 font-mono">${item.sound}</p>
      </div>
      <button class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">
        <i class="fa-solid fa-volume-high"></i>
      </button>
    </div>
  `).join('');
};

// Games Engine
window.startGame = function(type) {
  window.currentGameType = type;
  document.getElementById('gameSelection')?.classList.add('hidden');
  document.getElementById('gameArena')?.classList.remove('hidden');
  document.getElementById('gameArena')?.classList.add('flex');
  document.getElementById('gameResultScreen')?.classList.add('hidden');

  window.timeLeft = 60;
  window.currentScore = 0;
  window.currentStreak = 0;
  window.updateGameHeader();
  window.nextGameQuestion();

  clearInterval(window.gameTimer);
  window.gameTimer = setInterval(() => {
    window.timeLeft--;
    const timerText = document.getElementById('timerText');
    const timerProgress = document.getElementById('timerProgress');
    if (timerText) timerText.textContent = `⏱️ ${window.timeLeft} с`;
    if (timerProgress) timerProgress.style.width = `${(window.timeLeft / 60) * 100}\%`;  if (window.timeLeft <= 0) { clearInterval(window.gameTimer); window.endGame(); } }, 1000); };  window.updateGameHeader = function() { const score = document.getElementById('gameScore'); const streak = document.getElementById('gameStreak'); if (score) score.textContent = window.currentScore; if (streak) streak.textContent = window.currentStreak; };  window.nextGameQuestion = function() { const qText = document.getElementById('gameQuestionText'); const options = document.getElementById('gameOptionsContainer'); if (!qText \vert{}\vert{} !options) return;  if (window.currentGameType === 'detective') { const questions = [ { word: "Шёпот", correct: true }, { word: "Шопот", correct: false }, { word: "Шорох", correct: true }, { word: "Шёрох", correct: false } ]; const q = questions[Math.floor(Math.random() * questions.length)]; qText.textContent = `«${q.word}»`;
    options.innerHTML = `
      <button onclick="handleGameAnswer(${q.correct})" class="py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-
      
