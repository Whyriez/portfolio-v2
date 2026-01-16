import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET: Ambil semua kode (untuk ditampilkan di Admin Modal)
export async function GET() {
  const supabase = await createClient();
  
  // Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('review_codes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json(data);
}

// POST: Generate Kode Baru
export async function POST(request: Request) {
  const supabase = await createClient();
  
  // Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { client_name } = body;

  // Generate unique code (Format: REV + Random String)
  const code = 'REV-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data, error } = await supabase
    .from('review_codes')
    .insert({ code, client_name })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}