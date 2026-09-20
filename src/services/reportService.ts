import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

type ReportParams = {
  title: string;
  natal: any;
  tarot: any;
  ai: string;
};

function formatNatal(natal: any): string {
  if (!natal) return '<p>Doğum haritası verisi bulunamadı.</p>';
  try {
    const placements = Array.isArray(natal?.planets) ? natal.planets : [];
    if (placements.length === 0) {
      return `<pre style="white-space:pre-wrap;font-size:12px;">${JSON.stringify(natal, null, 2)}</pre>`;
    }
    return `
      <table style="width:100%;border-collapse:collapse;">
        <tr><th style="text-align:left;padding:4px;">Gezegen</th><th style="text-align:left;padding:4px;">Burç</th><th style="text-align:left;padding:4px;">Ev</th></tr>
        ${placements
          .map(
            (p: any) => `
          <tr>
            <td style="padding:4px;border-top:1px solid #ddd;">${p?.name ?? '-'}</td>
            <td style="padding:4px;border-top:1px solid #ddd;">${p?.sign ?? '-'}</td>
            <td style="padding:4px;border-top:1px solid #ddd;">${p?.house ?? '-'}</td>
          </tr>`
          )
          .join('')}
      </table>`;
  } catch {
    return '<p>Doğum haritası verisi işlenemedi.</p>';
  }
}

function formatTarot(tarot: any): string {
  if (!tarot) return '<p>Tarot çekimi bulunamadı.</p>';
  const cards = Array.isArray(tarot) ? tarot : tarot?.cards;
  if (!Array.isArray(cards) || cards.length === 0) {
    return `<pre style="white-space:pre-wrap;font-size:12px;">${JSON.stringify(tarot, null, 2)}</pre>`;
  }
  return `
    <ul>
      ${cards
        .map(
          (c: any) =>
            `<li><strong>${c?.name ?? 'Kart'}</strong>${c?.reversed ? ' (Ters)' : ''} — ${c?.meaning ?? ''}</li>`
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
