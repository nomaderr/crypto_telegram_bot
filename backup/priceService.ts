// src/priceService.ts
import axios from 'axios';

let for_massive_price: number | null = null;
// export async function getBitcoinPrice(): Promise<number | null> {
//     try {
//         const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=USD');
//         return response.data.bitcoin.usd;
//     } catch (error) {
//         console.error('Error fetching Bitcoin price:', error);
//         return null;
//     }
// }
// export async function getBitcoinPrice() {
//     try {
//         const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
//         console.log("Ответ API:", response.data);
//         return response.data.USD;
//     } catch (error) {
//         console.error('Error fetching Bitcoin price:', error);
//         return null;
//     }
// }

export async function getBitcoinPrice() {
    try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        console.log("Ответ API:", response.data); // Логирование для отладки
        return response.data.price; // Получаем цену из поля 'price'
    } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        return null;
    }
}

export async function getBitcoinPriceMassive() {
    try {
        const response = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD');
        for_massive_price = response.data.USD; // Обновление переменной с последней ценой
        return for_massive_price;
    } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        return null;
    }
}

// Установка интервала для регулярного получения цены
setInterval(getBitcoinPriceMassive, 1000);


// export async function getBitcoinPrice() {
//     try {
//         // Запрос к Binance API для получения цены BTC-USD
//         const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
//         return response.data.price; // Обращаемся к полю 'price' в ответе
//     } catch (error) {
//         console.error('Error fetching Bitcoin price:', error);
//         return null;
//     }
// }
//
// export async function getBitcoinPriceMassive() {
//     try {
//         const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
//         for_massive_price = response.data.price; // Обновление переменной с последней ценой
//         return for_massive_price;
//     } catch (error) {
//         console.error('Error fetching Bitcoin price:', error);
//         return null;
//     }
// }