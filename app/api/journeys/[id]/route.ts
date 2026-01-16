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
  const { error } = await supabase.from('journeys').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}