export function generateRandomValue(min:number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[], count?: number): T[] {
  if (count === undefined) {
    const start = generateRandomValue(0, items.length);
    count = generateRandomValue(1, items.length - start + 1);
    return items.slice(start, start + count);
  }

  const startPosition = generateRandomValue(0, items.length - count + 1);
  return items.slice(startPosition, startPosition + count);
}

export function getRandomItem<T>(items: T[]):T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getRandomBoolean(): boolean {
  return getRandomItem<boolean>([true, false]);
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}
