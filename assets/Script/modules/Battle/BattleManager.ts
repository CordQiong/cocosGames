export class BattleManager { 
    private static _instance: BattleManager = null;
    public static get instance(): BattleManager { 
        if (!this._instance) {
            this._instance = new BattleManager();
        }
        return this._instance;
    }
}