import { AuthInput, AuthOutput, WeatherInput, AppError } from '../types';
import { WeatherService } from '../services/weatherService';


export const loginHandler = async (event: AuthInput): Promise<AuthOutput> => {

  const isEmailValid = event.email && event.email.includes('@');
  
  const isPasswordValid = event.password && event.password.length >= 8;

  if (!isEmailValid || !isPasswordValid) {

    return { success: false, error: "Invalid email or password" };
  }
  
  return { success: true, token: "mockToken123" };
};


export const weatherHandler = async (event: WeatherInput) => {
  try {
    return await WeatherService.getWeatherData(event.city);
  } catch (error: any) {
    console.error("Error Logged:", error.message);

    const errorResponse: AppError = {
      error: "API_ERROR",
      message: error.response?.status === 404
        ? "City not found"
        : "External API failed"
    };

    return errorResponse;
  }
};



export const authorizer = async (event: any) => {
  
  const authHeader = event.headers?.Authorization || event.headers?.authorization;
  
 
  const isValid = authHeader === 'Bearer validToken123';
  
  
  return { isAuthorized: isValid };
};