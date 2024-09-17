import Decimal from "decimal.js";

const calculatePercentageDifference = (
  first: string,
  second?: string
): string => {
  if (!second) {
    return "0.00%";
  }
  const firstValue = new Decimal(first);
  const secondValue = new Decimal(second);

  const formula = (bigger: Decimal, smaller: Decimal) =>
    bigger.minus(smaller).dividedBy(smaller).times(100).toFixed(2);

  switch (true) {
    case firstValue.equals(secondValue):
      return "0.00%";
    case firstValue.lessThan(secondValue):
      return `-${formula(secondValue, firstValue)}%`;
    case secondValue.lessThan(firstValue):
      return `${formula(firstValue, secondValue)}%`;
    default:
      return "0.00%";
  }
};

export default calculatePercentageDifference;
