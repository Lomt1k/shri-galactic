import { validateResponse } from '@/shared/api';

export const fetchReport = async (): Promise<Blob> => {
  const url = new URL('http://localhost:3000/report');
  url.searchParams.append('size', '0.01');

  const response = await fetch(url);
  await validateResponse(response).catch((error) => {
    throw error;
  });
  return await response.blob();
};
