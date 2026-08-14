const mineflayer = require('mineflayer');
const http = require('http');

// 1. Простой веб-сервер для Render и cron-job.org
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.write("AFK Bot is alive on Render 24/7!");
    res.end();
}).listen(PORT, () => {
    console.log(`🌐 Веб-сервер запущен на порту ${PORT}`);
});

// 2. Функция создания бота
function createBot() {
    console.log('⏳ Подключение бота к Aternos...');

    const bot = mineflayer.createBot({
        host: 'CritReason.aternos.me',
        port: 33086, // ⚠️ ПРОВЕРЬ ЭТОТ ПОРТ НА ATERNOS (он меняется при каждом перезапуске)
        username: 'AFK_Bot_Render',
        version: false,         // Игнорирует проверку версии для работы со снапшотом 26.2
        skipValidation: true,   // Пропускает лишние проверки пинга, обходя ошибку ETIMEDOUT
        checkTimeoutInterval: 60 * 1000
    });

    // Успешный заход на сервер
    bot.on('spawn', () => {
        console.log('✅ Бот успешно зашел на сервер!');
    });

    // Анти-AFK прыжок каждые 40 секунд
    bot.on('spawn', () => {
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 40000);
    });

    // Обработка отключения и авто-переподключение
    bot.on('end', () => {
        console.log('⚠️ Бот отключился. Повторное подключение через 15 секунд...');
        setTimeout(createBot, 15000);
    });

    // Логирование ошибок
    bot.on('error', err => {
        console.log('❌ Ошибка бота:', err.message);
    });
}

createBot();
