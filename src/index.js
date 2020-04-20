"use strict";
/**
 * Add neutral non-moving state
 * Add placement indicator
 * Add sound
 * Balancing
 ** Add rotation
 */
exports.__esModule = true;
var three_1 = require("three");
var stage_1 = require("./stage");
var staticImage_1 = require("./staticImage");
var mouse_1 = require("./mouse");
var enemy_1 = require("./enemy");
var light_1 = require("./light");
var structure_1 = require("./structure");
var ally_1 = require("./ally");
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
stageList["lose"] = new stage_1.Stage();
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
stageList["lose"].elementsList["ui"].push(new staticImage_1.StaticImage(stageList["lose"].sceneList["ui"], 0, 0, "assets/GenericLoseScreen.png", new three_1.Vector3(16, 9, 1)));
stageList["main"].elementsList["ui"].push(new mouse_1.Mouse(stageList["main"].sceneList["ui"]));
//initial colony placement
for (var i = 0; i < 9; i++) {
    stageList["main"].elementsList["game"].push(new structure_1.Structure(stageList["main"].sceneList["game"], 8 + ((i % 3) * 1 / 4), 4.25 + (Math.floor(i / 3) * 1 / 4), i % 2));
}
//game screen logic
stageList["main"].update = function () {
    var localStage = stageList["main"];
    //enemy spawning
    if (ticks % 180 == 0) {
        var spawnLocation = Math.random();
        if (spawnLocation < .5) {
            localStage.elementsList["game"].push(new enemy_1.Enemy(localStage.sceneList["game"], (Math.random() * 14) + stragglerX + 1, 9.5, (Math.random() * .04) - .02, -Math.random() * .02, 0));
        }
        else if (spawnLocation >= .5) {
            localStage.elementsList["game"].push(new enemy_1.Enemy(localStage.sceneList["game"], (Math.random() * 14) + stragglerX + 1, -.5, (Math.random() * .04) - .02, -Math.random() * .02, 0));
        }
    }
    //light spawning
    if (ticks % 240 == 0) {
        var spawnX = Math.random();
        var spawnY = Math.random();
        localStage.elementsList["game"].push(new light_1.LightBeam(localStage.sceneList["game"], (Math.round(((spawnX * 16) + (stragglerX /* + 4*/)) * 4) / 4) + (1 / 8), (Math.round((spawnY * 9) * 4) / 4) + (1 / 8), 0, 0, 0));
    }
    else if ((ticks + 120) % 240 == 0) {
        var spawnX = Math.random();
        var spawnY = Math.random();
        localStage.elementsList["game"].push(new light_1.LightBeam(localStage.sceneList["game"], (Math.round((((spawnX * 8) - 4) + (stragglerX /* + 4*/)) * 4) / 4) + (1 / 8), (Math.round(spawnY * 9 * 4) / 4) + (1 / 8), 0, 0, 0));
    }
    localStage.elementsList["game"].forEach(function (el) {
        if (el.isAlive != undefined && !el.isAlive) {
            localStage.sceneList["game"].remove(el.sprite);
        }
    });
    if (currentStage == "main" && localStage.elementsList["game"].findIndex(function (el) { return el instanceof structure_1.Structure; }) == -1) {
        currentStage = "lose";
        document.getElementById("TICKS").innerHTML =
            "your moss colony managed to drag itself " + ((stragglerX + 4) * 4) + " Moss Units away towards shelter, just "
                + (1000 - ((stragglerX + 4) * 4)) + " Moss Units short.";
    }
    if (currentStage == "main" && ((stragglerX + 4) * 4) >= 1000) {
        currentStage = "win";
    }
    //general cleanup
    localStage.elementsList["game"].forEach(function (element) {
        if (element.isAlive != undefined && element.x < stragglerX - 20) {
            element.isAlive = false;
        }
    });
    // filter out dead entities
    localStage.elementsList["game"] = localStage.elementsList["game"].filter(function (el) { return el.isAlive || el.isAlive == undefined; });
    localStage.elementsList["game"].forEach(function (el) { el.update(); });
    var localMinX = 1000000;
    localStage.elementsList["game"].forEach(function (el) {
        localStage.elementsList["game"].forEach(function (el2) {
            if (el !== el2) {
                if (collision(el, el2)) {
                    // if player collides with a light beam, take damage   
                    if ((el instanceof structure_1.Structure || el instanceof ally_1.Ally) && el.isAlive && el2 instanceof light_1.LightBeam && el2.tick > 180) {
                        el.health--;
                        if (el.health < 1) {
                            el.isAlive = false;
                        }
                    }
                    if ((el instanceof structure_1.Structure || el instanceof ally_1.Ally) && el.isAlive && el2 instanceof enemy_1.Enemy) {
                        el2.isAlive = false;
                        el.health -= 20;
                        if (el.health < 1) {
                            el.isAlive = false;
                        }
                    }
                }
            }
        });
        if (el instanceof structure_1.Structure) {
            if (el.x < localMinX) {
                localMinX = el.x;
            }
            var adjacent = 0;
            localStage.elementsList["game"].forEach(function (el2) {
                if (el2 instanceof structure_1.Structure && el != el2) {
                    el.x += el.sprite.scale.x;
                    if (collision(el, el2)) {
                        adjacent++;
                    }
                    el.x -= el.sprite.scale.x;
                    el.x -= el.sprite.scale.x;
                    if (collision(el, el2)) {
                        adjacent++;
                    }
                    el.x += el.sprite.scale.x;
                    el.y += el.sprite.scale.y;
                    if (collision(el, el2)) {
                        adjacent++;
                    }
                    el.y -= el.sprite.scale.y;
                    el.y -= el.sprite.scale.y;
                    if (collision(el, el2)) {
                        adjacent++;
                    }
                    el.y += el.sprite.scale.y;
                }
            });
            el.adjacentStructures = adjacent;
            if (el.spawnTicks > el.spawnCost) {
                el.spawnTicks -= el.spawnCost;
                localStage.elementsList["game"].push(new ally_1.Ally(localStage.sceneList["game"], el.x, el.y, 0));
            }
        }
        else if (el instanceof enemy_1.Enemy) {
            var closest = new three_1.Vector2(1000000, 1000000);
            var vec = new three_1.Vector2(el.x, el.y);
            localStage.elementsList["game"].forEach(function (el2) {
                if (el2 instanceof structure_1.Structure &&
                    vec.distanceTo(new three_1.Vector2(el2.x, el2.y)) < vec.distanceTo(closest)) {
                    closest = new three_1.Vector2(el2.x, el2.y);
                }
            });
            el.target = closest;
        }
    });
    if (localMinX != 1000000 && localMinX > stragglerX) {
        stragglerX = localMinX;
    }
    localStage.cameraList["game"].position.setX(stragglerX + 4);
};
//main update
var interval = setInterval(update, 1000 / 45); //60 ticks per second
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
});
window.addEventListener("click", function (e) {
    if (currentStage == "splash") {
        currentStage = "main";
        document.getElementById("TICKS").innerHTML = "";
    }
});
//remove right click functionality
window.addEventListener("contextmenu", function (e) {
    e.preventDefault();
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
                if (e.which == 3 && el instanceof ally_1.Ally && collision(el, mouse)) {
                    selectedUnit = el;
                }
                else if (e.which == 1 && el instanceof structure_1.Structure && collision(el, mouse)) {
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
