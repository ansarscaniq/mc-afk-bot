const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'critreason.aternos.me',
        port: 33086,                   // Твой порт
        username: 'AFK_Bot_Render',    // Ник бота
        version: false                 // Авто-определение версии сервера
    });

    bot.on('spawn', () => {
        console.log('✅ Бот успешно зашел на сервер и держит Aternos онлайн!');
    });

    // Анти-афк (подпрыгивает каждые 40 секунд, чтобы сервер не кикал за инактивити)
    bot.on('spawn', () => {
        setInterval(() => {
            if (bot && bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 40000);
    });

    // Авто-переподключение при вылете
    bot.on('end', () => {
        console.log('⚠️ Бот отключился от сервера. Переподключение через 15 секунд...');
        setTimeout(createBot, 15000);
    });

    bot.on('error', err => {
        console.log('❌ Ошибка подключения:', err.message);
    });
}

createBot();
