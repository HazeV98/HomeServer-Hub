document.addEventListener("DOMContentLoaded", () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => renderHub(data))
        .catch(error => console.error("Errore nel caricamento del JSON:", error));
});

function renderHub(apps) {
    const container = document.getElementById('app-container');
    
    apps.forEach(app => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Assicura che l'URL abbia l'estensione protocollo
        const fullUrl = app.url.startsWith('http') ? app.url : `https://${app.url}`;
        
        // Icona di fallback con le iniziali (usata se non definita o se non carica)
        const defaultIcon = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.name)}&background=4a90e2&color=fff&size=128&rounded=true`;
        
        // Usa l'icona definita nel JSON, altrimenti usa il fallback
        const iconSrc = app.icon ? app.icon : defaultIcon;

        card.innerHTML = `
            <div class="card-header">
                <img src="${iconSrc}" alt="${app.name}" class="icon" onerror="this.onerror=null; this.src='${defaultIcon}';">
                <h2>${app.name}</h2>
            </div>
            <p class="description">${app.description}</p>
            <div class="actions">
                <a href="${fullUrl}" target="_blank" class="btn btn-open">Apri</a>
                <button class="btn btn-copy" onclick="copyLink('${fullUrl}', this)">Copia Link</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function copyLink(url, btnElement) {
    navigator.clipboard.writeText(url).then(() => {
        const originalText = btnElement.innerText;
        btnElement.innerText = 'Copiato!';
        btnElement.classList.add('copied');
        
        setTimeout(() => {
            btnElement.innerText = originalText;
            btnElement.classList.remove('copied');
        }, 2000);
    });
}

// Registrazione Service Worker per la PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .catch(err => console.error('Errore registrazione Service Worker:', err));
    });
}

