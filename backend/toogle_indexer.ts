import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
Deno.serve(async (req)=>{
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY'), {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')
        }
      }
    });
    const { data, error } = await supabase.from("items").select("item_name, description");
    if (error) {
      throw error;
    }
    let indexes = [];
    for (const d of data){
      let index = {};
      for (const word of d["item_name"].split(" ")){
        if (!(word in index)) {
          index[word] = 1;
        } else {
          index[word]++;
        }
      }
      for (const word of d["description"].split(" ")){
        if (!(word in index)) {
          index[word] = 1;
        } else {
          index[word]++;
        }
      }
      indexes.push({
        ...index
      });
    }
    console.log(indexes);
    return new Response(JSON.stringify({
      data
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (err) {
    _;
    return new Response(JSON.stringify({
      message: err?.message ?? err
    }), {
      headers: {
        'Content-Type': 'application/json'
      },
      status: 500
    });
  }
});
