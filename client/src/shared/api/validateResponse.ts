export const validateResponse = async (response: Response): Promise<void> => {
  if (response.ok) return;
  let serverError: string | null = null;
  try {
    const json = await response.json();
    if ('error' in json && typeof json.error === 'string') serverError = json.error;
  } catch {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  if (serverError) throw new Error(serverError);
  throw new Error(`${response.status} ${response.statusText}`);
};
