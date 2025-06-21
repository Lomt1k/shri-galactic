export const fetchReport = async (): Promise<Blob> => {
  const url = new URL('http://localhost:3000/report');
  url.searchParams.append('size', '0.01');

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Сетевая ошибка: ${response.status} ${response.statusText}`);
  return await response.blob();
};
