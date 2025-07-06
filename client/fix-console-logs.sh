#!/bin/bash

# console.logを修正するスクリプト

# libディレクトリ内のTypeScriptファイルに対してconsole.logを修正
find lib -name "*.ts" -type f | while read file; do
    # dev-utilsがインポートされていない場合はインポートを追加
    if ! grep -q "dev-utils" "$file"; then
        # ファイルの先頭のimport文の後にdev-utilsのインポートを追加
        sed -i '1s/^/import { devLog, devError } from "..\/..\/src\/utils\/dev-utils";\n/' "$file"
    fi
    
    # console.logをdevLogに置換
    sed -i 's/console\.log(/devLog(/g' "$file"
    
    # console.errorをdevErrorに置換
    sed -i 's/console\.error(/devError(/g' "$file"
done

echo "Console.log修正完了"
