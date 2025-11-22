import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import pLimit from 'p-limit';

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const limit = pLimit(10);

async function isDelivered(status: any): Promise<boolean> {
  const str = JSON.stringify(status).toLowerCase();
  return str.includes('delivered') || str.includes('dl');
}

async function callFedEx(trackingId: string): Promise<any> {
  // Placeholder for real FedEx call – replace with your API logic
  const token = process.env.FEDEX_API_KEY;
  const res = await fetch('https://apis.fedex.com/track/v1/trackingnumbers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ trackingInfo: [{ trackingNumber: trackingId }], includeDetailedScans: true }),
  });
  if (!res.ok) throw new Error(`FedEx error: ${res.status}`);
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const { batchSize = 200 } = await req.json();
    const { data: rows } = await supabase.from('orders_from_tsv').select('id, tracking_id').limit(batchSize);

    const results = await Promise.all(rows.map(({ tracking_id }) => limit(async () => {
      try {
        const fedexData = await callFedEx(tracking_id);
        const delivered = await isDelivered(fedexData);
        if (delivered) {
          await supabase.from('orders_from_tsv').update({ fedex_status: fedexData }).eq('tracking_id', tracking_id);
          return { tracking_id, status: 'kept', kept: true };
        } else {
          await supabase.from('orders_from_tsv').delete().eq('tracking_id', tracking_id);
          return { tracking_id, status: 'deleted', kept: false };
        }
      } catch (error) {
        await supabase.from('orders_from_tsv').update({ fedex_status: { error: (error as Error).message } }).eq('tracking_id', tracking_id);
        return { tracking_id, status: 'error', kept: true };
      }
    })));

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
