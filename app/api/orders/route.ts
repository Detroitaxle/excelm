import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET() {
  const { data, error } = await supabase.from('orders_from_tsv').select('*').order('created_at');
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE() {
  const { error } = await supabase.from('orders_from_tsv').delete().neq('id', 0);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ success: true });
}
