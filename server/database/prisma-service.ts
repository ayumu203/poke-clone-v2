/**
 * Prismaクライアントのシングルトンサービス
 * 
 * 変更理由: パフォーマンス最適化
 * - 複数のPrismaClientインスタンスが作成されることを防ぐ
 * - 接続プールを効率的に管理
 * - アプリケーション全体でのデータベース接続を最適化
 */

import { PrismaClient } from '@prisma/client';

class PrismaService {
    private static instance: PrismaClient;

    /**
     * Prismaクライアントのシングルトンインスタンスを取得
     * 複数回呼び出されても同一のインスタンスを返す
     */
    public static getInstance(): PrismaClient {
        if (!PrismaService.instance) {
            console.log('Prismaクライアントを初期化中...');
            PrismaService.instance = new PrismaClient({
                // ログレベルの設定（warningとerrorのみ）
                log: ['warn', 'error'],
            });

            console.log('Prismaクライアントが初期化されました');
        }
        return PrismaService.instance;
    }

    /**
     * データベース接続の健全性チェック
     * 接続状態を確認し、レスポンス時間を測定
     */
    public static async healthCheck(): Promise<boolean> {
        try {
            const startTime = Date.now();
            await PrismaService.getInstance().$queryRaw`SELECT 1`;
            const endTime = Date.now();
            console.log(`DB健全性チェック完了: ${endTime - startTime}ms`);
            return true;
        } catch (error) {
            console.error('DB健全性チェック失敗:', error);
            return false;
        }
    }
}

// シングルトンインスタンスをエクスポート
export const prisma = PrismaService.getInstance();

// デフォルトエクスポートも追加
export default prisma;
