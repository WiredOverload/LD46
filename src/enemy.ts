import { Sprite, Scene, TextureLoader, SpriteMaterial, Texture, LinearFilter, NearestFilter, RepeatWrapping } from "three";
import { Updateable } from "./stage";
var THREE = require('three');//only needed due to three type shenanigans

export class Enemy extends Updateable {
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
    animationDelay:number;
    animationFrame:number;
    tick:number;
    spriteMap:Texture;

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
        this.animationDelay = 8;
        this.animationFrame = 0;
        this.tick = 0;

        switch (type) {
            case 0: {
                this.spriteMap = new THREE.TextureLoader().load("assets/Beetle.png");
                break;
            }
        }
        this.spriteMap.minFilter = LinearFilter;
        this.spriteMap.magFilter = NearestFilter;
        this.spriteMap.wrapS = this.spriteMap.wrapT = RepeatWrapping;
        this.spriteMap.repeat.set(1/8, 1);
        var spriteMaterial: SpriteMaterial = new THREE.SpriteMaterial({ map: this.spriteMap, color: 0xffffff });
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

        this.tick++;

        if(this.tick % this.animationDelay == 0) {
            this.animationFrame++;
            if(this.animationFrame > 7) {
                this.animationFrame = 0;
            }
        }

        this.spriteMap.offset.x = this.animationFrame / 8;
    }
}