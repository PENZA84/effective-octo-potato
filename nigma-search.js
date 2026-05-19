const fs = require('fs');
const https = require('https');
const path = require('path');

// Формируем точечные запросы под ZapMeta и ИИ-агрегаторы
const searchQuery = "v2ray sing-box subscription txt node config share free vless trojan hy2 tuic";
const githubQuery = "v2ray sing-box vless hy2 sub extension:txt";

console.log("🚀 Запуск всемирного поискового комбайна Нигма...");
console.log("⚙️ Подключаем: GitHub API + ИИ-поиск + ZapMeta-агрегаторы...");
console.log("🟢 Node.js v22 работает стабильно, спокойно и без спешки...");

// Заголовки, чтобы ZapMeta и ИИ-движки не блокировали запросы с серверов GitHub
const options = {
    headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,application/json'
    },
    timeout: 15000
};

// Автоопределение пути к http.txt
let relativePath = 'data/unique/http.txt';
if (fs.existsSync('v2ray_config_collector')) {
    relativePath = 'v2ray_config_collector/data/unique/http.txt';
}
const filePath = path.resolve(relativePath);
const dirPath = path.dirname(filePath);

const finalGlobalLinks = new Set();

function convertToRaw(cleanUrl) {
    let finalUrl = cleanUrl;
    if (cleanUrl.includes("github.com")) {
        if (cleanUrl.includes("/blob/")) {
            finalUrl = cleanUrl.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
        } else if (cleanUrl.includes("/raw/")) {
            finalUrl = cleanUrl.replace("github.com", "raw.githubusercontent.com").replace("/raw/", "/");
        }
    } else if (cleanUrl.includes("rentry.co") && !cleanUrl.endsWith("/raw")) {
        finalUrl = `${cleanUrl}/raw`;
    } else if (cleanUrl.includes("pastebin.com") && !cleanUrl.includes("/raw/")) {
        finalUrl = cleanUrl.replace("pastebin.com/", "pastebin.com/raw/");
    } else if (cleanUrl.includes("t.me/") && !cleanUrl.includes("t.me/s/")) {
        finalUrl = cleanUrl.replace("t.me/", "t.me/s/");
    }
    return finalUrl;
}

// 1. Поток поиска по GitHub API
function searchGitHub() {
    return new Promise((resolve) => {
        const url = `https://api.github.com/search/code?q=${encodeURIComponent(githubQuery)}&per_page=30`;
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    (json.items || []).forEach(item => {
                        if (item.html_url) finalGlobalLinks.add(convertToRaw(item.html_url.trim()));
                    });
                } catch(e) {}
                resolve();
            });
        }).on('error', () => resolve());
    });
}

// 2. Поток штурма ZapMeta / Мета-движков (Используем стабильный шлюз агрегатора)
function searchZapMetaEngine() {
    return new Promise((resolve) => {
        // Кодируем наши протоколы v2ray, vless, hy2 специально для ZapMeta структуры
        const encodedQuery = encodeURIComponent(searchQuery);
        const url = `https://baresearch.org/api/search?q=${encodedQuery}&format=json&engines=zapmeta,google,bing`;
        
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const results = json.results || json.organic || [];
                    results.forEach(item => {
                        let link = item.url || item.link;
                        if (link && link.startsWith('http')) finalGlobalLinks.add(convertToRaw(link.trim()));
                    });
                } catch(e) {}
                resolve();
            });
        }).on('error', () => resolve());
    });
}

// 3. Поток ИИ-поиска по всемирной паутине
function searchAIAndWeb() {
    return new Promise((resolve) => {
        const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`;
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                const regex = /(https?:\/\/[^\s"'>]+)/g;
                let match;
                while ((match = regex.exec(data)) !== null) {
                    let cleanUrl = match[1].split(')')[0].split(']')[0];
                    if (cleanUrl.includes("github.com") || cleanUrl.includes("rentry.co") || cleanUrl.includes("pastebin.com") || cleanUrl.includes("t.me/") || cleanUrl.includes("nodefree") || cleanUrl.includes("v2rayshare")) {
                        finalGlobalLinks.add(convertToRaw(cleanUrl.trim()));
                    }
                }
                resolve();
            });
        }).on('error', () => resolve());
    });
}

// Главный конвейер
async function runAllEngines() {
    console.log("⏳ Прочесываем ZapMeta, ИИ-движки и код-базы, собираем данные...");
    await Promise.all([searchGitHub(), searchZapMetaEngine(), searchAIAndWeb()]);

    const cluster_GitHub = [];
    const cluster_Telegram = [];
    const cluster_China = [];
    const cluster_Pastes = [];

    finalGlobalLinks.forEach(link => {
        if (link.includes("raw.githubusercontent.com") || link.includes("github.io")) {
            cluster_GitHub.push(link);
        } else if (link.includes("t.me/s/")) {
            cluster_Telegram.push(link);
        } else if (link.includes("pastebin.com/raw") || link.includes("rentry.co")) {
            cluster_Pastes.push(link);
        } else if (link.includes("v2rayshare") || link.includes("clashnode") || link.includes("nodefree") || link.includes("clashfree")) {
            cluster_China.push(link);
        }
    });

    console.log("\n📦 КЛАСТЕР [ МИРОВОЙ GITHUB / RAW ]:");
    console.log(cluster_GitHub.length > 0 ? [...new Set(cluster_GitHub)].join("\n  ") : "  (Пусто)");
    
    console.log("\n✈️ КЛАСТЕР [ МЕЖДУНАРОДНЫЕ ТЕЛЕГРАМ-АРХИВЫ ]:");
    console.log(cluster_Telegram.length > 0 ? [...new Set(cluster_Telegram)].join("\n  ") : "  (Пусто)");
    
    console.log("\n🌏 КЛАСТЕР [ ZAPMETA И ВСЕМИРНЫЕ БАЗЫ ]:");
    console.log(cluster_China.length > 0 ? [...new Set(cluster_China)].join("\n  ") : "  (Пусто)");
    
    console.log("\n📄 КЛАСТЕР [ ГЛОБАЛЬНЫЕ ТЕКСТОВЫЕ ПАСТЫ ]:");
    console.log(cluster_Pastes.length > 0 ? [...new Set(cluster_Pastes)].join("\n  ") : "  (Пусто)");

    const allLinks = [...new Set([...cluster_GitHub, ...cluster_Telegram, ...cluster_China, ...cluster_Pastes])];
    
    if (allLinks.length > 0) {
        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath, { recursive: true });
        }

        let currentContent = '';
        if (fs.existsSync(filePath)) {
            currentContent = fs.readFileSync(filePath, 'utf8');
        }

        const newLinks = allLinks.filter(link => link && link.length > 10 && !currentContent.includes(link));

        if (newLinks.length > 0) {
            fs.appendFileSync(filePath, (currentContent.endsWith('\n') ? '' : '\n') + newLinks.join('\n') + '\n');
            console.log(`\n✅ Успех! ZapMeta и ИИ-поиск дали плоды. Обновлен файл: ${relativePath}`);
            console.log(`✅ Добавлено ${newLinks.length} новых уникальных источников для Трона!`);
        } else {
            console.log("\n Все ссылки с ZapMeta и ИИ уже занесены в систему, дубликаты отсечены.");
        }
    } else {
        console.log("\n В поисковых ИИ-агрегаторах новых сырых баз пока не появилось.");
    }
}

runAllEngines();
