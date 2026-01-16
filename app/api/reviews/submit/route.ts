import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Gunakan createClient biasa (bukan admin) 
  // Tapi kita butuh akses 'service role' jika tabel review_codes sangat private,
  // Namun dengan setup RLS kita sebelumnya, kita bisa akali dengan logic di bawah.
  
  // Karena user public (anon) tidak punya akses tulis ke review_codes, 
  // kita perlu menggunakan Supabase Service Role Key (Admin Privilege) HANYA di API route ini
  // untuk mengupdate status 'is_used'.
  // Tapi untuk keamanan standar, kita pakai client biasa dan andalkan RLS public (jika dibuka) 
  // ATAU lebih baik: Gunakan 'supabaseAdmin' client di sini.
  
  // Untuk tutorial ini, kita asumsikan pakai client biasa tapi logic validasi kuat.
  const supabase = await createClient(); 

  const body = await request.json();
  const { name, review, code, avatar } = body;

  // 1. Validasi Input
  if (!code || !name || !review) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // 2. Cek Validitas Kode
  // Kita cari kode yang cocok DAN belum dipakai
  const { data: codeData, error: codeError } = await supabase
    .from('review_codes')
    .select('*')
    .eq('code', code)
    .single();

  if (codeError || !codeData) {
    return NextResponse.json({ error: 'Invalid Review Code' }, { status: 400 });
  }

  if (codeData.is_used) {
    return NextResponse.json({ error: 'This code has already been used!' }, { status: 400 });
  }

  // 3. Insert Review (As public user)
  // Pastikan Anda sudah punya Policy Insert untuk Public di tabel 'reviews' 
  // ATAU insert menggunakan API ini.
  const { error: insertError } = await supabase
    .from('reviews')
    .insert({
      name,
      review,
      avatar,
    });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }
  
  const { error: rpcError } = await supabase.rpc('mark_code_used', { code_input: code });
  
  if (rpcError) {
     console.error("Failed to mark code used:", rpcError);
     // Tetap return success karena review sudah masuk, admin bisa manual fix nanti
  }

  return NextResponse.json({ success: true });
}