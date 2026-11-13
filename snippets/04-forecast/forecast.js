// Transparent statistical baseline: ordinary least-squares line + a confidence band that
// widens with distance, so thin history never overstates precision. Explainable to finance users.

/**
 * @param {number[]} series historical values, oldest first
 * @param {number} horizon number of future points
 */
function linearForecast(series, horizon) {
  const n = series.length;
  if (n < 2) return { slope: 0, intercept: series[0] || 0, points: [] };

  const xs = series.map((_, i) => i);
  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = series.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((a, x, i) => a + x * series[i], 0);
  const sumXX = xs.reduce((a, x) => a + x * x, 0);
  const denom = n * sumXX - sumX * sumX || 1;
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  const sse = series.reduce((a, y, i) => a + (y - (slope * i + intercept)) ** 2, 0);
  const std = Math.sqrt(sse / Math.max(1, n - 2)) || Math.abs(sumY / n) * 0.05;

  const points = [];
  for (let h = 1; h <= horizon; h++) {
    const value = slope * (n - 1 + h) + intercept;
    const band = std * 1.28 * (1 + h * 0.35); // ~80% interval, widening
    points.push({ value, lower: value - band, upper: value + band });
  }
  return { slope, intercept, points };
}

module.exports = { linearForecast };

if (require.main === module) {
  console.log(linearForecast([410, 425, 431, 449], 2));
}
