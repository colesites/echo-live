const CHART_WIDTH = 100;
const CHART_HEIGHT = 40;
const MIN_RANGE = 1;

export function buildLinePath(values: number[]) {
  if (!values.length) {
    return "";
  }
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = Math.max(maxValue - minValue, MIN_RANGE);
  const lastIndex = Math.max(values.length - 1, 1);

  return values
    .map((value, index) => {
      const x = (index / lastIndex) * CHART_WIDTH;
      const y = CHART_HEIGHT - ((value - minValue) / range) * CHART_HEIGHT;
      const command = index === 0 ? "M" : "L";
      return `${command} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}
