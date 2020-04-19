import { Sprite, Scene, TextureLoader, SpriteMaterial, Vector3, Texture, WebGLRenderer, RepeatWrapping, NearestFilter, LinearFilter} from "three";
import { Updateable } from "./stage";
var THREE = require('three');//only needed due to three type shenanigans

export class Mouse extends Updateable{
    sprite:Sprite;
    spriteHalo:Sprite;
    x:number;
    y:number;
    isClickedDown:boolean;
    isClickedUp:boolean;
    spriteMap:Texture;
    animationDelay:number;
    animationFrame:number;
    tick;

    constructor(scene:Scene) {
        super();//needed?
        this.x = 0;
        this.y = 5;
        this.spriteMap = new TextureLoader().load("assets/sparkle3.png");
        this.spriteMap.wrapS = this.spriteMap.wrapT = RepeatWrapping;
        this.spriteMap.repeat.set(1/8, 1);
        this.animationDelay = 4;
        this.animationFrame = 0;
        this.tick = 0;
        
        this.spriteMap.anisotropy = 0;//maxAnisotropy;//renderer.capabilities.getMaxAnisotropy()
        this.spriteMap.minFilter = LinearFilter;
        this.spriteMap.magFilter = NearestFilter;
        var spriteMaterial:SpriteMaterial = new SpriteMaterial( { map: this.spriteMap, color: 0xffffff } );
        this.sprite = new Sprite( spriteMaterial );
        this.sprite.scale.set(1/8, 1/8, 1/8);

        this.sprite.position.set(this.x, this.y, 0);
        scene.add(this.sprite);
    }

    render(scene:Scene) {
        
        // this.animationFrame++;
        // if(this.animationFrame > 5)
        // {
        //     this.animationFrame = 0;
        // }

        // this.spriteMap.offset.x = this.animationFrame * 4;

        // if(this.isClickedDown)
        // {
        //     scene.add(this.spriteHalo);
        // }

        // if(this.isClickedUp)
        // {
        //     scene.remove(this.spriteHalo);
        // }
    }

    update() {
        this.tick++;

        this.sprite.position.set(this.x, this.y, 0);

        if(this.tick % this.animationDelay == 0) {
            this.animationFrame++;
            if(this.animationFrame > 5) {
                this.animationFrame = 0;
            }
        }
        

        this.spriteMap.offset.x = this.animationFrame / 8;
    }
}