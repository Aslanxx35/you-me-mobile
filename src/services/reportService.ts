import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

type PlanetInfo = { sign?: string; degree?: number; house?: number; name?: string };
type ChartData = {
  planets?: Record<string, PlanetInfo> | PlanetInfo[];
  houses?: Record<number, { sign?: string; degree?: number }> | any[];
  ascendant?: string;
  midheaven?: string;
  sunSign?: string;
  sunSignTR?: string;
};

type TarotCardEntry = { name?: string; nameTR?: string; reversed?: boolean; meaning?: string; meaningTR?: string };

type ReportParams = {
  title: string;
  natal: ChartData | null | undefined;
  tarot: TarotCardEntry[] | null | undefined;
  ai: string;
};

function planetsToRows(planets: ChartData['planets']): PlanetInfo[] {
  if (!planets) return [];
  if (Array.isArray(planets)) return planets;
  return Object.entries(planets).map(([name, info]) => ({ name, ...info }));
}

function formatNatal(natal: ChartData | null | undefined): string {
  if (!natal) return '<p>Doğum haritası verisi bulunamadı.</p>';

  const rows = planetsToRows(natal.planets);
  const summary = `
    <p>
      ${natal.sunSignTR || natal.sunSign ? `<strong>Güneş Burcu:</strong> ${natal.sunSignTR ?? natal.sunSign}<br/>` : ''}
      ${natal.ascendant ? `<strong>Yükselen:</strong> ${natal.ascendant}<br/>` : ''}
      ${natal.midheaven ? `<strong>MC (Tepe Noktası):</strong> ${natal.midheaven}` : ''}
    </p>`;

  const planetsTable =
    rows.length > 0
      ? `
    <table style="width:100%;border-collapse:collapse;">
      <tr><th style="text-align:left;padding:4px;">Gezegen</th><th style="text-align:left;padding:4px;">Burç</th><th style="text-align:left;padding:4px;">Derece</th><th style="text-align:left;padding:4px;">Ev</th></tr>
      ${rows
        .map(
          (p) => `
        <tr>
          <td style="padding:4px;border-top:1px solid #ddd;">${p?.name ?? '-'}</td>
          <td style="padding:4px;border-top:1px solid #ddd;">${p?.sign ?? '-'}</td>
          <td style="padding:4px;border-top:1px solid #ddd;">${p?.degree != null ? p.degree.toFixed(1) + '°' : '-'}</td>
          <td style="padding:4px;border-top:1px solid #ddd;">${p?.house ?? '-'}</td>
        </tr>`
        )
        .join('')}
    </table>`
      : '';

  return summary + planetsTable;
}

function formatTarot(tarot: TarotCardEntry[] | null | undefined): string {
  if (!Array.isArray(tarot) || tarot.length === 0) {
    return '<p>Tarot çekimi bulunamadı.</p>';
  }
  return `
    <ul>
      ${tarot
        .map(
          (c) =>
            `<li><strong>${c?.nameTR ?? c?.name ?? 'Kart'}</strong>${c?.reversed ? ' (Ters)' : ''} — ${c?.meaningTR ?? c?.meaning ?? ''}</li>`
        )
        .join('')}
    </ul>`;
}

function buildHtml({ title, natal, tarot, ai }: ReportParams): string {
  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, Helvetica, Arial, sans-serif; padding: 24px; color: #111; }
          h1 { font-size: 22px; margin-bottom: 4px; }
          h2 { font-size: 16px; margin-top: 24px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
          p { font-size: 13px; line-height: 1.6; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <h2>Doğum Haritası</h2>
        ${formatNatal(natal)}
        <h2>Tarot Çekimi</h2>
        ${formatTarot(tarot)}
        <h2>Yorum</h2>
        <p>${ai ?? ''}</p>
      </body>
    </html>`;
}

export async function createReportPdf(params: ReportParams): Promise<string> {
  const html = buildHtml(params);
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  return uri;
}

export async function sharePdf(uri: string): Promise<void> {
  const available = await Sharing.isAvailableAsync();
  if (!available) {
    throw new Error('Paylaşım bu cihazda kullanılamıyor.');
  }
  await Sharing.shareAsync(uri, {
    mimeType: 'application/pdf',
    dialogTitle: 'Raporu Paylaş',
  });
}
