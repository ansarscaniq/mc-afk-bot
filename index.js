const mineflayer = require('mineflayer');
const http = require('http');

// 1. Веб-сервер для Render и cron-job.org
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.write("AFK Bot is alive on Render 24/7!");
    res.end();
}).listen(PORT, () => {
    console.log(`🌐 Веб-сервер запущен на порту ${PORT}`);
});

// 2. Функция создания бота с прямым DynIP
function createBot() {
    console.log('⏳ Подключение бота к Aternos через DynIP...');

    const bot = mineflayer.createBot({
        host: 'sheatfish.aternos.host', // Твой прямой DynIP хост
        port: 33086,                   // Твой порт
        username: 'AFK_Bot_Render',
        version: false,                // Обход проверки снапшота 26.2
        skipValidation: true,          // Обход блокировок и ошибок ETIMEDOUT
        checkTimeoutInterval: 60 * 1000
    });

    // Успешный вход
    bot.on('spawn', () => {
        console.log('✅ Бот успешно зашел на сервер!');
    });

    // Прыжок каждые 40 секунд против AFK-кика
    bot.on('spawn', () => {
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 40000);
    });

    // Авто-переподключение при отключении
    bot.on('end', () => {
        console.log('⚠️ Бот отключился. Повторное подключение через 15 секунд...');
        setTimeout(createBot, 15000);
    });

    // Обработка ошибок
    bot.on('error', err => {
        console.log('❌ Ошибка бота:', err.message);
    });
}

createBot();
