"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var three_1 = require("three");
var stage_1 = require("./stage");
var THREE = require('three'); //only needed due to three type shenanigans
var Platform = /** @class */ (function (_super) {
    __extends(Platform, _super);
    function Platform(scene, x, y, xVel, yVel, type, id) {
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        _this.type = type;
        _this.totalTicks = 0;
        _this.isAlive = true;
        _this.isAttached = false;
        _this.xVelocity = xVel;
        _this.yVelocity = yVel;
        var scaleX = 1 / 8;
        var scaleY = 1 / 8;
        var scaleZ = 1;
        //this.rotationRadians = rotationRadians;//not implementing rotation for awhile
        _this.id = id;
        _this.attachedTo = [];
        var spriteMap;
        switch (type) {
            case 0: { //basic platform
                spriteMap = new THREE.TextureLoader().load("assets/raft1.png");
                //this.lifetimeTicks = 60 * 10;//10 seconds
                break;
            }
        }
        spriteMap.minFilter = THREE.NearestFilter;
        spriteMap.magFilter = THREE.NearestFilter;
        var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
        _this.sprite = new three_1.Sprite(spriteMaterial);
        _this.sprite.scale.set(scaleX, scaleY, scaleZ); //guesstemates
        scene.add(_this.sprite);
        return _this;
    }
    Platform.prototype.render = function () {
    };
    Platform.prototype.update = function () {
        // this.totalTicks++;
        var _this = this;
        // if (this.totalTicks >= this.lifetimeTicks) {
        //     this.isAlive = false;
        // }
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        this.attachedTo.forEach(function (el) {
            el.xVelocity = _this.xVelocity;
            el.yVelocity = _this.yVelocity;
        });
        this.sprite.position.set(this.x, this.y, 0);
    };
    return Platform;
}(stage_1.Updateable));
exports.Platform = Platform;
