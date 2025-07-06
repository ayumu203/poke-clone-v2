// Debug utility to check environment variables
export const checkEnvironmentVariables = () => {
  console.log('=== Environment Variables Debug ===');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
  console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('=== End Debug ===');
};

export const getApiUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  console.log('Using API URL:', apiUrl);
  return apiUrl;
};
