let currentRole = 'student';

function selectRole(role) {
  currentRole = role;
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
}

function loginUser() {
  const nameInput = document.getElementById('authName');
  const classInput = document.getElementById('authClass');
  const name = (nameInput && nameInput.value) ? nameInput.value : 'Оқушы';
  const userClass = (classInput && classInput.value) ? classInput.value : '5 A';
  
  const userDisplayName = document.getElementById('userDisplayName');
  const userDisplayRole = document.getElementById('userDisplayRole');
  if (userDisplayName) userDisplayName.textContent = name;
  if (userDisplayRole) userDisplayRole.textContent = currentRole === 'student' ? `Оқушы (${userClass})` : 'Мұғалім';
  
  if (currentRole === 'admin') {
    const navAdminTab = document.getElementById('navAdminTab');
    if (navAdminTab) navAdminTab.classList.remove('hidden');
  }
  
  const authModal = document.getElementById('authModal');
  if (authModal) authModal.classList.add('hidden');
}

function switchView(viewName) {
  const views = ['student', 'cards', 'games', 'history', 'admin'];
  views.forEach(v => {
    const el = document.getElementById(v + 'View');
    if (el) el.classList.add('hidden');
  });

  const targetView = document.getElementById(viewName + 'View');
  if (targetView) targetView.classList.remove('hidden');
}

function checkText() {
  const studentInput = document.getElementById('studentInput');
  const text = studentInput ? studentInput.value : '';
  if (!text.trim()) {
    alert('Текст енгізіңіз!');
    return;
  }
  
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  if (emptyState) emptyState.classList.add('hidden');
  if (loadingState) loadingState.classList.remove('hidden');
  
  setTimeout(() => {
    if (loadingState) loadingState.classList.add('hidden');
    const resultContent = document.getElementById('resultContent');
    const greetingBox = document.getElementById('greetingBox');
    const errorTableContainer = document.getElementById('errorTableContainer');
    const errorTableBody = document.getElementById('errorTableBody');

    if (resultContent) resultContent.classList.remove('hidden');
    if (greetingBox) greetingBox.innerHTML = `<strong>Тексеру нәтижесі:</strong> Текст талданды. Орфография бойынша 1 қате табылды.`;
    if (errorTableContainer) errorTableContainer.classList.remove('hidden');
    if (errorTableBody) {
      errorTableBody.innerHTML = `
        <tr>
          <td class="p-3 border-b text-red-500 font-bold">шопот</td>
          <td class="p-3 border-b text-emerald-600 font-bold">шепот</td>
          <td class="p-3 border-b">В корне существительных после шипящих под ударением пишется Ё, если можно подобрать однокоренное слово с Е (шептать).</td>
        </tr>
      `;
    }
  }, 1000);
}
