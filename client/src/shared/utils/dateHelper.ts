const months = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

export function getDayOfMonthString(dayOfYear: number): string {
  if (dayOfYear < 0 || dayOfYear > 364) {
    throw new Error('Число должно быть в диапазоне от 0 до 364');
  }

  // По условиям задания год не указан, считаем что 2025 (любой невисокосный)
  // Точно знаем, что dayOfYear в диапазоне от 0 до 364
  const date = new Date(2025, 0, 1);
  date.setDate(dayOfYear + 1);

  return `${date.getDate()} ${months[date.getMonth()]}`;
}
