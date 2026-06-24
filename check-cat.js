const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const env = fs.readFileSync('.env.local', 'utf8').split(/\n/).filter(Boolean).reduce((acc, line)=>{ const i=line.indexOf('='); if (i===-1) return acc; const key=line.slice(0,i); const value=line.slice(i+1); acc[key]=value; return acc; }, {});
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
(async()=>{
  const { data, error } = await supabase.from('categories').select('id, name, slug, parent_id, image_url, href').order('name', {ascending:true});
  console.log('error', error);
  console.log('count', data?.length);
  console.log(data && data.slice(0,10));
})();
