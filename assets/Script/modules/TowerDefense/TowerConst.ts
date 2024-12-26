
export class TowerConst  {
    private static _instance:TowerConst;
    public  static  get instance():TowerConst {
        if(!this._instance){
            this._instance = new TowerConst();
        }
        return this._instance;
    }

    public readonly ColliderTag_Boss:number = 1;
    public readonly ColliderTag_Enemy:number = 2;
    public readonly ColliderTag_Bullet:number = 3;
}
