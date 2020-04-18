import { Sprite, Scene, TextureLoader, SpriteMaterial, Texture } from "three";
import { Updateable } from "./stage";
var THREE = require('three');//only needed due to three type shenanigans

export class Ally extends Updateable {
    sprite: Sprite;
    x: number;
    y: number;
    xVelocity: number;
    yVelocity: number;
    type: number;
    health: number;
    isAlive: boolean;
    rotationRadians: number;
    //id:number; //unique id

    constructor(scene: Scene, x: number, y: number, xVel: number, yVel: number, type: number/*, id: number*/) {
        super();//needed?
        this.x = x;
        this.y = y;
        this.type = type;
        this.health = 50;
        this.isAlive = true; 
        this.xVelocity = xVel;
        this.yVelocity = yVel;
        var scaleX = 1/8;
        var scaleY = 1/8;
        var scaleZ = 1;
        //this.rotationRadians = rotationRadians;//not implementing rotation for awhile
        //this.id = id;

        var spriteMap: Texture;
        switch (type) {
            case 0: {
                spriteMap = new THREE.TextureLoader().load("assets/boundingBox.png");
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

        this.x += this.xVelocity;
        this.y += this.yVelocity;

        this.sprite.position.set(this.x, this.y, 0);
    }
}