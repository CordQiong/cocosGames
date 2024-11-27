import { _decorator, assetManager, Component, ImageAsset, Node, resources, Skeleton, sp, Texture2D } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpineTest')
export class SpineTest extends Component {
    start() {
        let comp = this.getComponent(sp.Skeleton) 
""
        let image = "resources/spine/54154/E54154.png";
        let ske = "resources/spine/54154/E54154.skel";
        let atlas = "resources/spine/54154/E54154.atlas";


        resources.loadDir("spine/54154/", function (err, assets) {
            console.log(assets)


            let texture: Texture2D = assets[3] as Texture2D;
            let skeletonData: sp.SkeletonData = assets[2] as sp.SkeletonData;
                // let asset = new sp.SkeletonData();
                // asset._nativeAsset = assets[1];
                // asset.atlasText = assets[0];
                // asset.textures = [texture];
                // asset.textureNames = ['E54154.png'];
                // asset._uuid = ske; // 可以传入任意字符串，但不能为空
                // asset._nativeUrl = ske; // 传入一个二进制路径用作 initSkeleton 时的 filePath 参数使用
            comp.skeletonData = skeletonData;
                // let ani = comp.setAnimation(0, 'walk', true);
                // assetManager.loadRemote(image, (error, img: ImageAsset) => {
        });

        // assetManager.loadAny([{ url: atlas, ext: '.txt' }, { url: ske, ext: '.bin' }], (error, assets) => {
      
                
        //     // });
        // });
    }

    update(deltaTime: number) {
        
    }
}


