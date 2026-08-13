const mineflayer = require('mineflayer');
const http = require('http');

// 1. Создаём мини-веб-сервер для получения бесплатного Web Service на Render
http.createServer((req, res) => {
    res.write("AFK Bot is alive and running 24/7!");
    res.end();
}).listen(process.env.PORT || 3000);

// 2. Функция запуска и поддержки бота
function createBot() {
    const bot = mineflayer.createBot({
        host: 'critreason.aternos.me',
        port: 33086,                   // Твой текущий порт Aternos
        username: 'AFK_Bot_Render',    // Ник бота в игре
        version: false                 // Авто-определение версии сервера
    });

    bot.on('spawn', () => {
        console.log('✅ Бот успешно зашел на сервер!');
    });

    // 3. Анти-AFK: прыжок каждые 40 секунд против кика за инактивити
    bot.on('spawn', () => {
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 40000);
    });

    // 4. Авто-переподключение при вылете
    bot.on('end', () => {
        console.log('⚠️ Отключение от сервера. Переподключение через 15 секунд...');
        setTimeout(createBot, 15000);
    });

    bot.on('error', err => {
        console.log('❌ Ошибка подключения:', err.message);
    });
}

createBot();
