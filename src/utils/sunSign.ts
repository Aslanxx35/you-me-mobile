export function getSunSignTR(chart: any): string | null {
  if (!chart) return null;
  if (typeof chart.sunSignTR === 'string' && chart.sunSignTR) return chart.sunSignTR;

  const planets = chart.planets;
  if (Array.isArray(planets)) {
    const sun = planets.find((p: any) => p?.planet === 'Sun' || p?.planet === 'Güneş');
    if (sun?.signTR) return sun.signTR;
  } else if (planets && typeof planets === 'object') {
    const sun = planets['Sun'] || planets['Güneş'];
    if (sun?.sign) return sun.sign;
  }
  return null;
}
