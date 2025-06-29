import { validateResponse } from '@/shared/api';

export const fetchReport = async (): Promise<Blob> => {
  const url = new URL('http://localhost:3000/report');
  url.searchParams.append('size', '0.01');

  const response = await fetch(url);
  await validateResponse(response).catch((error) => {
    throw error;
  });

  const blob = await response.blob();
  if (!blob) {
    throw new Error('Failed to retrieve blob data');
  }

  return blob;
};
