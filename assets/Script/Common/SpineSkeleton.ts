import { _decorator, Asset, assetManager, Component, ImageAsset, Node, resources, sp, Texture2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpineSkeleton')
export class SpineSkeleton extends Component {
    private skeleton: sp.Skeleton = null;
    protected onLoad(): void {
        this.skeleton = this.node.getComponent(sp.Skeleton);
        // this.skeleton.setCompleteListener(this.onAnimationComplete);
    }
    start() {
        this.play(44403).then(value => {

        });
    }

    public play(spineId: number, animationName: string = "animation_0"): Promise<void> {
        return new Promise((resolve, reject) => {
            const path: string = `spine/effect/seffect_${spineId}`
            resources.loadDir(path, (err, assets) => {
                if (err) {
                    reject(err);
                    return;
                }
                console.log("文件夹下所有的文件", assets)
                let asset: sp.SkeletonData = null;
                for (let i: number = 0; i < assets.length; i++) {
                    const tp = assets[i];
                    if (tp instanceof sp.SkeletonData) {
                        asset = tp;
                        break;
                    }
                }
                if (!!asset) {
                    this.skeleton.skeletonData = asset;
                    this.skeleton.loop = false;
                    this.skeleton.setCompleteListener((entry: sp.spine.TrackEntry) => {
                        console.log("动画播放完了", entry.animation.name);
                        resolve();
                    })
                    this.skeleton.animation = animationName;
                } else {
                    reject("没有加载到spine动画")
                }
            });
        })
    }



    update(deltaTime: number) {

    }
}


