import globals from "globals";
import tseslint from "typescript-eslint";
import js from "@eslint/js";

export default tseslint.config(
  // ESLintの推奨設定 (以前の 'eslint:recommended')
  js.configs.recommended,

  // TypeScriptの型チェック付き推奨設定
  // (以前の 'plugin:@typescript-eslint/recommended' と 
  // 'plugin:@typescript-eslint/recommended-requiring-type-checking' を合わせたもの)
  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      // Node.js v18向け
      ecmaVersion: 2022,
      sourceType: "module",

      // グローバル変数の設定 (以前の env: { node: true, es6: true })
      globals: {
        ...globals.node,
        ...globals.es2021, // es6: true より新しい構文をカバー
      },
      
      // 型チェック用のプロジェクト設定
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname, // ESMでは__dirnameの代わりにこれを使う
      },
    },
    rules: {
      // 必要に応じてカスタムルールをここに追加
      // 例: '@typescript-eslint/no-unused-vars': 'warn'
    },
  }
);
