import { loginHandler, authorizer, weatherHandler } from '../handlers/main';
import axios from 'axios';
import { WeatherService } from '../services/weatherService';



jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Backend Assessment Tests', () => {
  
  describe('Task 1: Auth Validation', () => {
    test('Should return success for valid email and password', async () => {
      const res = await loginHandler({ email: "test@gmail.com", password: "password123" });
      expect(res.success).toBe(true);
      expect(res.token).toBe("mockToken123");
    });

    test('Should return failure for invalid email format', async () => {
      const res = await loginHandler({ email: "invalid-mail", password: "password123" });
      expect(res.success).toBe(false);
      expect(res.error).toBe("Invalid email or password");
    });
  });


  describe('Task 2 & 3: Weather & Error Handling', () => {
    test('Task 2: Should return weather data in Celsius (273.15 Kelvin = 0 Celsius)', async () => {
      
      mockedAxios.get.mockResolvedValue({
        data: {
          name: "London",
          main: { temp: 273.15 },
          weather: [{ main: "Cloudy" }]
        }
      });

      const res: any = await weatherHandler({ city: "London" });
      
      expect(res.city).toBe("London");
      expect(res.temp).toBe(0); 
      expect(res.conditions).toBe("Cloudy");
    });

   test('Task 3: Should handle API failure and return structured error', async () => {
  mockedAxios.get.mockRejectedValue(new Error("API Failed"));

  jest
    .spyOn(WeatherService, 'getWeatherData')
    .mockRejectedValueOnce(new Error("API Failed"));

  const res: any = await weatherHandler({ city: "Unknown" });

  expect(res.error).toBe("API_ERROR");
  expect(res.message).toBe("External API failed");
});

  });

 
  describe('Task 4: Lambda Authorizer', () => {
    test('Should authorize valid Bearer token', async () => {
      const event = { headers: { Authorization: "Bearer validToken123" } };
      const res = await authorizer(event);
      expect(res.isAuthorized).toBe(true);
    });

    test('Should reject invalid token', async () => {
      const event = { headers: { Authorization: "Bearer wrongToken" } };
      const res = await authorizer(event);
      expect(res.isAuthorized).toBe(false);
    });
  });
});