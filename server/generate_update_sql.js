import fs from 'fs';
import csv from 'csv-parser';

async function generateSql() {
  const oldIdMap = new Map(); // Map<provider_id, old_supabase_id>
  const newIdMap = new Map(); // Map<provider_id, new_supabase_id>

  console.log('Reading old_identities.csv...');
  const oldStream = fs.createReadStream('old_identities.csv').pipe(csv());
  // for await...of を使って、ストリームの読み込みを現代的な書き方に修正
  for await (const row of oldStream) {
    oldIdMap.set(row.provider_id, row.old_supabase_id);
  }
  console.log(`-> Found ${oldIdMap.size} users from old IDs.`);

  console.log('Reading new_identities.csv...');
  const newStream = fs.createReadStream('new_identities.csv').pipe(csv());
  for await (const row of newStream) {
    newIdMap.set(row.provider_id, row.new_supabase_id);
  }
  console.log(`-> Found ${newIdMap.size} users from new IDs.`);


  let updateSql = '-- SQL to update player_ids\n\n';
  let updatesGenerated = 0;

  // Googleのprovider_idをキーにして、古いIDと新しいIDをマッピング
  for (const [providerId, oldId] of oldIdMap.entries()) {
    const newId = newIdMap.get(providerId);
    if (newId) {
      console.log(`Mapping found for provider ID ${providerId.substring(0, 8)}...: ${oldId.substring(0, 8)}... -> ${newId.substring(0, 8)}...`);
      // Playerテーブルの更新SQL
      updateSql += `-- User with Google ID starting with ${providerId.substring(0, 8)}\n`;
      updateSql += `UPDATE "Player" SET player_id = '${newId}' WHERE player_id = '${oldId}';\n`;
      // TeamPokemonテーブルの更新SQL
      updateSql += `UPDATE "TeamPokemon" SET player_id = '${newId}' WHERE player_id = '${oldId}';\n`;
      // 他にもplayer_idを使っているテーブルがあればここに追加
      updateSql += '\n';
      updatesGenerated++;
    } else {
      console.warn(`!! Warning: No matching new ID found for old user with provider ID ${providerId}`);
    }
  }
  
  fs.writeFileSync('update_ids.sql', updateSql);
  console.log(`\n✅ Generated update_ids.sql with ${updatesGenerated} user updates.`);
  console.log('Please review "update_ids.sql" and then execute it on your NEW database.');
}

// スクリプトの実行とエラーハンドリング
generateSql().catch(err => {
  console.error("An error occurred while generating the SQL script:", err);
});
