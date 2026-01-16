import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('issued_at', { ascending: false }); // Urutkan dari yang terbaru

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  // Tambahkan 'type' disini
  const { title, issuer, issued_at, link, image, type } = body;

  const { data, error } = await supabase
    .from('certificates')
    .insert({ title, issuer, issued_at, link, image, type }) // Simpan type
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}