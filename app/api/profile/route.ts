import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET: Ambil data profile (Single Row)
export async function GET() {
  const supabase = await createClient();

  // Ambil data pertama saja
  const { data, error } = await supabase
    .from('personal_info')
    .select('*')
    .limit(1)
    .single();

  // Jika error karena data kosong (PGRST116), return null biar form kosong
  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || {}); 
}

// POST: Simpan atau Update Data (Upsert)
export async function POST(request: Request) {
  const supabase = await createClient();
  
  // Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  // Ambil ID jika ada (untuk update), jika tidak ada create baru
  const { id, ...updates } = body;

  // Logic Upsert
  const { data, error } = await supabase
    .from('personal_info')
    .upsert({
        id: id || undefined, // Jika ID kosong, Supabase akan generate baru
        ...updates,
        created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}