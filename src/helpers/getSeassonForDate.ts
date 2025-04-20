export const getSeasonForDate = (date: Date): string => {
  const seasonRanges = [
    { season: 'peak', start: '06-01', end: '09-15' },
    { season: 'mid', start: '03-01', end: '05-31' },
    { season: 'mid', start: '09-16', end: '10-31' },
    { season: 'off', start: '11-01', end: '02-28' },
  ];

  for (const { season, start, end } of seasonRanges) {
    const [startMonth, startDay] = start.split('-').map(Number);
    const [endMonth, endDay] = end.split('-').map(Number);
    const startDate = new Date(date.getFullYear(), startMonth - 1, startDay);
    const endDate = new Date(date.getFullYear(), endMonth - 1, endDay);

    if (start > end) {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    if (date >= startDate && date <= endDate) {
      return season;
    }
  }

  return 'off';
};
