export const getTodayKey = () => new Date().toISOString().slice(0, 10);

export const getDateKey = (input) => {
  const date = new Date(input);
  return date.toISOString().slice(0, 10);
};

export const getStartOfDay = (input) => {
  const date = new Date(input);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getEndOfDay = (input) => {
  const date = new Date(input);
  date.setHours(23, 59, 59, 999);
  return date;
};

export const isSameWeekAsToday = (input) => {
  const currentWeek = getWeekWindow(new Date());
  const date = new Date(input);

  return date >= currentWeek.start && date <= currentWeek.end;
};

export const getWeekWindow = (input) => {
  const date = new Date(input);
  const start = new Date(date);
  const day = start.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  start.setDate(start.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return {
    start,
    end,
    key: start.toISOString().slice(0, 10),
  };
};

export const getDayDifference = (newer, older) => {
  const newerDate = getStartOfDay(newer);
  const olderDate = getStartOfDay(older);

  return Math.round((newerDate.getTime() - olderDate.getTime()) / 86400000);
};
