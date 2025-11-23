import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(req: NextRequest) {
  try {
    // Delete all rows from orders_from_tsv table
    const { error } = await supabase.from('orders_from_tsv').delete().neq('id', 0);
    
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ success: true, message: 'All orders deleted' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

