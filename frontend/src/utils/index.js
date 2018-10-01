import { lendingType, bikeType, breakdownType } from './modelTypes.js';

export { lendingType, bikeType, breakdownType };

const byTimeLent = (a, b) =>
  Math.sign(new Date(a.time.lent).getTime() - new Date(b.time.lent).getTime());

const dateEq = (a, b) => new Date(a).getTime() === new Date(b).getTime();

export const getLatestLendings = (bikes, lendings) =>
  bikes
    .map(
      bike =>
        lendings
          .filter(lending => {
            return lending.bikeNumber === bike.bikeNumber;
          })
          .sort(byTimeLent)
          .slice(-1)[0]
    )
    .filter(lending => lending !== undefined);

export const getLentBikes = (bikes, lendings) => {
  if (!bikes.length || !lendings.length) return [];
  const latestLendings = getLatestLendings(bikes, lendings);

  return bikes.filter(bike => {
    // Get the latest lending of this bike
    const latestBikeLending = latestLendings.filter(
      lending => lending.bikeNumber === bike.bikeNumber
    )[0];

    // Check if the bike has lendings
    if (!latestBikeLending) return false;

    // Check if the bike hasn't been returned yet
    return dateEq(latestBikeLending.time.returned, 0);
  });
};

export const getAvailableBikes = (bikes, lendings) => {
  if (!bikes.length || !lendings.length) return [];
  const latestLendings = getLatestLendings(bikes, lendings);

  return bikes.filter(bike => {
    // Get the latest lending of this bike
    const latestBikeLending = latestLendings.filter(
      lending => lending.bikeNumber === bike.bikeNumber
    )[0];

    // Check if the bike has lendings
    if (!latestBikeLending) return true;

    // Check if the bike has been returned
    return !dateEq(latestBikeLending.time.returned, 0);
  });
};

// vim: et ts=2 sw=2 :
