// --- РӨЛДЕР МЕН АВТОРИЗАЦИЯ ---
window.currentRole = 'student';

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
  if (userDisplayRole) userDisplayRole.textContent = (window.currentRole === 'admin') ? 'Учитель' : `Ученик (${userClass})`;
  
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
};

// --- СУРЕТ ЖҮКТЕУ ЖӘНЕ КЕМЕРА ---
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

// --- ДЫБЫСТАУ (AUDIO & SPEECH SYNTHESIS) ---
const wordList = [
  { word: "Что", sound: "[што]", hint: "Пишется Ч, но произносится как Ш. Запомни это правило!" },
  { word: "Чтобы", sound: "[штобы]", hint: "Пишется слитно, если можно заменить на 'для того чтобы'." },
  { word: "Конечно", sound: "[конешна]", hint: "Сочетание ЧН произносится как ШН." },
  { word: "Скучно", sound: "[скушна]", hint: "Сочетание ЧН произносится как ШН." },
  { word: "Шорох", sound: "[шорох]", hint: "Слово-исключение! Пишется О после шипящих в корне." }
];
let currentWordIndex = 0;

window.speakWord = function(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Бұрынғы дыбысты тоқтату
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU'; // Орысша айту
    utterance.rate = 0.85; // Түсінікті әрі асықпай айту
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Сіздің браузеріңізде дыбыстау функциясы қолдау таппайды.");
  }
};

window.repeatCurrentWord = function() {
  const current = wordList[currentWordIndex];
  if (current) {
    window.speakWord(current.word);
  }
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

// --- ДИКТАНТ ТЕКСЕРУ ---
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
  }, 1000);
};
