import { lendingType, bikeType, breakdownType } from './modelTypes.js';

export { lendingType, bikeType, breakdownType };

const byTime = (a, b) =>
  Math.sign(new Date(a).getTime() - new Date(b).getTime());

const dateEq = (a, b) => new Date(a).getTime() === new Date(b).getTime();

export const getLatestLendings = (bikes, lendings) =>
  bikes
    .map(
      bike =>
        lendings
          .filter(lending => {
            return lending.bikeNumber === bike.bikeNumber;
          })
          .sort((a, b) => byTime(a.time.lent, b.time.lent))
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

export const getLatestBreakdowns = (bikes, breakdowns) =>
  bikes
    .map(
      bike =>
        breakdowns
          .filter(breakdown => {
            return breakdown.bikeNumber === bike.bikeNumber;
          })
          .sort((a, b) => byTime(a.time.broken, b.time.broken))
          .slice(-1)[0]
    )
    .filter(breakdown => breakdown !== undefined);

export const getBrokenBikes = (bikes, breakdowns) => {
  if (!bikes.length || !breakdowns.length) return [];
  const latestBreakdowns = getLatestBreakdowns(bikes, breakdowns);

  return bikes.filter(bike => {
    // Get the latest breakdown of this bike
    const latestBikeBreakdown = latestBreakdowns.filter(
      breakdown => breakdown.bikeNumber === bike.bikeNumber
    )[0];

    // Check if the bike has breakdowns
    if (!latestBikeBreakdown) return false;

    // Check if the bike hasn't been fixed yet
    return dateEq(latestBikeBreakdown.time.fixed, 0);
  });
};

// vim: et ts=2 sw=2 :
