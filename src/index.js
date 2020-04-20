"use strict";
/**
 * Add enemies
 * Add ally spawns
 * Add neutral non-moving state
 * Add placement indicator
 * Add adjacency bonuses
 * Add Score/lose condition
 * Add sound
 */
exports.__esModule = true;
var three_1 = require("three");
var stage_1 = require("./stage");
var staticImage_1 = require("./staticImage");
var mouse_1 = require("./mouse");
var enemy_1 = require("./enemy");
var light_1 = require("./light");
var structure_1 = require("./structure");
var renderer = new three_1.WebGLRenderer();
//renderer.setSize(window.innerWidth, window.innerHeight);//1:1 scale resolution
if (window.innerWidth / 16 > window.innerHeight / 9) {
    renderer.setSize(window.innerHeight * (16 / 9), window.innerHeight); //make constant
}
else {
    renderer.setSize(window.innerWidth, window.innerWidth * (9 / 16));
}
//document.getElementById("canvasContainer").append(renderer.domElement);
document.body.getElementsByClassName('centered-canvas')[0].appendChild(renderer.domElement); //boardhouse uses a captured canvas element, difference?
//globals
var stageList = {}; //dictionary of all stages
var currentStage = "splash";
var win = false;
var music = new Audio('assets/SFX/OceanSong.wav');
music.loop = true;
//var shootClip = new Audio('assets/SFX/bee_buzz_edit.wav');
//shootClip.volume = 0.8;
var ticks = 0;
var selectedUnit = null; //can't actually use updateable
var stragglerX = -4;
stageList["main"] = new stage_1.Stage();
stageList["splash"] = new stage_1.Stage();
stageList["win"] = new stage_1.Stage();
//splash screen logic
stageList["splash"].update = function () {
    stageList["splash"].elementsList["game"].forEach(function (el) { el.update(); });
};
stageList["win"].update = function () {
    stageList["win"].elementsList["game"].forEach(function (el) { el.update(); });
};
//backgrounds
for (var i = 0; i < 50; i++) { //kinda lazy
    stageList["main"].elementsList["background"].push(new staticImage_1.StaticImage(stageList["main"].sceneList["background"], i * 16, 0, "assets/forestFloor.png", new three_1.Vector3(16, 9, 1)));
}
//stageList["gameOver"].elementsList["ui"].push(new StaticImage(stageList["gameOver"].sceneList["ui"], 0, 0, "assets/GenericLoseScreen.png", new Vector3(16, 9, 1)));
stageList["splash"].elementsList["ui"].push(new staticImage_1.StaticImage(stageList["splash"].sceneList["ui"], 0, 0, "assets/BbtL_Splash_Screen.png", new three_1.Vector3(16, 9, 1)));
stageList["win"].elementsList["ui"].push(new staticImage_1.StaticImage(stageList["win"].sceneList["ui"], 0, 0, "assets/win.png", new three_1.Vector3(16, 9, 1)));
stageList["main"].elementsList["ui"].push(new mouse_1.Mouse(stageList["main"].sceneList["ui"]));
//initial colony placement
for (var i = 0; i < 9; i++) {
    stageList["main"].elementsList["game"].push(new structure_1.Structure(stageList["main"].sceneList["game"], 8 + ((i % 3) * 1 / 4), 4.25 + (Math.floor(i / 3) * 1 / 4), i % 2));
}
//game screen logic
stageList["main"].update = function () {
    var localStage = stageList["main"];
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
    if (ticks % 480 == 0) {
        var spawnX = Math.random();
        var spawnY = Math.random();
        localStage.elementsList["game"].push(new light_1.LightBeam(localStage.sceneList["game"], (Math.round(((spawnX * 16) + (stragglerX /* + 4*/)) * 4) / 4) + (1 / 8), (Math.round((spawnY * 9) * 4) / 4) + (1 / 8), 0, 0, 0));
    }
    else if ((ticks + 240) % 480 == 0) {
        var spawnX = Math.random();
        var spawnY = Math.random();
        localStage.elementsList["game"].push(new light_1.LightBeam(localStage.sceneList["game"], (Math.round((((spawnX * 8) - 4) + (stragglerX /* + 4*/)) * 4) / 4) + (1 / 8), (Math.round(spawnY * 9 * 4) / 4) + (1 / 8), 0, 0, 0));
    }
    localStage.elementsList["game"].forEach(function (el) {
        if (el.isAlive != undefined && !el.isAlive) {
            localStage.sceneList["game"].remove(el.sprite);
        }
    });
    // if(localStage.elementsList["game"].findIndex(el => { el instanceof Structure }) == -1) {
    //     currentStage = "win";//mess with later
    // }
    //var localPlayer: Player = localStage.elementsList["game"].find(el => el instanceof Player);
    var localMouse = localStage.elementsList["ui"].find(function (el) { return el instanceof mouse_1.Mouse; });
    // filter out dead entities
    localStage.elementsList["game"] = localStage.elementsList["game"].filter(function (el) { return el.isAlive || el.isAlive == undefined; });
    // localStage.elementsList["game"].forEach(element => {
    //     if (element.isAlive != undefined && element.x < localPlayer.x - 16) {
    //         element.isAlive = false;
    //     }
    // });
    localStage.elementsList["game"].forEach(function (el) { el.update(); });
    //localStage.cameraList["game"].position.set(localPlayer ? localPlayer.x : localStage.cameraList["game"].position.x, localStage.cameraList["game"].position.y, localStage.cameraList["game"].position.z);
    //collision logic
    var localMinX = 1000000;
    localStage.elementsList["game"].forEach(function (el) {
        localStage.elementsList["game"].forEach(function (el2) {
            if (el !== el2) { // only check for collision between two different objects
                if (collision(el, el2)) {
                    // if player collides with an enemy projectile, take damage   
                    if (el instanceof structure_1.Structure && el.isAlive && el2 instanceof light_1.LightBeam && el2.tick > 180) {
                        //el2.isAlive = false;
                        el.health--;
                        if (el.health < 1) {
                            el.isAlive = false;
                        }
                    }
                    if (el instanceof structure_1.Structure && el.isAlive && el2 instanceof enemy_1.Enemy) {
                        el2.isAlive = false;
                        el.health -= 20;
                        if (el.health < 1) {
                            el.isAlive = false;
                        }
                    }
                }
            }
        });
        if (!(el instanceof enemy_1.Enemy) && !(el instanceof light_1.LightBeam) && el.x < localMinX) {
            localMinX = el.x;
        }
    });
    if (localMinX > stragglerX) {
        stragglerX = localMinX;
    }
    localStage.cameraList["game"].position.setX(stragglerX + 4);
};
//main update
var interval = setInterval(update, 1000 / 60); //60 ticks per second
function update() {
    ticks++;
    stageList[currentStage].baseUpdate();
    stageList[currentStage].update();
}
// check if two items are colliding
function collision(a, b) {
    return (a.x - (a.sprite.scale.x / 2) < b.x + (b.sprite.scale.x / 2) &&
        a.x + (a.sprite.scale.x / 2) > b.x - (b.sprite.scale.x / 2) &&
        a.y - (a.sprite.scale.y / 2) < b.y + (b.sprite.scale.y / 2) &&
        a.y + (a.sprite.scale.y / 2) > b.y - (b.sprite.scale.y / 2));
}
var animate = function () {
    requestAnimationFrame(animate);
    stageList[currentStage].render(renderer);
};
animate();
window.addEventListener("resize", function (e) {
    if (window.innerWidth / 16 > window.innerHeight / 9) {
        renderer.setSize(window.innerHeight * (16 / 9), window.innerHeight); //make constant
    }
    else {
        renderer.setSize(window.innerWidth, window.innerWidth * (9 / 16));
    }
});
/* movement controls for the player */
window.addEventListener("keydown", function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (music.played != null) {
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
window.addEventListener("click", function (e) {
    if (currentStage == "splash") {
        currentStage = "main";
    }
});
window.addEventListener("mousemove", function (e) {
    var mouse = stageList["main"].elementsList["ui"].find(function (el) { return el instanceof mouse_1.Mouse; });
    mouse.x = ((e.clientX / window.innerWidth) * 16) - 8;
    mouse.y = 4.5 - ((e.clientY / window.innerHeight) * 9);
});
window.addEventListener("mouseup", function (e) {
    var mouse = stageList["main"].elementsList["ui"].find(function (el) { return el instanceof mouse_1.Mouse; });
    mouse.isClickedUp = true;
    mouse.isClickedDown = false;
    mouse.y += 4.5; //dumb hack to not have to reposition game elements
    mouse.x += stragglerX + 4;
    if (currentStage == "main") {
        if (selectedUnit == null) {
            stageList["main"].elementsList["game"].forEach(function (el) {
                if (!(el instanceof enemy_1.Enemy) && !(el instanceof light_1.LightBeam) && collision(el, mouse)) {
                    selectedUnit = el;
                }
            });
        }
        else {
            var alreadyPlacement = false;
            stageList["main"].elementsList["game"].forEach(function (el) {
                if (!(el instanceof enemy_1.Enemy) && !(el instanceof light_1.LightBeam) && collision(el, mouse)) {
                    alreadyPlacement = true;
                }
            });
            if (!alreadyPlacement) {
                selectedUnit.target = new three_1.Vector2(Math.round(mouse.x * 4) / 4, Math.round(mouse.y * 4) / 4);
                selectedUnit.velocity = new three_1.Vector2(0, 0);
                selectedUnit = null;
            }
        }
    }
    mouse.y -= 4.5; //dumb hack to not have to reposition game elements
    mouse.x -= stragglerX + 4;
});
window.addEventListener("mousedown", function (e) {
    var mouse = stageList["main"].elementsList["ui"].find(function (el) { return el instanceof mouse_1.Mouse; });
    mouse.isClickedUp = false;
    mouse.isClickedDown = true;
});
