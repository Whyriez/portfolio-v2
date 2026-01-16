import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// GET: Ambil semua projects (untuk List Page)
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST: Buat project baru
export async function POST(request: Request) {
  const supabase = await createClient();

  // 1. Cek Auth (Security)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Ambil data dari body request
  const body = await request.json();
  const { title, category, description, github, link, tags, images } = body;

  // 3. Insert ke DB
  const { data, error } = await supabase
    .from('projects')
    .insert({
      title,
      category,
      description,
      github,
      link,
      tags,   // Array string
      images, // Array URL string
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}