/**
 * Add neutral non-moving state
 * Add placement indicator
 * Add sound
 * Balancing
 */

import { Scene, PerspectiveCamera, WebGLRenderer, MinEquation, Vector3, Sprite, Texture, SpriteMaterial, Vector2 } from "three";
import { Stage, Updateable } from "./stage";
import { StaticImage } from "./staticImage";
import THREE = require("three");
import { Mouse } from "./mouse";
import { Enemy } from "./enemy";
import { LightBeam } from "./light";
import { Structure } from "./structure";
import { Ally } from "./ally";

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
var music = new Audio('assets/SFX/MossSong.wav');
music.loop = true;
var burnClip = new Audio('assets/SFX/SFX_Fireball.wav');
//burnClip.volume = 0.8;
var buzzClip = new Audio('assets/SFX/bee_buzz_edit.wav');
buzzClip.volume = 0.8;
var hitClip = new Audio('assets/SFX/bee_man_get_hit2.wav');


var ticks:number = 0;
var selectedUnit:any = null;//can't actually use updateable
var stragglerX:number = -4;

stageList["main"] = new Stage();
stageList["splash"] = new Stage();
stageList["win"] = new Stage();
stageList["lose"] = new Stage();

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


stageList["splash"].elementsList["ui"].push(new StaticImage(stageList["splash"].sceneList["ui"], 0, 0, "assets/BbtL_Splash_Screen.png", new Vector3(16, 9, 1)));
stageList["win"].elementsList["ui"].push(new StaticImage(stageList["win"].sceneList["ui"], 0, 0, "assets/win.png", new Vector3(16, 9, 1)));
stageList["lose"].elementsList["ui"].push(new StaticImage(stageList["lose"].sceneList["ui"], 0, 0, "assets/GenericLoseScreen.png", new Vector3(16, 9, 1)));
stageList["main"].elementsList["ui"].push(new Mouse(stageList["main"].sceneList["ui"]));

//initial colony placement
for(var i = 0; i < 9; i++) {
    stageList["main"].elementsList["game"].push(new Structure(stageList["main"].sceneList["game"], 8 + ((i % 3) * 1/4), 4.25 + (Math.floor(i / 3) * 1/4), i % 2));
}

//game screen logic
stageList["main"].update = function () {//actual splash screen update logic here
    var localStage: Stage = stageList["main"];

    //enemy spawning
    if(ticks % 180 == 0)
    {
        var spawnLocation = Math.random();
        if(spawnLocation < .5)
        {
            localStage.elementsList["game"].push(
                new Enemy(localStage.sceneList["game"], (Math.random() * 14) + stragglerX + 1, 9.5, (Math.random() * .04) - .02, -Math.random() * .02, 0));
        }
        else if(spawnLocation >= .5)
        {
            localStage.elementsList["game"].push(
                new Enemy(localStage.sceneList["game"], (Math.random() * 14) + stragglerX + 1, -.5, (Math.random() * .04) - .02, -Math.random() * .02, 0));
        }
    }

    //light spawning
    if(ticks % 240 == 0)
    {
        var spawnX:number = Math.random();
        var spawnY:number = Math.random();
        localStage.elementsList["game"].push(
            new LightBeam(localStage.sceneList["game"], (Math.round(((spawnX * 16) + (stragglerX/* + 4*/)) * 4) / 4) + (1/8), (Math.round((spawnY * 9) * 4) / 4) + (1/8), 0, 0, 0));
    }
    else if((ticks + 120) % 240 == 0)
    {
        var spawnX:number = Math.random();
        var spawnY:number = Math.random();
        localStage.elementsList["game"].push(
            new LightBeam(localStage.sceneList["game"], (Math.round((((spawnX * 8) - 4) + (stragglerX/* + 4*/)) * 4) / 4) + (1/8), (Math.round(spawnY * 9 * 4) / 4) + (1/8), 0, 0, 0));
    }


    localStage.elementsList["game"].forEach(el => {
        if (el.isAlive != undefined && !el.isAlive) {
            localStage.sceneList["game"].remove(el.sprite);
        }
    });

    if(currentStage == "main" && localStage.elementsList["game"].findIndex(el => el instanceof Structure ) == -1) {
        currentStage = "lose";
        document.getElementById("TICKS").innerHTML = 
            "your moss colony managed to drag itself " + ((stragglerX + 4) * 4) + " Moss Units towards shelter, just "
             + (1000 - ((stragglerX + 4) * 4)) + " Moss Units short."
    }

    if(currentStage == "main" && ((stragglerX + 4) * 4) >= 1000) {
        currentStage = "win";
    }

    //general cleanup
    localStage.elementsList["game"].forEach(element => {
        if (element.isAlive != undefined && element.x < stragglerX - 20) {
            element.isAlive = false;
        }
    });

    // filter out dead entities
    localStage.elementsList["game"] = localStage.elementsList["game"].filter(el => el.isAlive || el.isAlive == undefined);

    localStage.elementsList["game"].forEach(el => { el.update() });

    var localMinX:number = 1000000;
    localStage.elementsList["game"].forEach(el => {
        localStage.elementsList["game"].forEach(el2 => {
            if (el !== el2) {
                if (collision(el, el2)) {
                    // if player collides with a light beam, take damage   
                    if ((el instanceof Structure || el instanceof Ally) && el.isAlive && el2 instanceof LightBeam && el2.tick > 180) {
                        el.health--;
                        if(el.health < 1) {
                            el.isAlive = false;
                            burnClip.play();
                        }
                    }
                    if ((el instanceof Structure || el instanceof Ally) && el.isAlive && el2 instanceof Enemy) {
                        el2.isAlive = false;
                        el.health -= 20;
                        hitClip.play();
                        if(el.health < 1) {
                            el.isAlive = false;
                            if(el instanceof Structure) {
                                buzzClip.play();
                            }
                        }
                    }
                }
            }
        });

        if(el instanceof Structure){
            if(el.x < localMinX) {
                localMinX = el.x;
            }

            var adjacent:number = 0;
            localStage.elementsList["game"].forEach(el2 => {
                if(el2 instanceof Structure && el != el2) {
                    el.x += el.sprite.scale.x;
                    if(collision(el, el2)) {
                        adjacent++;
                    }
                    el.x -= el.sprite.scale.x;
                    el.x -= el.sprite.scale.x;
                    if(collision(el, el2)) {
                        adjacent++;
                    }
                    el.x += el.sprite.scale.x;
                    el.y += el.sprite.scale.y;
                    if(collision(el, el2)) {
                        adjacent++;
                    }
                    el.y -= el.sprite.scale.y;
                    el.y -= el.sprite.scale.y;
                    if(collision(el, el2)) {
                        adjacent++;
                    }
                    el.y += el.sprite.scale.y;

                }
            });
            el.adjacentStructures = adjacent;

            if(el.spawnTicks > el.spawnCost) {
                el.spawnTicks -= el.spawnCost;
                localStage.elementsList["game"].push(
                    new Ally(localStage.sceneList["game"], el.x, el.y, 0));
            }
        }
        else if(el instanceof Enemy) {
            var closest:Vector2 = new Vector2(1000000, 1000000);
            var vec:Vector2 = new Vector2(el.x, el.y)
            localStage.elementsList["game"].forEach(el2 => {
                if(el2 instanceof Structure &&
                    vec.distanceTo(new Vector2(el2.x, el2.y)) < vec.distanceTo(closest)) {
                        closest = new Vector2(el2.x, el2.y);
                }
            });
            el.target = closest;
        }
    });

    if(localMinX != 1000000 && localMinX > stragglerX) {
        stragglerX = localMinX;
    }
    localStage.cameraList["game"].position.setX(stragglerX + 4);
}

//main update
var interval = setInterval(update, 1000 / 45);//60 ticks per second
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
});

window.addEventListener("click", e => { 
    if(currentStage == "splash") {
        currentStage = "main"
        document.getElementById("TICKS").innerHTML = "";
        if(music.played != null) {
            music.play();
        }
    }
});

//remove right click functionality
window.addEventListener("contextmenu", e => {
    e.preventDefault();
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
                if(e.which == 3 && el instanceof Ally && collision(el, mouse)){
                    selectedUnit = el;
                }
                else if(e.which == 1 && el instanceof Structure && collision(el, mouse)){
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