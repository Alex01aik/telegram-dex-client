const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const timeFormat = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).format(date);

  const dateFormat = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date);

  return `${timeFormat}, ${dateFormat}`;
};

export default formatDate;
