let currentMode = 'users';
const usersPanel = document.getElementById('usersPanel');
const translationsPanel = document.getElementById('translationsPanel');
const switchUsers = document.getElementById('switchUsers');
const switchTranslations = document.getElementById('switchTranslations');

// Переключение UI
switchUsers.onclick = () => {
    currentMode = 'users';
    usersPanel.style.display = '';
    translationsPanel.style.display = 'none';
    switchUsers.classList.add('active');
    switchTranslations.classList.remove('active');
};
switchTranslations.onclick = () => {
    currentMode = 'translations';
    usersPanel.style.display = 'none';
    translationsPanel.style.display = '';
    switchUsers.classList.remove('active');
    switchTranslations.classList.add('active');
};

// --- USERS CRUD (как было) ---
const apiUrl = '/api/users'; 
const itemsList = document.getElementById('itemsList');
const inputField = document.getElementById('inputField');
const addBtn = document.getElementById('addBtn');

// Получить все элементы (GET)
async function fetchItems() {
    itemsList.innerHTML = '<li>Загрузка...</li>';
    try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        itemsList.innerHTML = '';
        data.forEach(item => renderItem(item));
    } catch (e) {
        itemsList.innerHTML = '<li style="color:red">Ошибка загрузки</li>';
    }
}

// Добавить элемент (POST)
addBtn.onclick = async () => {
    const value = inputField.value.trim();
    if (!value) return;
    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: value }) // Измените структуру под вашу модель
        });
        if (res.ok) {
            inputField.value = '';
            fetchItems();
        }
    } catch (e) { alert('Ошибка добавления'); }
};

// Обновить элемент (PUT)
async function updateItem(id, newValue) {
    try {
        const res = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newValue }) 
        });
        if (res.ok) fetchItems();
    } catch (e) { alert('Ошибка обновления'); }
}

// Удалить элемент (DELETE)
async function deleteItem(id) {
    try {
        const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (res.ok) fetchItems();
    } catch (e) { alert('Ошибка удаления'); }
}

// Рендер одного элемента
function renderItem(item) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="item-name">${item.name}</span>
        <span class="crud-btns">
            <button class="update">Изм.</button>
            <button class="delete">Удалить</button>
        </span>
    `;
    // Обновление
    li.querySelector('.update').onclick = () => {
        const newValue = prompt('Новое имя:', item.name);
        if (newValue && newValue !== item.name) updateItem(item.id, newValue);
    };
    // Удаление
    li.querySelector('.delete').onclick = () => {
        if (confirm('Удалить пользователя?')) deleteItem(item.id);
    };
    itemsList.appendChild(li);
}

// --- TRANSLATIONS CRUD ---
const translationsApiUrl = '/api/translations';
const translationsList = document.getElementById('translationsList');
const inputFieldTranslation = document.getElementById('inputFieldTranslation');
const inputSourceLang = document.getElementById('inputSourceLang');
const inputTargetLang = document.getElementById('inputTargetLang');
const outputFieldTranslation = document.getElementById('outputFieldTranslation');
const addTranslationBtn = document.getElementById('addTranslationBtn');
const swapLangsBtn = document.getElementById('swapLangs');

swapLangsBtn.onclick = () => {
    const tmp = inputSourceLang.value;
    inputSourceLang.value = inputTargetLang.value;
    inputTargetLang.value = tmp;
};

addTranslationBtn.onclick = async () => {
    const text = inputFieldTranslation.value.trim();
    const sourceLang = inputSourceLang.value.trim();
    const targetLang = inputTargetLang.value.trim();
    if (!text || !sourceLang || !targetLang) return;
    try {
        const res = await fetch(translationsApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, sourceLang, targetLang })
        });
        if (res.ok) {
            const data = await res.json();
            outputFieldTranslation.value = data.translatedText || 'Перевод выполнен';
            fetchTranslations();
        } else {
            outputFieldTranslation.value = 'Ошибка перевода';
        }
    } catch (e) {
        outputFieldTranslation.value = 'Ошибка перевода';
    }
};

async function fetchTranslations() {
    translationsList.innerHTML = '';
    try {
        const res = await fetch(translationsApiUrl);
        const data = await res.json();
        translationsList.innerHTML = '';
        data.forEach(item => renderTranslation(item));
    } catch (e) {
        translationsList.innerHTML = '<li style="color:red">Ошибка загрузки</li>';
    }
}
async function deleteTranslation(id) {
    try {
        const res = await fetch(`${translationsApiUrl}/${id}`, { method: 'DELETE' });
        if (res.ok) fetchTranslations();
    } catch (e) { alert('Ошибка удаления'); }
}
function renderTranslation(item) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="item-name">${item.originalText} → <b>${item.translatedText}</b> [${item.sourceLang}→${item.targetLang}]</span>
        <span class="crud-btns">
            <button class="delete">Удалить</button>
        </span>
    `;
    li.querySelector('.delete').onclick = () => {
        if (confirm('Удалить перевод?')) deleteTranslation(item.id);
    };
    translationsList.appendChild(li);
}

function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}
inputFieldTranslation.addEventListener('input', function() {
    autoResizeTextarea(this);
});
outputFieldTranslation.addEventListener('input', function() {
    autoResizeTextarea(this);
});

// Инициализация
fetchItems();
fetchTranslations(); 