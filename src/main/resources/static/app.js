var mode = 'users';
var usersPanel = document.getElementById('usersPanel');
var translationsPanel = document.getElementById('translationsPanel');
var switchUsers = document.getElementById('switchUsers');
var switchTranslations = document.getElementById('switchTranslations');

function setBackground() {
    var img = new Image();
    img.onload = function() {
        document.body.style.background = 'linear-gradient(120deg, rgba(106,48,147,0.5) 0%, rgba(255,94,98,0.3) 100%), url("sea-bg.jpg") no-repeat center center fixed';
        document.body.style.backgroundSize = 'cover';
        document.body.style.minHeight = '100vh';
    };
    img.src = 'sea-bg.jpg';
}

window.onload = function() {
    setBackground();
    getItems();
    getTranslations();
};

switchUsers.onclick = function() {
    mode = 'users';
    usersPanel.style.display = 'block';
    translationsPanel.style.display = 'none';
    switchUsers.style.backgroundColor = '#ddd';
    switchTranslations.style.backgroundColor = '';
};

switchTranslations.onclick = function() {
    mode = 'translations';
    usersPanel.style.display = 'none';
    translationsPanel.style.display = 'block';
    switchUsers.style.backgroundColor = '';
    switchTranslations.style.backgroundColor = '#ddd';
};

var apiUrl = '/api/users';
var itemsList = document.getElementById('itemsList');
var inputField = document.getElementById('inputField');
var addBtn = document.getElementById('addBtn');

function getItems() {
    fetch(apiUrl)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            itemsList.innerHTML = '';
            for(var i = 0; i < data.length; i++) {
                var item = data[i];
                var li = document.createElement('li');
                li.innerHTML = '<span>' + item.name + '</span>' +
                    '<span>' +
                    '<button onclick="changeItem(' + item.id + ', \'' + item.name + '\')">Изм.</button>' +
                    '<button onclick="removeItem(' + item.id + ')">Удалить</button>' +
                    '</span>';
                itemsList.appendChild(li);
            }
        })
        .catch(function(error) {
            itemsList.innerHTML = '<li style="color:red">Ошибка загрузки</li>';
        });
}

addBtn.onclick = function() {
    var value = inputField.value.trim();
    if(value == '') return;
    
    fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: value })
    })
    .then(function(response) {
        if(response.ok) {
            inputField.value = '';
            getItems();
        }
    })
    .catch(function(error) { alert('Ошибка добавления'); });
};

function changeItem(id, oldName) {
    var newName = prompt('Новое имя:', oldName);
    if(newName == '' || newName == oldName) return;
    
    fetch(apiUrl + '/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
    })
    .then(function(response) {
        if(response.ok) getItems();
    })
    .catch(function(error) { alert('Ошибка обновления'); });
}

function removeItem(id) {
    if(!confirm('Удалить пользователя?')) return;
    
    fetch(apiUrl + '/' + id, { method: 'DELETE' })
    .then(function(response) {
        if(response.ok) getItems();
    })
    .catch(function(error) { alert('Ошибка удаления'); });
}

var translationsApiUrl = '/api/translations';
var translationsList = document.getElementById('translationsList');
var inputFieldTranslation = document.getElementById('inputFieldTranslation');
var inputSourceLang = document.getElementById('inputSourceLang');
var inputTargetLang = document.getElementById('inputTargetLang');
var outputFieldTranslation = document.getElementById('outputFieldTranslation');
var addTranslationBtn = document.getElementById('addTranslationBtn');
var swapLangsBtn = document.getElementById('swapLangs');

swapLangsBtn.onclick = function() {
    var tmp = inputSourceLang.value;
    inputSourceLang.value = inputTargetLang.value;
    inputTargetLang.value = tmp;
};

addTranslationBtn.onclick = function() {
    var text = inputFieldTranslation.value.trim();
    var sourceLang = inputSourceLang.value;
    var targetLang = inputTargetLang.value;
    if(text == '') return;
    
    fetch(translationsApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text, sourceLang: sourceLang, targetLang: targetLang })
    })
    .then(function(response) { return response.json(); })
    .then(function(data) {
        if(data.translatedText) {
            outputFieldTranslation.value = data.translatedText;
        } else {
            outputFieldTranslation.value = 'Перевод выполнен';
        }
        getTranslations();
    })
    .catch(function(error) { outputFieldTranslation.value = 'Ошибка перевода'; });
};

function getTranslations() {
    fetch(translationsApiUrl)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            translationsList.innerHTML = '';
            for(var i = 0; i < data.length; i++) {
                var item = data[i];
                var li = document.createElement('li');
                li.innerHTML = '<span>' + item.originalText + ' → <b>' + item.translatedText + '</b> [' + 
                    item.sourceLang + '→' + item.targetLang + ']</span>' +
                    '<button onclick="removeTranslation(' + item.id + ')">Удалить</button>';
                translationsList.appendChild(li);
            }
        })
        .catch(function(error) {
            translationsList.innerHTML = '<li style="color:red">Ошибка загрузки</li>';
        });
}

function removeTranslation(id) {
    if(!confirm('Удалить перевод?')) return;
    
    fetch(translationsApiUrl + '/' + id, { method: 'DELETE' })
    .then(function(response) {
        if(response.ok) getTranslations();
    })
    .catch(function(error) { alert('Ошибка удаления'); });
}

function resizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

inputFieldTranslation.oninput = function() { resizeTextarea(inputFieldTranslation); };
outputFieldTranslation.oninput = function() { resizeTextarea(outputFieldTranslation); }; 