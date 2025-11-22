import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('tsv') as File;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const text = await file.text();
    const parsed = Papa.parse(text, { delimiter: '\t', header: true, skipEmptyLines: true }).data as any[];

    const mappedData = parsed.filter((row: any) => row['Tracking ID']?.trim()).map((row: any) => ({
      order_id: row['Order ID'],
      order_date: row['Order date'] ? new Date(row['Order date']).toISOString() : null,
      return_request_date: row['Return request date'] ? new Date(row['Return request date']).toISOString() : null,
      label_cost: parseFloat(row['Label cost']) || null,
      return_carrier: row['Return carrier'],
      tracking_id: row['Tracking ID'],
      merchant_sku: row['Merchant SKU'],
      order_amount: parseFloat(row['Order Amount']) || null,
    }));

    const { error } = await supabase.from('orders_from_tsv').insert(mappedData);
    if (error) throw error;

    return NextResponse.json({ count: mappedData.length });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
