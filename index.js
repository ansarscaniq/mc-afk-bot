const mineflayer = require('mineflayer');
const http = require('http');

http.createServer((req, res) => {
    res.write("AFK Bot is alive and running 24/7!");
    res.end();
}).listen(process.env.PORT || 3000);

function createBot() {
    const bot = mineflayer.createBot({
        host: 'CritReason.aternos.me',
        port: 33086,
        username: 'AFK_Bot_Render',
        checkTimeoutInterval: 60 * 1000 // Увеличиваем таймаут для стабильного входа
    });

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

    bot.on('end', () => {
        console.log('⚠️ Отключение от сервера. Переподключение через 15 секунд...');
        setTimeout(createBot, 15000);
    });

    bot.on('error', err => {
        console.log('❌ Ошибка подключения:', err.message);
    });
}

createBot();
