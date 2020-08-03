export default (name: string, value: string, daysToLive: number) => {
  let cookie = name + "=" + encodeURIComponent(value);

  cookie += "; max-age=" + daysToLive * 24 * 60 * 60;
  document.cookie = cookie;
};
