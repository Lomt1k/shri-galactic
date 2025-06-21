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
  if (dayOfYear < 1 || dayOfYear > 365) {
    throw new Error('Число должно быть в диапазоне от 1 до 365');
  }

  const date = new Date();
  date.setMonth(0);
  date.setDate(dayOfYear);

  return `${date.getDate()} ${months[date.getMonth()]}`;
}
