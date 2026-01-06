export interface AuthInput { 
  email: string; 
  password: string; 
}

export interface AuthOutput { 
  success: boolean; 
  token?: string; 
  error?: string; 
}

export interface WeatherInput { 
  city: string; 
}

export interface WeatherOutput { 
  city: string; 
  temp: number; 
  conditions: string; 
}

export interface AppError { 
  error: "API_ERROR" | "VALIDATION_ERROR"; 
  message: string; 
}