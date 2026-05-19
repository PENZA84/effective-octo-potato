const fs = require('fs');
const https = require('https');
const path = require('path');

// Глобальный мировой запрос под Трон (Xray) и Синбокс (Sing-box)
const query = "v2ray sing-box subscription txt node config share free vless trojan hy2 tuic";
const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

console.log("🚀 Запуск глобального ИИ-кластеризатора Нигма...");
console.log("⚙️ Система настроена под ядра Xray-core и Sing-box [Node.js v22]...");

const options = {
    headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
    }
};

// УМНОЕ ОПРЕДЕЛЕНИЕ ПУТИ К ТВОЕМУ HTTP.TXT
let relativePath = 'data/unique/http.txt';
// Если на гитхабе папка data лежит внутри коллектора, скрипт сам переключит рельсы:
if (fs.existsSync('v2ray_config_collector')) {
    relativePath = 'v2ray_config_collector/data/unique/http.txt';
}

const filePath = path.resolve(relativePath);
const dirPath = path.dirname(filePath);

https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        const regex = /class="result__url"[^>]*href="([^"]+)"/g;
        let match;
        
        const cluster_GitHub = [];
        const cluster_Telegram = [];
        const cluster_China = [];
        const cluster_Pastes = [];

        while ((match = regex.exec(data)) !== null) {
            let rawUrl = decodeURIComponent(match[1]);
            const urlMatch = rawUrl.match(/uddg=(.+?)(&|$)/);
            
            if (urlMatch) {
                let cleanUrl = decodeURIComponent(urlMatch[1]).trim();
                if (!cleanUrl.startsWith('http')) continue;

                let finalUrl = cleanUrl;

                // МИРОВОЙ RAW-КОНВЕРТЕР (Оставляем только чистый текст конфигураций)
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

                // Распределяем по полочкам-кластерам
                if (finalUrl.includes("raw.githubusercontent.com") || finalUrl.includes("github.io")) {
                    cluster_GitHub.push(finalUrl);
                } else if (finalUrl.includes("t.me/s/")) {
                    cluster_Telegram.push(finalUrl);
                } else if (finalUrl.includes("pastebin.com/raw") || finalUrl.includes("rentry.co")) {
                    cluster_Pastes.push(finalUrl);
                } else if (finalUrl.includes("v2rayshare") || finalUrl.includes("clashnode") || finalUrl.includes("nodefree") || finalUrl.includes("clashfree")) {
                    cluster_China.push(finalUrl);
                }
            }
        }

        // Вывод отчетов в логи GitHub Actions
        console.log("\n📦 КЛАСТЕР [ GLOBAL GITHUB / RAW ]:");
        console.log(cluster_GitHub.length > 0 ? [...new Set(cluster_GitHub)].join("\n  ") : "  (Пусто)");
        
        console.log("\n✈️ КЛАСТЕР [ МЕЖДУНАРОДНЫЕ ТЕЛЕГРАМ-АРХИВЫ ]:");
        console.log(cluster_Telegram.length > 0 ? [...new Set(cluster_Telegram)].join("\n  ") : "  (Пусто)");
        
        console.log("\n🌏 КЛАСТЕР [ МИРОВЫЕ БАЗЫ И АГРЕГАТОРЫ ]:");
        console.log(cluster_China.length > 0 ? [...new Set(cluster_China)].join("\n  ") : "  (Пусто)");
        
        console.log("\n📄 КЛАСТЕР [ ГЛОБАЛЬНЫЕ ТЕКСТОВЫЕ ПАСТЫ ]:");
        console.log(cluster_Pastes.length > 0 ? [...new Set(cluster_Pastes)].join("\n  ") : "  (Пусто)");

        const allLinks = [...new Set([...cluster_GitHub, ...cluster_Telegram, ...cluster_China, ...cluster_Pastes])];
        
        if (allLinks.length > 0) {
            // Спокойно создаем папки по ходу движения, если их еще нет
            if (!fs.existsSync(dirPath)){
                fs.mkdirSync(dirPath, { recursive: true });
            }

            let currentContent = '';
            if (fs.existsSync(filePath)) {
                currentContent = fs.readFileSync(filePath, 'utf8');
            }

            // Фильтруем дубликаты
            const newLinks = allLinks.filter(link => link && link.length > 10 && !currentContent.includes(link));

            if (newLinks.length > 0) {
                fs.appendFileSync(filePath, (currentContent.endsWith('\n') ? '' : '\n') + newLinks.join('\n') + '\n');
                console.log(`\n✅ Целевой файл: ${relativePath}`);
                console.log(`✅ Успешно добавлено ${newLinks.length} новых мировых RAW-источников!`);
            } else {
                console.log("\n Все найденные базы уже сохранены в http.txt, дубликаты отсечены.");
            }
        } else {
            console.log("\n Новых уникальных ссылок в этом цикле не обнаружено.");
        }
    });
}).on('error', (e) => {
    console.error(`🚨 Сбой сети при работе глобальной Нигмы: ${e.message}`);
});
