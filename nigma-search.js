const fs = require('fs');
const https = require('https');

// ИСПРАВЛЕНО: Запрос очищен от локальных рамок. Теперь он ищет глобальные мировые подписки и конфигурации для Трона и Синбокса по всей планете!
const query = "v2ray sing-box subscription txt node config share free vless trojan hy2 tuic";
const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

console.log("🚀 Запуск глобального ИИ-кластеризатора по всему миру...");
console.log("⚙️ Прочесываем мировые базы данных для Xray-core и Sing-box...");
console.log("🟢 Скорость Node.js v22, работаем спокойно и аккуратно...");

const options = {
    headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
    }
};

https.get(url, options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        // Проверенное строгое регулярное выражение для сбора чистых URL
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

                // БЕЗОПАСНЫЙ КОНВЕРТЕР В RAW-ФОРМАТ (Убираем HTML-код, оставляем голый текст)
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

                // Умная Нигма-кластеризация по полочкам (Сортируем: что откуда пришло)
                if (finalUrl.includes("raw.githubusercontent.com") || finalUrl.includes("github.io")) {
                    cluster_GitHub.push(finalUrl);
                } else if (finalUrl.includes("t.me/s/")) {
                    cluster_Telegram.push(finalUrl);
                } else if (finalUrl.includes("pastebin.com/raw") || finalUrl.includes("rentry.co")) {
                    cluster_Pastes.push(finalUrl);
                } else if (finalUrl.includes("v2rayshare") || finalUrl.includes("clashnode") || finalUrl.includes("nodefree") || finalUrl.includes("clashfree")) {
                    cluster_China.push(finalUrl); // Сюда же падают крупные международные агрегаторы
                }
            }
        }

        // Вывод мировых кластеров в логи коммита GitHub Actions
        console.log("\n📦 КЛАСТЕР [ GLOBAL GITHUB / RAW-ИСТОЧНИКИ ]:");
        console.log(cluster_GitHub.length > 0 ? [...new Set(cluster_GitHub)].join("\n  ") : "  (Пусто)");
        
        console.log("\n✈️ КЛАСТЕР [ МЕЖДУНАРОДНЫЕ ТЕЛЕГРАМ-АРХИВЫ ]:");
        console.log(cluster_Telegram.length > 0 ? [...new Set(cluster_Telegram)].join("\n  ") : "  (Пусто)");
        
        console.log("\n🌏 КЛАСТЕР [ МИРОВЫЕ КРУПНЫЕ АГРЕГАТОРЫ И СЕТЕВЫЕ БАЗЫ ]:");
        console.log(cluster_China.length > 0 ? [...new Set(cluster_China)].join("\n  ") : "  (Пусто)");
        
        console.log("\n📄 КЛАСТЕР [ ГЛОБАЛЬНЫЕ ТЕКСТОВЫЕ ПАСТЫ / REENTRY ]:");
        console.log(cluster_Pastes.length > 0 ? [...new Set(cluster_Pastes)].join("\n  ") : "  (Пусто)");

        const allLinks = [...new Set([...cluster_GitHub, ...cluster_Telegram, ...cluster_China, ...cluster_Pastes])];
        
        if (allLinks.length > 0) {
            const filePath = 'data/unique/http.txt';
            const dir = 'data/unique';
            
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir, { recursive: true });
            }

            let currentContent = '';
            if (fs.existsSync(filePath)) {
                currentContent = fs.readFileSync(filePath, 'utf8');
            }

            // Фильтруем дубликаты, бережно охраняя твои ручные списки
            const newLinks = allLinks.filter(link => link && link.length > 10 && !currentContent.includes(link));

            if (newLinks.length > 0) {
                // Записываем строго с новой строки
                fs.appendFileSync(filePath, (currentContent.endsWith('\n') ? '' : '\n') + newLinks.join('\n') + '\n');
                console.log(`\n✅ Мировой масштаб! Добавлено ${newLinks.length} новых глобальных RAW-источников для Синбокса и Трона в http.txt!`);
            } else {
                console.log("\n Все найденные мировые базы уже занесены в систему, дубликаты отсечены.");
            }
        } else {
            console.log("\n На просторах интернета новых сырых баз пока не появилось.");
        }
    });
}).on('error', (e) => {
    console.error(`🚨 Сбой сети при работе глобальной Нигмы: ${e.message}`);
});
