import { ItineraryItem } from '@/lib/types/itinerary-types';

export const handleExportPDF = (
  days: any[], 
  residencyTier: string, 
  guests: { adults: number; children: number }, 
  estimatedTotal: number
) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Safari Odyssey - Itinerary</title>
        <style>
          body { font-family: Arial, sans-serif; color: #1e293b; padding: 40px; line-height: 1.5; }
          h1 { color: #0f172a; margin-bottom: 5px; }
          .meta { background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
          .day-box { margin-bottom: 25px; border-left: 3px solid #f59e0b; padding-left: 15px; }
          .slot { margin: 10px 0; padding: 10px; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
          .slot img { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-left: 10px; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>Safari Odyssey Masterpiece</h1>
        <p style="color: #64748b; font-size: 14px;">Escape Tours Tanzania - Studio Master Blueprint</p>
        
        <div class="meta">
          <strong>Tariff Tier:</strong> ${residencyTier} | 
          <strong>Party Size:</strong> ${guests.adults} Adults, ${guests.children} Children | 
          <strong>Total Quote:</strong> $${estimatedTotal.toLocaleString()}
        </div>

        ${days.map(d => `
          <div class="day-box">
            <h3>Day ${d.day_number}: ${d.location}</h3>
            ${d.slots.map((s: { type: string; item: ItineraryItem | null }) => {
              const name = s.item?.name ?? 'Open / Leisure';
              const price = s.item ? (s.item.price ?? 150) : 0;
              const img = s.item?.image_url || (s.item as any)?.image;
              return `
                <div class="slot">
                  <div>
                    <span style="font-size: 10px; font-weight: bold; color: #d97706; text-transform: uppercase;">${s.type}</span>
                    <div style="font-weight: bold; font-size: 14px;">${name}</div>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <span style="font-weight: bold; color: #059669;">$${price}</span>
                    ${img ? `<img src="${img}" />` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `).join('')}

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};