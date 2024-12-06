// src/priceService.ts
import axios from 'axios';

let for_massive_price: number | null = null;


export async function getBitcoinPrice() {
    try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        console.log("responce API:", response.data); // logging
        return response.data.price; // get from 'price'
    } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        return null;
    }
}

// export async function getBitcoinPriceMassive() {
export async function getBitcoinPriceMassive(): Promise<string | null> {
    try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        for_massive_price = response.data.USD; //
        // return for_massive_price;
        return response.data.price.toString();
    } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        return null;
    }
}


setInterval(getBitcoinPriceMassive, 1000);


