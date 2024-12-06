// src/bot.ts
import * as TelegramBot from 'node-telegram-bot-api';
import { token } from './config';
import { getBitcoinPrice } from './priceService';
import { getBitcoinPriceMassive } from './priceService';

const bot = new TelegramBot(token, { polling: true });
let chatIdForNotifications: number | null = null;
let isPriceCheckActive = false;

const targetPrices = [
    "888",
    "777",
    "666",
    "444",
    "444",
    "666",
    "777",
    "687",
    "690",
    "699",
    "712",
    "771",
    "769"

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

async function checkPriceAndNotify() {
    if (isPriceCheckActive && chatIdForNotifications) {
        const priceStr = await getBitcoinPriceMassive();
        if (priceStr) {
            // Преобразование строки в число
            const price = parseFloat(priceStr);

            // Извлечение последних трех цифр до точки
            const digitsAfterComma = Math.floor(price).toString().slice(-3);

            console.log("Проверяемые цифры:", digitsAfterComma); // Должно вывести корректное значение, например "757" для "41757.58"

            // Сравнение с targetPrices и отправка уведомления
            if (targetPrices.includes(digitsAfterComma)) {
                bot.sendMessage(chatIdForNotifications, `ALARM! Matching price: $${digitsAfterComma}`);
            }
        }
    }
}
setInterval(checkPriceAndNotify, 1000);




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
