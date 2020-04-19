"use strict";
/**
 * This class defines a "stage" which should be used to seperate updates, screens, or menus
 * This class is boilerplate and should not be changed probably
 */
exports.__esModule = true;
var three_1 = require("three");
var Updateable = /** @class */ (function () {
    function Updateable() {
    }
    return Updateable;
}());
exports.Updateable = Updateable;
var Stage = /** @class */ (function () {
    function Stage() {
        this.sceneList = {}; //this seems like a hack to initialize
        this.sceneList["game"] = new three_1.Scene();
        this.sceneList["ui"] = new three_1.Scene(); //orthographic vs perspective?
        this.sceneList["background"] = new three_1.Scene();
        this.height = 9;
        this.width = 16;
        //this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);//endererSize.width / - 2, rendererSize.width / 2, rendererSize.height / 2, rendererSize.height / -2, -1000, 1000
        this.cameraList = {}; //this seems like a hack to initialize
        this.cameraList["game"] = new three_1.OrthographicCamera(this.width / -2, this.width / 2, this.height, 0, -1000, 1000);
        this.cameraList["game"].position.set(0, 0, 25);
        this.cameraList["game"].lookAt(0, 0, 0);
        this.cameraList["ui"] = new three_1.OrthographicCamera(this.width / -2, this.width / 2, this.height / 2, this.height / -2, -1000, 1000);
        this.cameraList["ui"].position.set(0, 0, 25);
        this.cameraList["ui"].lookAt(0, 0, 0);
        this.cameraList["background"] = new three_1.OrthographicCamera(this.width / -2, this.width / 2, this.height / 2, this.height / -2, -1000, 1000); //make sure this is always the same as the gameCamera
        this.cameraList["background"].position.set(0, 0, 25);
        this.cameraList["background"].lookAt(0, 0, 0);
        this.elementsList = {}; //this seems like a hack to initialize
        this.elementsList["ui"] = [];
        this.elementsList["background"] = [];
        this.elementsList["game"] = [];
    }
    Stage.prototype.render = function (renderer) {
        renderer.autoClear = true;
        renderer.render(this.sceneList["background"], this.cameraList["background"]);
        renderer.autoClear = false;
        renderer.render(this.sceneList["game"], this.cameraList["game"]);
        renderer.render(this.sceneList["ui"], this.cameraList["ui"]);
    };
    Stage.prototype.baseUpdate = function () {
        //mouse
        this.elementsList["ui"].forEach(function (element) {
            element.update();
        });
        this.elementsList["game"].forEach(function (element) {
            element.update();
        });
        this.elementsList["background"].forEach(function (element) {
            element.update();
        });
        this.cameraList["background"].position.set(this.cameraList["game"].position.x, this.cameraList["game"].position.y, this.cameraList["game"].position.z);
    };
    Stage.prototype.update = function () {
        //this should be left empty for each instance to define themselves?
    };
    return Stage;
}());
exports.Stage = Stage;
