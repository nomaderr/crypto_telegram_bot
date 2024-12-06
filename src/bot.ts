// src/bot.ts
import * as TelegramBot from 'node-telegram-bot-api';
import { token } from './config';
import { getBitcoinPrice } from './priceService';
import { getBitcoinPriceMassive } from './priceService';
const fs = require('fs');
const path = require('path');

const bot = new TelegramBot(token, { polling: true });
let chatIdForNotifications: number | null = null;
let isPriceCheckActive = false;
let channelChatId = null;

const targetPrices = [
    "888",
    "777",
    "666",
    "444",
    "444",
    "666",
    "777"

];


bot.onText(/\/start/, (msg) => {
    chatIdForNotifications = msg.chat.id;
    isPriceCheckActive = true;
    // array to a formatted string
    const formattedPrices = targetPrices.join('\n');

    // doemat html-message
    const welcomeMessage = `
<b>Welcome to Bitcoin Price Bot</b>
<i>Get real-time prices and trigger alerts.</i>

<b>Current triggers:</b>
<pre>${formattedPrices}</pre>

Choose an action:
- <b>Bitcoin Price</b>: Get the current price of Bitcoin

Enjoy using the bot!
    `;

    bot.sendMessage(chatIdForNotifications, welcomeMessage, { parse_mode: "HTML" });
});

bot.on('channel_post', (msg) => {
    if (msg.text === '/start') {
        channelChatId = msg.chat.id; // save chanelID
        bot.sendMessage(channelChatId, 'Bot activated!');
    }
});

async function checkPriceAndNotify() {
    if (chatIdForNotifications) {
        const priceStr = await getBitcoinPriceMassive();
        if (priceStr) {
            const price = parseFloat(priceStr);
            const digitsAfterComma = Math.floor(price).toString().slice(-3);

            if (targetPrices.includes(digitsAfterComma)) {
                let alarmCount = alarmCountMap.get(digitsAfterComma) || 0;

                if (alarmCount < 3) {
                    bot.sendMessage(chatIdForNotifications, `ALARM! Matching price: $${digitsAfterComma}`);
                    alarmCountMap.set(digitsAfterComma, alarmCount + 1);
                }
            }
        }
    }
}
setInterval(checkPriceAndNotify, 1000);

let alarmCountMap = new Map(); // alarm count for each price
async function checkPriceAndNotifyChannel() {
    if (channelChatId) {
        const priceStr = await getBitcoinPriceMassive();
        if (priceStr) {
            const price = parseFloat(priceStr);
            const digitsAfterComma = Math.floor(price).toString().slice(-3);

            if (targetPrices.includes(digitsAfterComma)) {
                let alarmCount = alarmCountMap.get(digitsAfterComma) || 0;

                if (alarmCount < 3) {
                    bot.sendMessage(channelChatId, `ALARM! Matching price: $${digitsAfterComma}`);
                    alarmCountMap.set(digitsAfterComma, alarmCount + 1);
                }
            }
        }
    }
}

setInterval(checkPriceAndNotifyChannel, 1000);


// let alarmCount = 0; // Счётчик для отслеживания количества отправленных алармов
//
// async function checkPriceAndNotifyChannel() {
//     if (channelChatId && alarmCount < 3) { // Проверяем, не достигнут ли лимит алармов
//         const priceStr = await getBitcoinPriceMassive();
//         if (priceStr) {
//             const price = parseFloat(priceStr);
//             const digitsAfterComma = Math.floor(price).toString().slice(-3);
//
//             if (targetPrices.includes(digitsAfterComma)) {
//                 bot.sendMessage(channelChatId, `ALARM! Matching price: $${digitsAfterComma}`);
//                 alarmCount++; // Увеличиваем счётчик после отправки аларма
//             }
//         }
//     }
// }
//
// setInterval(checkPriceAndNotifyChannel, 1000); // Проверяем каждую секунду

// async function checkPriceAndNotifyChannel() {
//     if (channelChatId) {
//         const priceStr = await getBitcoinPriceMassive();
//         if (priceStr) {
//             const price = parseFloat(priceStr);
//             const digitsAfterComma = Math.floor(price).toString().slice(-3);
//
//             if (targetPrices.includes(digitsAfterComma)) {
//                 bot.sendMessage(channelChatId, `ALARM! Matching price: $${digitsAfterComma}`);
//             }
//         }
//     }
// }
//
// // Установка интервала для проверки цены и отправки уведомлений в канал
// setInterval(checkPriceAndNotifyChannel, 1000);

bot.on('channel_post', async (msg) => {
    const chatId = msg.chat.id; // take id chanel
    const text = msg.text; // test message

    // take start command from chanel
    if (text === '/start') {
        bot.sendMessage(chatId, 'Бот активирован в канале!');
        // activate price check
        isPriceCheckActive = true;
    }


    if (text === '/price' || text === '/Bitcoin Price') {
        const priceStr = await getBitcoinPrice();
        if (priceStr !== null) {
            const price = parseFloat(priceStr);
            bot.sendMessage(chatId, `Current Bitcoin price: $${price.toFixed(2)}`);
        } else {
            bot.sendMessage(chatId, "Sorry, I couldn't fetch the Bitcoin price.");
        }
    }
});




// async function checkPriceAndNotify() {
//     if (isPriceCheckActive && chatIdForNotifications) {
//         const priceStr = await getBitcoinPriceMassive();
//         if (priceStr) {
//             // Преобразование строки в число
//             const price = parseFloat(priceStr);
//
//             // Извлечение последних трех цифр до точки
//             const digitsAfterComma = Math.floor(price).toString().slice(-3);
//
//             console.log("Проверяемые цифры:", digitsAfterComma); // Должно вывести корректное значение, например "757" для "41757.58"
//
//             // Сравнение с targetPrices и отправка уведомления
//             if (targetPrices.includes(digitsAfterComma)) {
//                 bot.sendMessage(chatIdForNotifications, `ALARM! Matching price: $${digitsAfterComma}`);
//             }
//         }
//     }
// }
// setInterval(checkPriceAndNotify, 1000);




bot.onText(/Bitcoin Price/, async (msg) => {
    const chatId = msg.chat.id;
    const priceStr = await getBitcoinPrice();
    if (priceStr !== null) {
        const price = parseFloat(priceStr); // string to a number
        bot.sendMessage(chatId, `Current Bitcoin price: $${price.toFixed(2)}`);
    } else {
        bot.sendMessage(chatId, "Sorry, I couldn't fetch the Bitcoin price.");
    }
});

bot.on('message', (msg) => {
    if (msg.new_chat_members) {
        msg.new_chat_members.forEach(member => {
            const userDetail = `Новый участник: ID=${member.id}, Имя=${member.first_name} ${member.last_name || ''}, Username=@${member.username}\n`;
            logToFile(userDetail);
        });
    }

    if (msg.left_chat_member) {
        const userDetail = `Участник вышел: ID=${msg.left_chat_member.id}, Имя=${msg.left_chat_member.first_name} ${msg.left_chat_member.last_name || ''}, Username=@${msg.left_chat_member.username}\n`;
        logToFile(userDetail);
    }
});

function logToFile(data) {
    const filePath = path.join(__dirname, 'members_log.txt');
    fs.appendFile(filePath, data, (err) => {
        if (err) console.error('Ошибка при записи в файл:', err);
        else console.log('Данные участника записаны в файл');
    });
}