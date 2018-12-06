const API_KEY = 'c4f25ea319034c1bb64a5a0aac63fb60';
const main = document.querySelector('main');
const selector = document.querySelector('#sourceSelector');
const defaultSource = 'the-washington-post';

window.addEventListener('load', async e => {
    await updateSources();
    selector.value = defaultSource;
    updateNews();

    selector.addEventListener('change', e => {
        updateNews(e.target.value);
    })

    if('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('sw.js');
            console.log(`SW registered`);
        } catch (error) {
            console.log(`SW registration failed`);            
        }
    }
});

async function updateNews(source = defaultSource) {
    const res = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${API_KEY}`);
    const json = await res.json();

    main.innerHTML = json.articles.map(createArticle).join('\n');

}

async function updateSources() {
    const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${API_KEY}`);
    const json = await res.json();

    selector.innerHTML = json.sources.map(src => 
        `<option value="${src.id}">${src.name}</option>`);
}

function createArticle(article) {
    return `
        <div class='article'>
            <a href="${article.url}">
                <h2>${article.title}</h2>
                <img src="${article.urlToImage}">
                <p>${article.description}</p>
            </a>
        </div>
    `;
}