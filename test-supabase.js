const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('services').select('*');
  console.log('SELECT:', { data, error });
  
  const { data: insertData, error: insertError } = await supabase.from('services').insert([{
    title: 'Test Service',
    slug: 'test-service-' + Date.now(),
    description: 'Test desc',
    content: 'Test content'
  }]).select();
  console.log('INSERT:', { data: insertData, error: insertError });
  
  if (insertData && insertData.length > 0) {
    const { error: deleteError } = await supabase.from('services').delete().eq('id', insertData[0].id);
    console.log('DELETE ERROR:', deleteError);
  }
}
test();
