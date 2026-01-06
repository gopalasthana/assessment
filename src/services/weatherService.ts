import axios from 'axios';
import { WeatherOutput } from '../types';


const cache = new Map<string, { data: WeatherOutput; expiry: number }>();

export class WeatherService {
 static async getWeatherData(
  city: string,
  options?: { retries?: number; delay?: number }
): Promise<WeatherOutput> {

  const retries = options?.retries ?? 2;
  const delay = options?.delay ?? 1000;

  const cached = cache.get(city);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }

  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=mock_key`
    );

    const result: WeatherOutput = {
      city: data.name,
      temp: Number((data.main.temp - 273.15).toFixed(2)),
      conditions: data.weather[0].main
    };

    cache.set(city, { data: result, expiry: Date.now() + 60000 });
    return result;

  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying API... Attempts left: ${retries}`);
      await new Promise(res => setTimeout(res, delay));
      return this.getWeatherData(city, {
        retries: retries - 1,
        delay: delay * 2
      });
    }
    throw error;
  }
}

}