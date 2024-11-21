import { _decorator, Component, Node, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RPGLauncher')
export class RPGLauncher extends Component {

    public static ins: RPGLauncher;

    protected onLoad(): void {
        if (RPGLauncher.ins) {
            this.destroy();
            return;
        } else { 
            RPGLauncher.ins = this;
        }
    }

    start() {

    }

    update(deltaTime: number) {
        
    }

    private seed: number = 5;
    private initSeed: number = 5;
    private logRandomArray: number[] = [];

    public setRandomSeed(seed: number): void {
        this.initSeed = seed;
        console.error("收到随机数", this.initSeed);
    }

    public seedRandom(): number {
        if (this.logRandomArray.length < 30) {
            this.logRandomArray.push(this.seed);
        }
        this.seed = (this.seed * 9301 + 49297) % 233280;
        const value: number = this.seed / 233280.0;
        return value;
    }

    /**
        * 随机获得int整数 
        * @param minNum:最小范围(0开始)
        * @param maxNum:最大范围
        * @param stepLen:增加范围（整数，默认为1）
        * @return 
        */
    public randomInt(minNum: number, maxNum: number = 0, stepLen: number = 1): number {
        if (minNum > maxNum) {
            var nTemp: number = minNum;
            minNum = maxNum;
            maxNum = nTemp;
        }
        var nDeltaRange: number = (maxNum - minNum) + (1 * stepLen);
        var nRandomNumber: number = this.seedRandom() * nDeltaRange;
        nRandomNumber += minNum;
        return Math.floor(nRandomNumber / stepLen) * stepLen;
    }
}


