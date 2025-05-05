var mode='users',u=document.getElementById('usersPanel'),t=document.getElementById('translationsPanel');
window.onload=()=>{getItems();getTranslations()};
document.getElementById('switchUsers').onclick=()=>{mode='users';u.style.display='block';t.style.display='none'};
document.getElementById('switchTranslations').onclick=()=>{mode='translations';u.style.display='none';t.style.display='block'};

function getItems(){
    fetch('/api/users').then(r=>r.json()).then(d=>{
        itemsList.innerHTML = '';
        for(var i = 0; i < d.length; i++) {
            var item = d[i];
            var li = document.createElement('li');
            li.innerHTML = '<span>' + item.name + '</span>' +
                '<span class="btn-group">' +
                '<button onclick="changeItem(' + item.id + ', \'' + item.name + '\')">Изм.</button>' +
                '<button onclick="removeItem(' + item.id + ')">Удалить</button>' +
                '</span>';
            itemsList.appendChild(li);
        }
    })
}

document.getElementById('addBtn').onclick=()=>{
    let v=document.getElementById('inputField').value.trim();
    if(v)fetch('/api/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:v})}).then(()=>{document.getElementById('inputField').value='';getItems()})
}

function changeItem(id,old){
    let n=prompt('Новое имя:',old);
    if(n&&n!=old)fetch('/api/users/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:n})}).then(()=>getItems())
}

function removeItem(id){
    if(confirm('Удалить пользователя?'))fetch('/api/users/'+id,{method:'DELETE'}).then(()=>getItems())
}

document.getElementById('swapLangs').onclick=()=>{
    let s=document.getElementById('inputSourceLang'),t=document.getElementById('inputTargetLang'),v=s.value;
    s.value=t.value;t.value=v
}

document.getElementById('addTranslationBtn').onclick=()=>{
    let i=document.getElementById('inputFieldTranslation'),s=document.getElementById('inputSourceLang'),t=document.getElementById('inputTargetLang');
    if(i.value.trim())fetch('/api/translations',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:i.value,sourceLang:s.value,targetLang:t.value})}).then(r=>r.json()).then(d=>{document.getElementById('outputFieldTranslation').value=d.translatedText||'Перевод выполнен';getTranslations()})
}

function getTranslations(){
    fetch('/api/translations').then(r=>r.json()).then(d=>{
        translationsList.innerHTML = '';
        for(var i = 0; i < d.length; i++) {
            var item = d[i];
            var li = document.createElement('li');
            li.innerHTML = '<span>' + item.originalText + ' → <b>' + item.translatedText + '</b> [' + 
                item.sourceLang + '→' + item.targetLang + ']</span>' +
                '<span class="btn-group">' +
                '<button onclick="removeTranslation(' + item.id + ')">Удалить</button>' +
                '</span>';
            translationsList.appendChild(li);
        }
    })
}

function removeTranslation(id){
    if(confirm('Удалить перевод?'))fetch('/api/translations/'+id,{method:'DELETE'}).then(()=>getTranslations())
}

function setBackground() {
    var img = new Image();
    img.onload = function() {
        document.body.style.background = 'linear-gradient(120deg, rgba(106,48,147,0.5) 0%, rgba(255,94,98,0.3) 100%), url("sea-bg.jpg") no-repeat center center fixed';
        document.body.style.backgroundSize = 'cover';
        document.body.style.minHeight = '100vh';
    }
}
function resizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

document.getElementById('inputFieldTranslation').oninput = function() { resizeTextarea(this); };
document.getElementById('outputFieldTranslation').oninput = function() { resizeTextarea(this); }; 