import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Helper params type
type Props = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  
  const { error } = await supabase
    .from('certificates')
    .update(body)
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Updated' });
}

export async function DELETE(req: Request, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { error } = await supabase.from('certificates').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Deleted' });
}