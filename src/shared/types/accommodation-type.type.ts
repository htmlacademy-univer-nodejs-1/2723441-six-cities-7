export const AccommodationTypes = ['apartment', 'house', 'room', 'hotel'] as const;
export type AccommodationType = typeof AccommodationTypes[number];

export function isAccommodationType(type: string): AccommodationType | undefined {
  return AccommodationTypes.find((el) => el === type);
}
