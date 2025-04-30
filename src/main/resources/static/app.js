let mode = 'users';
const usersPanel = document.getElementById('usersPanel');
const translationsPanel = document.getElementById('translationsPanel');
const switchUsers = document.getElementById('switchUsers');
const switchTranslations = document.getElementById('switchTranslations');

switchUsers.onclick = () => {
    mode = 'users';
    usersPanel.classList.remove('hidden');
    translationsPanel.classList.add('hidden');
    switchUsers.classList.add('active');
    switchTranslations.classList.remove('active');
};

switchTranslations.onclick = () => {
    mode = 'translations';
    usersPanel.classList.add('hidden');
    translationsPanel.classList.remove('hidden');
    switchUsers.classList.remove('active');
    switchTranslations.classList.add('active');
};

const apiUrl = '/api/users';
const itemsList = document.getElementById('itemsList');
const inputField = document.getElementById('inputField');
const addBtn = document.getElementById('addBtn');

async function getItems() {
    try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        itemsList.innerHTML = '';
        data.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.name}</span>
                <span>
                    <button onclick="changeItem(${item.id}, '${item.name}')">Изм.</button>
                    <button onclick="removeItem(${item.id})">Удалить</button>
                </span>
            `;
            itemsList.appendChild(li);
        });
    } catch (e) {
        itemsList.innerHTML = '<li style="color:red">Ошибка загрузки</li>';
    }
}

addBtn.onclick = async () => {
    const value = inputField.value.trim();
    if (!value) return;
    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: value })
        });
        if (res.ok) {
            inputField.value = '';
            getItems();
        }
    } catch (e) { alert('Ошибка добавления'); }
};

async function changeItem(id, oldName) {
    const newName = prompt('Новое имя:', oldName);
    if (!newName || newName === oldName) return;
    try {
        const res = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName })
        });
        if (res.ok) getItems();
    } catch (e) { alert('Ошибка обновления'); }
}

async function removeItem(id) {
    if (!confirm('Удалить пользователя?')) return;
    try {
        const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        if (res.ok) getItems();
    } catch (e) { alert('Ошибка удаления'); }
}

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
    const sourceLang = inputSourceLang.value;
    const targetLang = inputTargetLang.value;
    if (!text) return;
    try {
        const res = await fetch(translationsApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, sourceLang, targetLang })
        });
        if (res.ok) {
            const data = await res.json();
            outputFieldTranslation.value = data.translatedText || 'Перевод выполнен';
            getTranslations();
        } else {
            outputFieldTranslation.value = 'Ошибка перевода';
        }
    } catch (e) {
        outputFieldTranslation.value = 'Ошибка перевода';
    }
};

async function getTranslations() {
    try {
        const res = await fetch(translationsApiUrl);
        const data = await res.json();
        translationsList.innerHTML = '';
        data.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.originalText} → <b>${item.translatedText}</b> [${item.sourceLang}→${item.targetLang}]</span>
                <button onclick="removeTranslation(${item.id})">Удалить</button>
            `;
            translationsList.appendChild(li);
        });
    } catch (e) {
        translationsList.innerHTML = '<li style="color:red">Ошибка загрузки</li>';
    }
}

async function removeTranslation(id) {
    if (!confirm('Удалить перевод?')) return;
    try {
        const res = await fetch(`${translationsApiUrl}/${id}`, { method: 'DELETE' });
        if (res.ok) getTranslations();
    } catch (e) { alert('Ошибка удаления'); }
}

function resizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

inputFieldTranslation.addEventListener('input', () => resizeTextarea(inputFieldTranslation));
outputFieldTranslation.addEventListener('input', () => resizeTextarea(outputFieldTranslation));

getItems();
getTranslations(); 