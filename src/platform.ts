import { Sprite, Scene, TextureLoader, SpriteMaterial, Texture } from "three";
import { Updateable } from "./stage";
var THREE = require('three');//only needed due to three type shenanigans

export class Platform extends Updateable {
    sprite: Sprite;
    x: number;
    y: number;
    xVelocity: number;
    yVelocity: number;
    type: number;
    lifetimeTicks: number;
    totalTicks: number;
    isAlive: boolean;
    rotationRadians: number;
    isAttached: boolean;
    //attachedTo: Platform;//this should always be a reference?
    //attachedTo: { [key: number]: Platform; };//list of attached platforms
    attachedTo: Array<Platform>;
    id:number; //unique id for each platform

    constructor(scene: Scene, x: number, y: number, xVel: number, yVel: number, type: number, id: number) {
        super();//needed?
        this.x = x;
        this.y = y;
        this.type = type;
        this.totalTicks = 0;
        this.isAlive = true; 
        this.isAttached = false;
        this.xVelocity = xVel;
        this.yVelocity = yVel;
        var scaleX = 1/8;
        var scaleY = 1/8;
        var scaleZ = 1;
        //this.rotationRadians = rotationRadians;//not implementing rotation for awhile
        this.id = id;
        this.attachedTo = [];

        var spriteMap: Texture;
        switch (type) {
            case 0: {//basic platform
                spriteMap = new THREE.TextureLoader().load("assets/raft1.png");
                //this.lifetimeTicks = 60 * 10;//10 seconds
                break;
            }
        }
        spriteMap.minFilter = THREE.NearestFilter;
        spriteMap.magFilter = THREE.NearestFilter;
        var spriteMaterial: SpriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
        this.sprite = new Sprite(spriteMaterial);
        this.sprite.scale.set(scaleX, scaleY, scaleZ);//guesstemates
        scene.add(this.sprite);
    }

    render() {

    }

    update() {
        // this.totalTicks++;

        // if (this.totalTicks >= this.lifetimeTicks) {
        //     this.isAlive = false;
        // }

        this.x += this.xVelocity;
        this.y += this.yVelocity;

        this.attachedTo.forEach(el => {
            el.xVelocity = this.xVelocity;
            el.yVelocity = this.yVelocity;
        });

        this.sprite.position.set(this.x, this.y, 0);
    }
}