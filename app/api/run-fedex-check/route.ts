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
    const { batchSize = 200, rowIds } = await req.json();
    
    // If rowIds provided, only check those rows, otherwise check all
    let query = supabase.from('orders_from_tsv').select('id, tracking_id');
    
    if (rowIds && Array.isArray(rowIds) && rowIds.length > 0) {
      query = query.in('id', rowIds);
    } else {
      query = query.limit(batchSize);
    }
    
    const { data: rows } = await query;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ message: 'No rows to check', results: [] });
    }

    const results = await Promise.all(rows.map(({ id, tracking_id }) => limit(async () => {
      try {
        const fedexData = await callFedEx(tracking_id);
        // Always update the status, don't delete rows
        await supabase.from('orders_from_tsv').update({ fedex_status: fedexData }).eq('id', id);
        const delivered = await isDelivered(fedexData);
        return { id, tracking_id, status: delivered ? 'delivered' : 'not_delivered', success: true };
      } catch (error) {
        await supabase.from('orders_from_tsv').update({ fedex_status: { error: (error as Error).message } }).eq('id', id);
        return { id, tracking_id, status: 'error', success: false, error: (error as Error).message };
      }
    })));

    return NextResponse.json({ message: `Checked ${results.length} rows`, results });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
