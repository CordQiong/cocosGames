/**
 * @fileName DestroyUtils.ts
 * @author zhangqiong
 * @date 2024/12/27 20:19:14"
 * @description
 */
export class DestroyUtils {
    static keyNames: string[] = ["destroy", "dispose"];
    static destroy(obj: any): void {
        if (obj instanceof Array) {
            for (var i: number = 0; i < obj.length; i++) {
                this.destroy(obj[i]);
            }
            return;
        }
        for (var i: number = 0; i < this.keyNames.length; i++) {
            if (obj[this.keyNames[i]]) {
                obj[this.keyNames[i]]();
                return;
            }
        }
    }
}