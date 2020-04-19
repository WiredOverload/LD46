/**
 * Fix moving in straight lines
 * Add light obstacles
 * Add enemies
 * Add ally spawns
 * Add neutral non-moving state
 * Add placement indicator
 * Add adjacency bonuses
 * Add Score/lose condition
 * Add sound
 */

import { Scene, PerspectiveCamera, WebGLRenderer, MinEquation, Vector3, Sprite, Texture, SpriteMaterial, Vector2 } from "three";
import { Stage, Updateable } from "./stage";
import { StaticImage } from "./staticImage";
import THREE = require("three");
import { Mouse } from "./mouse";
import { Enemy } from "./enemy";
import { LightBeam } from "./light";
import { Structure } from "./structure";

var renderer: WebGLRenderer = new WebGLRenderer();
//renderer.setSize(window.innerWidth, window.innerHeight);//1:1 scale resolution
if (window.innerWidth / 16 > window.innerHeight / 9) {
    renderer.setSize(window.innerHeight * (16 / 9), window.innerHeight);//make constant
}
else {
    renderer.setSize(window.innerWidth, window.innerWidth * (9 / 16));
}

//document.getElementById("canvasContainer").append(renderer.domElement);
document.body.getElementsByClassName('centered-canvas')[0].appendChild(renderer.domElement);//boardhouse uses a captured canvas element, difference?

//globals
let stageList: { [key: string]: Stage; } = {};//dictionary of all stages
var currentStage: string = "splash";
var win = false;
var music = new Audio('assets/SFX/OceanSong.wav');
music.loop = true;
//var shootClip = new Audio('assets/SFX/bee_buzz_edit.wav');
//shootClip.volume = 0.8;
var ticks:number = 0;
var selectedUnit:any = null;//can't actually use updateable
var stragglerX:number = -4;

stageList["main"] = new Stage();
stageList["splash"] = new Stage();
stageList["win"] = new Stage();

//splash screen logic
stageList["splash"].update = function () {//actual splash screen update logic here
    stageList["splash"].elementsList["game"].forEach(el => { el.update() });
}

stageList["win"].update = function () {
    stageList["win"].elementsList["game"].forEach(el => { el.update() });
}

//backgrounds
for(var i = 0; i < 50; i++) {//kinda lazy
    stageList["main"].elementsList["background"].push(new StaticImage(stageList["main"].sceneList["background"], i * 16, 0, "assets/forestFloor.png", new Vector3(16, 9, 1)));
}

//stageList["gameOver"].elementsList["ui"].push(new StaticImage(stageList["gameOver"].sceneList["ui"], 0, 0, "assets/GenericLoseScreen.png", new Vector3(16, 9, 1)));
stageList["splash"].elementsList["ui"].push(new StaticImage(stageList["splash"].sceneList["ui"], 0, 0, "assets/BbtL_Splash_Screen.png", new Vector3(16, 9, 1)));
stageList["win"].elementsList["ui"].push(new StaticImage(stageList["win"].sceneList["ui"], 0, 0, "assets/win.png", new Vector3(16, 9, 1)));
stageList["main"].elementsList["ui"].push(new Mouse(stageList["main"].sceneList["ui"]));

//initial colony placement
for(var i = 0; i < 9; i++) {
    stageList["main"].elementsList["game"].push(new Structure(stageList["main"].sceneList["game"], 8 + ((i % 3) * 1/4), 4.25 + (Math.floor(i / 3) * 1/4), i % 2));
}

//game screen logic
stageList["main"].update = function () {//actual splash screen update logic here
    var localStage: Stage = stageList["main"];

    //enemy spawning
    // if(ticks % 120 == 0)
    // {
    //     var spawnLocation = Math.random();
    //     if(spawnLocation < .5)
    //     {
    //         localStage.elementsList["game"].push(
    //             new Enemy(localStage.sceneList["game"], (Math.random() * 14) + 1, 9.5, (Math.random() * .04) - .02, -Math.random() * .02, 0));
    //     }
    //     else if(spawnLocation >= .5)
    //     {
    //         localStage.elementsList["game"].push(
    //             new Enemy(localStage.sceneList["game"], (Math.random() * 14) + 1, -.5, (Math.random() * .04) - .02, -Math.random() * .02, 0));
    //     }
    // }

    //light spawning
    if(ticks % 480 == 0)
    {
        var spawnX:number = Math.random();
        var spawnY:number = Math.random();
        localStage.elementsList["game"].push(
            new LightBeam(localStage.sceneList["game"], (Math.round(((spawnX * 16) + (stragglerX + 4)) * 4) / 4) + (1/8), (Math.round((spawnY * 9) * 4) / 4) + (1/8), 0, 0, 0));
    }
    else if((ticks + 240) % 480 == 0)
    {
        var spawnX:number = Math.random();
        var spawnY:number = Math.random();
        localStage.elementsList["game"].push(
            new LightBeam(localStage.sceneList["game"], (Math.round((((spawnX * 8) - 4) + (stragglerX + 4)) * 4) / 4) + (1/8), (Math.round(spawnY * 9 * 4) / 4) + (1/8), 0, 0, 0));
    }

    localStage.elementsList["game"].forEach(el => {
        if (el.isAlive != undefined && !el.isAlive) {
            localStage.sceneList["game"].remove(el.sprite);
        }
    });

    //var localPlayer: Player = localStage.elementsList["game"].find(el => el instanceof Player);
    var localMouse:Mouse = localStage.elementsList["ui"].find(el => el instanceof Mouse);
    
    // filter out dead entities
    localStage.elementsList["game"] = localStage.elementsList["game"].filter(el => el.isAlive || el.isAlive == undefined);

    // localStage.elementsList["game"].forEach(element => {
    //     if (element.isAlive != undefined && element.x < localPlayer.x - 16) {
    //         element.isAlive = false;
    //     }
    // });

    localStage.elementsList["game"].forEach(el => { el.update() });
    //localStage.cameraList["game"].position.set(localPlayer ? localPlayer.x : localStage.cameraList["game"].position.x, localStage.cameraList["game"].position.y, localStage.cameraList["game"].position.z);

    //collision logic
    var localMinX:number = 1000000;
    localStage.elementsList["game"].forEach(el => {
        localStage.elementsList["game"].forEach(el2 => {
            if (el !== el2) { // only check for collision between two different objects
                if (collision(el, el2)) {
                    // if player collides with an enemy projectile, take damage   
                    if (el instanceof Structure && el.isAlive && el2 instanceof LightBeam && el2.tick > 180) {
                        //el2.isAlive = false;
                        el.health--;
                        if(el.health < 1) {
                            el.isAlive = false;
                        }
                    }
                    if (el instanceof Structure && el.isAlive && el2 instanceof Enemy) {
                        el2.isAlive = false;
                        el.health -= 20;
                        if(el.health < 1) {
                            el.isAlive = false;
                        }
                    }
                }
            }
        });

        if(!(el instanceof Enemy) && !(el instanceof LightBeam) && el.x < localMinX){
            localMinX = el.x
        }
    });

    if(localMinX > stragglerX) {
        stragglerX = localMinX;
    }
    localStage.cameraList["game"].position.setX(stragglerX + 4);
}

//main update
var interval = setInterval(update, 1000 / 60);//60 ticks per second
function update() {
    ticks++;
    stageList[currentStage].baseUpdate();
    stageList[currentStage].update();
}

// check if two items are colliding
function collision(a, b) {
    return (
        a.x - (a.sprite.scale.x / 2) < b.x + (b.sprite.scale.x / 2) &&
        a.x + (a.sprite.scale.x / 2) > b.x - (b.sprite.scale.x / 2) &&
        a.y - (a.sprite.scale.y / 2) < b.y + (b.sprite.scale.y / 2) &&
        a.y + (a.sprite.scale.y / 2) > b.y - (b.sprite.scale.y / 2)
    )
}

var animate = function () {
    requestAnimationFrame(animate);

    stageList[currentStage].render(renderer);
}
animate();

window.addEventListener("resize", e => {
    if (window.innerWidth / 16 > window.innerHeight / 9) {
        renderer.setSize(window.innerHeight * (16 / 9), window.innerHeight);//make constant
    }
    else {
        renderer.setSize(window.innerWidth, window.innerWidth * (9 / 16));
    }
});

/* movement controls for the player */
window.addEventListener("keydown", e => {
    e.preventDefault();
    e.stopPropagation();
    if(music.played != null) {
        music.play();
    }
    // if (currentStage == "main") {
    //     //mouse controls planned
    // }
});

/* movement controls for the player */
// window.addEventListener("keyup", e => {
//     if (currentStage == "main") {
//         //mouse controls planned
//     }
// });

// var respawn = function () {
//     // respawn player to starting position
//     var player: Player = stageList["main"].elementsList["game"].find(el => el instanceof Player);
//     if (player) {
//         player.x = 0;
//         player.y = 0;
//         player.isAlive = true;
//     }
// }

window.addEventListener("click", e => { 
    if(currentStage == "splash") {
        currentStage = "main"
    }
});

window.addEventListener("mousemove", e => { 
    var mouse:Mouse = stageList["main"].elementsList["ui"].find(el => el instanceof Mouse);
    mouse.x = ((e.clientX / window.innerWidth) * 16) - 8;
    mouse.y = 4.5 - ((e.clientY / window.innerHeight) * 9);
});

window.addEventListener("mouseup", e => { 
    var mouse:Mouse = stageList["main"].elementsList["ui"].find(el => el instanceof Mouse);
    mouse.isClickedUp = true;
    mouse.isClickedDown = false;
    mouse.y += 4.5;//dumb hack to not have to reposition game elements
    mouse.x += stragglerX + 4;

    if(currentStage == "main"){
        if(selectedUnit == null){
            stageList["main"].elementsList["game"].forEach(el => {
                if(!(el instanceof Enemy) && !(el instanceof LightBeam) && collision(el, mouse)){
                    selectedUnit = el;
                }
            });
        }
        else
        {
            var alreadyPlacement = false;
            stageList["main"].elementsList["game"].forEach(el => {
                if(!(el instanceof Enemy) && !(el instanceof LightBeam) && collision(el, mouse)){
                    alreadyPlacement = true;
                }
            });

            if(!alreadyPlacement) {
                selectedUnit.target = new Vector2(Math.round(mouse.x * 4) / 4, Math.round(mouse.y * 4) / 4);
                selectedUnit.velocity = new Vector2(0, 0);
                selectedUnit = null;
            }
        }
    }
    
    mouse.y -= 4.5;//dumb hack to not have to reposition game elements
    mouse.x -= stragglerX + 4;
});

window.addEventListener("mousedown", e => { 
    var mouse:Mouse = stageList["main"].elementsList["ui"].find(el => el instanceof Mouse);
    mouse.isClickedUp = false;
    mouse.isClickedDown = true;
});