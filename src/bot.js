"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/bot.ts
var TelegramBot = require("node-telegram-bot-api");
var config_1 = require("./config");
var priceService_1 = require("./priceService");
var priceService_2 = require("./priceService");
var bot = new TelegramBot(config_1.token, { polling: true });
var chatIdForNotifications = null;
var isPriceCheckActive = false;
var channelChatId = null;
var targetPrices = [
    "888",
    "777",
    "666",
    "444",
    "444",
    "666",
    "777"
];
bot.onText(/\/start/, function (msg) {
    chatIdForNotifications = msg.chat.id;
    isPriceCheckActive = true;
    // array to a formatted string
    var formattedPrices = targetPrices.join('\n');
    // doemat html-message
    var welcomeMessage = "\n<b>Welcome to Bitcoin Price Bot</b>\n<i>Get real-time prices and trigger alerts.</i>\n\n<b>Current triggers:</b>\n<pre>".concat(formattedPrices, "</pre>\n\nChoose an action:\n- <b>Bitcoin Price</b>: Get the current price of Bitcoin\n\nEnjoy using the bot!\n    ");
    bot.sendMessage(chatIdForNotifications, welcomeMessage, { parse_mode: "HTML" });
});
bot.on('channel_post', function (msg) {
    if (msg.text === '/start') {
        channelChatId = msg.chat.id; // save chanelID
        bot.sendMessage(channelChatId, 'Bot activated!');
    }
});
function checkPriceAndNotify() {
    return __awaiter(this, void 0, void 0, function () {
        var priceStr, price, digitsAfterComma, alarmCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!chatIdForNotifications) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, priceService_2.getBitcoinPriceMassive)()];
                case 1:
                    priceStr = _a.sent();
                    if (priceStr) {
                        price = parseFloat(priceStr);
                        digitsAfterComma = Math.floor(price).toString().slice(-3);
                        if (targetPrices.includes(digitsAfterComma)) {
                            alarmCount = alarmCountMap.get(digitsAfterComma) || 0;
                            if (alarmCount < 3) {
                                bot.sendMessage(chatIdForNotifications, "ALARM! Matching price: $".concat(digitsAfterComma));
                                alarmCountMap.set(digitsAfterComma, alarmCount + 1);
                            }
                        }
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
setInterval(checkPriceAndNotify, 1000);
var alarmCountMap = new Map(); // alarm count for each price
function checkPriceAndNotifyChannel() {
    return __awaiter(this, void 0, void 0, function () {
        var priceStr, price, digitsAfterComma, alarmCount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!channelChatId) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, priceService_2.getBitcoinPriceMassive)()];
                case 1:
                    priceStr = _a.sent();
                    if (priceStr) {
                        price = parseFloat(priceStr);
                        digitsAfterComma = Math.floor(price).toString().slice(-3);
                        if (targetPrices.includes(digitsAfterComma)) {
                            alarmCount = alarmCountMap.get(digitsAfterComma) || 0;
                            if (alarmCount < 3) {
                                bot.sendMessage(channelChatId, "ALARM! Matching price: $".concat(digitsAfterComma));
                                alarmCountMap.set(digitsAfterComma, alarmCount + 1);
                            }
                        }
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
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
bot.on('channel_post', function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId, text, priceStr, price;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chatId = msg.chat.id;
                text = msg.text;
                // take start command from chanel
                if (text === '/start') {
                    bot.sendMessage(chatId, 'Бот активирован в канале!');
                    // activate price check
                    isPriceCheckActive = true;
                }
                if (!(text === '/price' || text === '/Bitcoin Price')) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, priceService_1.getBitcoinPrice)()];
            case 1:
                priceStr = _a.sent();
                if (priceStr !== null) {
                    price = parseFloat(priceStr);
                    bot.sendMessage(chatId, "Current Bitcoin price: $".concat(price.toFixed(2)));
                }
                else {
                    bot.sendMessage(chatId, "Sorry, I couldn't fetch the Bitcoin price.");
                }
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
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
bot.onText(/Bitcoin Price/, function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId, priceStr, price;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chatId = msg.chat.id;
                return [4 /*yield*/, (0, priceService_1.getBitcoinPrice)()];
            case 1:
                priceStr = _a.sent();
                if (priceStr !== null) {
                    price = parseFloat(priceStr);
                    bot.sendMessage(chatId, "Current Bitcoin price: $".concat(price.toFixed(2)));
                }
                else {
                    bot.sendMessage(chatId, "Sorry, I couldn't fetch the Bitcoin price.");
                }
                return [2 /*return*/];
        }
    });
}); });
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Your Chat ID is: ${chatId}`);
});