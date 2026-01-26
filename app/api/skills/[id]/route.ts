import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Next.js 15 Style
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Ganti 'journeys' dengan 'skills' untuk file skills/[id]/route.ts
  const { error } = await supabase.from('skills').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  
  // 1. Cek User
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. Ambil data
  const body = await request.json();

  // 3. Update Supabase
  const { error } = await supabase
    .from('skills')
    .update({
      name: body.name,
      level: body.level,
      description: body.description,
    })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}