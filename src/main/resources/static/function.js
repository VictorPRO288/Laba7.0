
function swapLangsFucntion(){
    let src = document.getElementById("inputSourceLang")
    let dest = document.getElementById("inputTargetLang")
    let swap = src.value
    src.value = dest.value
    dest.value = swap

}


document.addEventListener("DOMContentLoaded", async () => {
    const perevod = document.getElementById('addTranslationBtn');
    perevod.onclick = async function(){
        const text = document.getElementById('inputFieldTranslation').value;
        const sourceLang = document.getElementById('inputSourceLang').value;
        const targetLang = document.getElementById('inputTargetLang').value;
        const response_post = await axios.post('/api/translations',
            {
                text: text,
                sourceLang: sourceLang,
                targetLang: targetLang
            }
        )
        document.getElementById('outputFieldTranslation').value = response_post.data.translatedText;
        window.location.reload()
    }
    const list = await axios.get('/api/translations')
    const reverse = list.data.reverse();
    for (let i = 0; i < reverse.length; i++) {
        const translation = reverse[i];
        const translationElement = `
            <li class="translation-card">
                <div class="translation-content">
                    <div class="language-pair">
                        <span >${translation.sourceLang}</span>
                        <span class="arrow-icon">→</span>
                        <span >${translation.targetLang}</span>
                        </div>
                            <p>${translation.originalText} <span class="arrow-icon">→</span> ${translation.translatedText}</p>
                            <div class="del-button">
                                <button class="delTranslations" onclick="removeTranslation(${translation.id})">Удалить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        `;
        document.getElementById('translationsList').innerHTML += translationElement;
    }
});

async function removeTranslation(id){
    console.log(id)
    const del = await axios.delete(`/api/translations/${id}`)
    setTimeout(() => {
        window.location.reload()
    }, 100)
    
}
