const config = {
  apiUrl: import.meta.env.VITE_API_URL || (process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5000/api')
};

export default config; 