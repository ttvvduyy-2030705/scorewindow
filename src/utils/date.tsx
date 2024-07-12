const HOUR = 3600,
  MINUTE = 60;

const formatTotalTime = (time: number) => {
  let _total = time;
  const hours = Math.floor(_total / HOUR);
  _total = _total - hours * HOUR;
  const minutes = Math.floor(_total / MINUTE);
  _total = _total - minutes * MINUTE;
  const seconds = _total;

  return {hours, minutes, seconds};
};

export {formatTotalTime};
