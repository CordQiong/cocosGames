import { _decorator, Camera, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RootLauncher')
export class RootLauncher extends Component {
    @property(Camera)
    public mainCamera: Camera;


    private static _instance: RootLauncher = null;
    public static get instance(): RootLauncher {
        return RootLauncher._instance;
    }
    protected onLoad(): void {
        RootLauncher._instance = this;
    }
    start() {

    }

    update(deltaTime: number) {

    }
}


