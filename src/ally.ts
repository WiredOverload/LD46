import { Sprite, Scene, TextureLoader, SpriteMaterial, Texture, LinearFilter, NearestFilter, RepeatWrapping, Vector2 } from "three";
import { Updateable } from "./stage";
var THREE = require('three');//only needed due to three type shenanigans

export class Ally extends Updateable {
    sprite: Sprite;
    x: number;
    y: number;
    velocity: Vector2;
    type: number;
    health: number;
    isAlive: boolean;
    rotationRadians: number;
    //id:number; //unique id
    animationDelay:number;
    animationFrame:number;
    tick:number;
    spriteMap:Texture;
    target:Vector2;
    angle:number;
    speed:number;

    constructor(scene: Scene, x: number, y: number, type: number/*, id: number*/) {
        super();//needed?
        this.x = x;
        this.y = y;
        this.type = type;
        this.health = 50;
        this.isAlive = true; 
        this.velocity = new Vector2(0, 0);
        var scaleX = 1/8;
        var scaleY = 1/8;
        var scaleZ = 1;
        //this.rotationRadians = rotationRadians;//not implementing rotation for awhile
        //this.id = id;
        this.animationDelay = 8;
        this.animationFrame = 0;
        this.tick = 0;
        this.angle = 0;

        switch (type) {
            case 0: {
                this.spriteMap = new THREE.TextureLoader().load("assets/mossPawn.png");
                this.speed = .02;
                break;
            }
        }
        this.spriteMap.minFilter = LinearFilter;
        this.spriteMap.magFilter = NearestFilter;
        this.spriteMap.wrapS = this.spriteMap.wrapT = RepeatWrapping;
        this.spriteMap.repeat.set(1/16, 1);
        var spriteMaterial: SpriteMaterial = new THREE.SpriteMaterial({ map: this.spriteMap, color: 0xffffff });
        this.sprite = new Sprite(spriteMaterial);
        this.sprite.scale.set(scaleX, scaleY, scaleZ);//guesstemates
        scene.add(this.sprite);
    }

    render() {

    }

    update() {

        if(!(this.target.x == 0 && this.target.y == 0) &&
            this.x != this.target.x && this.y != this.target.y){
            if(this.velocity.x != 0 || this.velocity.y != 0){
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                if(Math.abs(this.target.x - this.x) < .1 && Math.abs(this.target.y - this.y) < .1){
                    this.x = this.target.x;
                    this.y = this.target.y;
                    this.velocity.x = 0;
                    this.velocity.y = 0;
                }
            }
            else
            {
                this.angle = Math.atan((this.target.y - this.y)/(this.target.x - this.x));
                this.velocity.x = Math.cos(this.angle) * this.speed;
                this.velocity.y = Math.sin(this.angle) * this.speed;
            }
        }

        this.sprite.position.set(this.x, this.y, 0);

        this.tick++;

        if(this.tick % this.animationDelay == 0) {
            this.animationFrame++;
            if(this.animationFrame > 15) {
                this.animationFrame = 0;
            }
        }

        this.spriteMap.offset.x = this.animationFrame / 16;
    }
}