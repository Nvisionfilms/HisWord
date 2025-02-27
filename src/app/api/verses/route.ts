import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { data: verses, error } = await supabase
      .from('verses')
      .select('*')
    
    if (error) throw error

    return NextResponse.json(verses)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching verses' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { emotion, verse, reference } = await request.json()
    
    const { data, error } = await supabase
      .from('verses')
      .insert([{ emotion, verse, reference }])
      .select()
    
    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    return NextResponse.json({ error: 'Error creating verse' }, { status: 500 })
  }
}
