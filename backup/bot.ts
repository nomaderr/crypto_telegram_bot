// src/bot.ts
import * as TelegramBot from 'node-telegram-bot-api';
import { token } from './config';
import { getBitcoinPrice } from './priceService';
import { getBitcoinPriceMassive } from './priceService';

const bot = new TelegramBot(token, { polling: true });
let chatIdForNotifications: number | null = null;
let isPriceCheckActive = false;

const targetPrices = [
    "888.00",
    "777.00",
    "666.00",
    "444.00",
    "444.44",
    "666.66",
    "777.77"

];


bot.onText(/\/start/, (msg) => {
    chatIdForNotifications = msg.chat.id;
    isPriceCheckActive = true;
    // Преобразование массива цен в форматированную строку
    const formattedPrices = targetPrices.join('\n');

    // Форматированное HTML-сообщение
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

// async function checkPriceAndNotify() {
//     if (isPriceCheckActive && chatIdForNotifications) {
//         const price = await getBitcoinPriceMassive();
//         if (price) {
//             // const priceStr = price.toFixed(2);
//             const formattedPrice = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
//             // Отправка текущей цены в чат
//             bot.sendMessage(chatIdForNotifications, `Current Bitcoin price: $${formattedPrice}`);
//
//             // Проверка на совпадение с targetPrices и отправка уведомления
//             if (targetPrices.includes(formattedPrice)) {
//                 bot.sendMessage(chatIdForNotifications, `ALARM! Matching price: $${formattedPrice}`);
//             }
//         }
//     }
// }
async function checkPriceAndNotify() {
    if (isPriceCheckActive && chatIdForNotifications) {
        const price = await getBitcoinPriceMassive();
        if (price) {
            const formattedPrice = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const digitsAfterComma = Math.floor(price).toString().slice(-3); // Три цифры после запятой (тысячные)
            const digitsAfterDot = price.toFixed(2).split('.')[1]; // Две цифры после точки (сотые)

            // Отправка текущей цены в чат с дополнительными цифрами
            // bot.sendMessage(chatIdForNotifications, `Current Bitcoin price: $${formattedPrice} (digits after comma: ${digitsAfterComma}, after dot: ${digitsAfterDot})`);

            // Проверка на совпадение с targetPrices и отправка уведомления
            // if (targetPrices.includes(digitsAfterComma)) {
            //     bot.sendMessage(chatIdForNotifications, `ALARM! Matching price: $${digitsAfterComma}`);
            if (targetPrices.includes(`${digitsAfterComma}.${digitsAfterDot}`)) {
                bot.sendMessage(chatIdForNotifications, `ALARM! Matching price: $${digitsAfterComma}.${digitsAfterDot}`);
            }
        }
    }
}
// Установка интервала для проверки цены
setInterval(checkPriceAndNotify, 1000);

// bot.onText(/Bitcoin Price/, async (msg) => {
//     chatIdForNotifications = msg.chat.id;
//     const chatId = msg.chat.id;
//     const price = await getBitcoinPrice();
//     if (price !== null) {
//         bot.sendMessage(chatId, `Current Bitcoin price: $${price}`);
//     } else {
//         bot.sendMessage(chatId, "Sorry, I couldn't fetch the Bitcoin price.");
//     }
// });


bot.onText(/Bitcoin Price/, async (msg) => {
    const chatId = msg.chat.id;
    const priceStr = await getBitcoinPrice();
    if (priceStr !== null) {
        const price = parseFloat(priceStr); // Преобразование строки в число
        bot.sendMessage(chatId, `Current Bitcoin price: $${price.toFixed(2)}`);
    } else {
        bot.sendMessage(chatId, "Sorry, I couldn't fetch the Bitcoin price.");
    }
});
