import { describe, test, expect } from 'vitest';
import { getDayOfMonthString } from './dateHelper';

describe('Функция getDayOfMonthString', () => {
  test('возвращает правильную строку для дня 0', () => {
    const result = getDayOfMonthString(0);
    expect(result).toBe('1 января');
  });

  test('возвращает правильную строку для дня 364', () => {
    const result = getDayOfMonthString(364);
    expect(result).toBe('31 декабря');
  });

  test('возвращает правильную строку для последнего дня февраля (58)', () => {
    const result = getDayOfMonthString(58);
    expect(result).toBe('28 февраля');
  });

  test('возвращает правильную строку для первого дня марта (59)', () => {
    const result = getDayOfMonthString(59);
    expect(result).toBe('1 марта');
  });

  test('выбрасывает ошибку при значении меньше 0', () => {
    expect(() => getDayOfMonthString(-1)).toThrow('Число должно быть в диапазоне от 0 до 364');
  });

  test('выбрасывает ошибку при значении больше 364', () => {
    expect(() => getDayOfMonthString(365)).toThrow('Число должно быть в диапазоне от 0 до 364');
  });
});
