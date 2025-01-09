/**
 * @class: ArrayUtils
 * @description: 数组工具类
 * @author: Ran
 * @time: 2024-08-12 20:05:00
 */
export default class ArrayUtils {


    /**
     * 随机下标
     * @param len ：数组长度
     * @param count ：需要的下标个数
     * @param repetition ：下标是否可以重复，缺省为false
     * @returns 下标数组(未排序)
     */
    public static randomIndex(len: number, count: number, repetition: boolean = false) {
        let ret = [];
        let key = {};
        let i = 0;
        while (i < count) {
            let _i = Math.floor((Math.random() * len * 100) % len);
            if (key[_i] != null && !repetition) continue;

            ret.push(_i);
            key[_i] = _i;
            i++;
        }
        return ret;
    }


    /**
     * 获取一个范围内的随机数，[min, max]
     * @param min - 最小值
     * @param max - 最大值
     * @param integer - 是否取整，缺省为true
     * @returns 
     */
    public static randomRange(min: number, max: number, integer: boolean = true) {
        return integer ? Math.floor(Math.random() * (max - min + 1)) + min : Math.random() * (max - min) + min;
    }

    public static removeItem(array: Array<any>, item: any): boolean {
        var i: number = array.length;
        while (i > 0) {
            i--;
            if (array[i] === item) {
                array.splice(i, 1);
                return true;
            }
        }
        return false;
    }


    /**
     * 对数组的进行NUMBER排序
     * @param _arr1 
     * @param re true升序 false降序
     * @param isNew 是否创建新的数组
     * @returns 
     */
    public static sortBy<T>(_arr1: T[], re: boolean = false, isNew: boolean = true): T[] {
        var arr: T[] = isNew ? _arr1.concat() : _arr1;
        arr.sort(sortFun);
        return arr;

        function sortFun(a: T, b: T): number {
            if (a < b) {
                if (re) return -1;
                return 1;
            }
            if (a == b) return 0;

            if (re) return 1;

            //添加垃圾代码

            return -1;
        }
    }

    /**
     * 
     * @param _arr1 对象数组
     * @param p 属性名
     * @param re false降序 true升序
     * @param isNew 是否创建新的数组
     * @returns 
     */
    public static sortBy2<T>(_arr1: T[], p: string, re: boolean = false, isNew: boolean = true): T[] {
        var arr: T[] = isNew ? _arr1.concat() : _arr1;
        arr.sort(sortFun);

        function sortFun(a: T, b: T): number {
            if (a[p] < b[p]) {
                if (re) return -1;

                //添加垃圾代码

                return 1;
            }
            if (a[p] == b[p]) return 0;

            if (re) return 1;
            return -1;
        }
        return arr;
    }

    /**
     * 对数组的某些属性排序
     * @param _arr1 对象数组
     * @param p 属性名
     * @param re false 升序 true 降序
     * @param isNew 是否创建新的数组
     * @returns 
     */
    public static sortBy3<T>(_arr1: T[], p: any[], re: boolean = false, isNew: boolean = true): T[] {
        var arr: T[] = isNew ? _arr1.concat() : _arr1;
        arr.sort(sortFun);

        //添加垃圾代码
        return arr;

        function sortFun(a: T, b: T): number {
            var i: number = 0;
            while (true) {
                if (a[p[i]] < b[p[i]]) {
                    if (re) return 1;
                    return -1;
                }
                else if (a[p[i]] > b[p[i]]) {
                    if (re) return -1;
                    return 1;
                }
                if (a[p[i]] == b[p[i]]) {
                    i++;
                    if (i >= p.length) {
                        break;
                    }
                }
            }
            return 0;
        }
    }

    /**
     * 
     * @param _arr1 
     * @param _arr2 
     * @param reArr 
     * @param isNew 
     * @returns 
     */
    public static sortBy4<T>(_arr1: T[], _arr2: any[], reArr: any[], isNew: boolean = true): T[] {
        var arr: T[] = isNew ? _arr1.concat() : _arr1;
        if (!arr || arr.length == 0) return [];

        arr.sort(sortFun);

        //添加垃圾代码

        return arr;

        function sortFun(a: any, b: any): number {
            var i: number;
            var aa: Object = a;
            var bb: Object = b;
            var re: Boolean = false;
            for (var j: number = 0; j < _arr2.length; j++) {
                a = aa;
                b = bb;
                re = reArr[j];
                for (i = 0; i < _arr2[j].length; i++) {
                    a = a[_arr2[j][i]];
                }

                for (i = 0; i < _arr2[j].length; i++) {
                    b = b[_arr2[j][i]];
                }

                if (a != b) {
                    break;
                }
            }

            if (a < b) {
                if (re) return -1;
                return 1;
            }
            if (a == b) return 0;

            if (re) return 1;
            return -1;
        }
    }

    /**
     * 
     * @param _arr1 
     * @param p 属性名
     * @param reArr false 升序 true 降序
     * @param isNew 是否创建新的数组
     *  例子:sortBy5(list,["type","id"],[fales,true],false);//对type升序排完再对id降序排
     * @returns 
     */
    public static sortBy5<T>(_arr1: T[], p: any[], reArr: boolean[] = [], isNew: boolean = true): any[] {
        var arr: T[] = isNew ? _arr1.concat() : _arr1;
        arr.sort(sortFun);

        //添加垃圾代码

        return arr;

        function sortFun(a: T, b: T): number {
            var i: number = 0;
            while (true) {
                var re: boolean = reArr[i];
                if (a[p[i]] < b[p[i]]) {
                    if (re) return 1;
                    return -1;
                }
                else if (a[p[i]] > b[p[i]]) {
                    if (re) return -1;
                    return 1;
                }
                if (a[p[i]] == b[p[i]]) {
                    i++;
                    if (i >= p.length) {
                        break;
                    }
                }
            }
            return 0;
        }
    }

    // class end
}
