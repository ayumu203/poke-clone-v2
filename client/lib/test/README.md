# APIパフォーマンステストツール

client/lib以下のfetch関数の実行速度を測定するためのテストツールです。

## ファイル構成

- `performance-test.sh` - シェルスクリプト版（curl使用）
- `fetch-performance-test.mjs` - Node.js版（fetch API使用）

## 使用方法

### 1. シェルスクリプト版

#### ローカル環境での実行
```bash
cd /home/cs23017/game/pkcv2/client/lib/test
./performance-test.sh
```

#### Docker環境での実行
```bash
cd /home/cs23017/game/pkcv2/client/lib/test
./performance-test.sh docker
```

### 2. Node.js版

#### ローカル環境での実行
```bash
cd /home/cs23017/game/pkcv2/client/lib/test
node fetch-performance-test.mjs
```

#### Docker環境での実行
```bash
cd /home/cs23017/game/pkcv2/client/lib/test
DOCKER_MODE=true node fetch-performance-test.mjs
```

## 測定項目

### シェルスクリプト版
- cURL実行時間
- HTTPステータス
- レスポンスサイズ
- スクリプト全体の実行時間

### Node.js版
- Fetch API実行時間
- JSON解析時間
- 総実行時間
- HTTPステータス
- レスポンスサイズ

## テスト対象API

1. **サーバー基本動作** - `GET /`
2. **バトル初期化** - `POST /battle/init`
3. **バトル処理** - `POST /battle/process`
4. **連続バトル処理** - 5回連続実行
5. **ポケモンデータ取得** - `POST /data/pokemon`
6. **技データ取得** - `POST /data/move`

## 出力結果

### シェルスクリプト版
- コンソールに詳細出力
- CSV形式の結果ファイル: `performance-test-YYYYMMDD_HHMMSS.log`

### Node.js版
- コンソールに詳細出力
- CSV形式の結果も表示

## パフォーマンス分析のポイント

### 正常範囲の目安
- **基本API**: 10-50ms
- **バトル初期化**: 50-200ms
- **バトル処理**: 100-500ms
- **データ取得**: 10-100ms

### 遅延の原因分析
1. **ネットワーク遅延** - Docker環境では内部通信なので通常は低い
2. **サーバー処理時間** - 複雑なバトル計算で時間がかかる場合
3. **データベースアクセス** - クエリの最適化が必要な場合
4. **JSON解析時間** - 大きなレスポンスの処理時間

### トラブルシューティング
- `ECONNREFUSED`: サーバーが起動していない
- `timeout`: レスポンス時間が長すぎる
- `500エラー`: サーバー内部エラー（ログを確認）

## 継続的な監視

定期的にテストを実行して、パフォーマンスの劣化を検出：

```bash
# 日次実行例
0 9 * * * cd /home/cs23017/game/pkcv2/client/lib/test && ./performance-test.sh >> daily-performance.log 2>&1
```

## カスタマイズ

- テストデータの変更: スクリプト内の`testBattleData`を編集
- 測定回数の変更: 連続テストのループ回数を調整
- 追加API: 新しいエンドポイントのテストを追加
