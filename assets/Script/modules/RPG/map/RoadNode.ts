export default class RoadNode{
    private _px: number;
    private _py: number;
    private _cx: number;
    private _cy: number;
    private _dx: number;
    private _dy: number;
    private _value: number;
    private _f: number;
    private _g: number;
    private _h: number;
    private _parent: RoadNode;
    
    //-------------二堆叉存储结构-----------------
    private _treeParent: RoadNode = null; //二堆叉结构的父节点

    private _left: RoadNode = null; //二堆叉结构的左子节点

    private _right: RoadNode = null; //二堆叉结构的右子节点

    private _openTag: number = 0; //是否在开启列表标记

    private _closeTag: number = 0; //是否在关闭列表标记


    public resetTree(): void{
        this._treeParent = null;
        this._left = null;
        this._right = null;
    }

    public get px(): number{
        return this._px;
    }

    public set px(value: number) {
        this._px = value;
    }


    public get py(): number {
        return this._py;
    }
    public set py(value: number) {
        this._py = value;
    }

    public get cx(): number {
        return this._cx;
    }
    public set cx(value: number) {
        this._cx = value;
    }

    public get cy(): number {
        return this._cy;
    }
    public set cy(value: number) {
        this._cy = value;
    }

    public get dx(): number {
        return this._dx;
    }
    public set dx(value: number) {
        this._dx = value;
    }

    public get dy(): number {
        return this._dy;
    }
    public set dy(value: number) {
        this._dy = value;
    }

    public get value(): number {
        return this._value;
    }
    public set value(value: number) {
        this._value = value;
    }

    public get f(): number {
        return this._f;
    }
    public set f(value: number) {
        this._f = value;
    }

    public get g(): number {
        return this._g;
    }
    public set g(value: number) {
        this._g = value;
    }

    public get h(): number {
        return this._h;
    }
    public set h(value: number) {
        this._h = value;
    }

    public get parent(): RoadNode {
        return this._parent;
    }

    public set parent(value: RoadNode) {
        this._parent = value;
    }


    //-------------二堆叉存储结构-----------------

    /**
     * 二堆叉结构的父节点
     */
    public get treeParent(): RoadNode {
        return this._treeParent;
    }

    public set treeParent(value: RoadNode) {
        this._treeParent = value;
    }

    /**
     * 二堆叉结构的左子节点
     */
    public get left(): RoadNode {
        return this._left;
    }

    public set left(value: RoadNode) {
        this._left = value;
    }

    /**
     * 二堆叉结构的右子节点
     */
    public get right(): RoadNode {
        return this._right;
    }

    public set right(value: RoadNode) {
        this._right = value;
    }

    /**
     * 是否在开启列表标记
     */
    public get openTag(): number {
        return this._openTag;
    }

    public set openTag(value: number) {
        this._openTag = value;
    }

    /**
     * 是否在关闭列表标记
     */
    public get closeTag(): number {
        return this._closeTag;
    }

    public set closeTag(value: number) {
        this._closeTag = value;
    }
}