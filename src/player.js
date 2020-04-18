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
var THREE = require('three');
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(scene, maxAnisotrophy) {
        var _this = _super.call(this) || this;
        _this.scene = scene;
        _this.x = 0;
        _this.y = 4.5;
        _this.xVel = 0;
        _this.yVel = 0;
        _this.left = false;
        _this.right = false;
        _this.up = false;
        _this.down = false;
        _this.maxVel = 0.05;
        _this.health = 100;
        _this.isAlive = true;
        _this.maxAnisotrophy = maxAnisotrophy;
        _this.beemanIdleState = new THREE.TextureLoader().load("assets/swimmer1.png");
        var spriteMap = _this.beemanIdleState;
        spriteMap.anisotropy = _this.maxAnisotrophy;
        var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
        spriteMaterial.map.minFilter = THREE.LinearFilter;
        _this.sprite = new three_1.Sprite(spriteMaterial);
        _this.sprite.scale.set(1 / 8, 1 / 8, 1 / 8);
        _this.scene.add(_this.sprite);
        return _this;
    }
    Player.prototype.update = function () {
        if (this.right) {
            this.xVel = Math.min(this.xVel += 0.01, this.maxVel);
        }
        if (this.left) {
            this.xVel = Math.max(this.xVel -= 0.01, -this.maxVel);
        }
        if (this.up) {
            this.yVel = Math.max(this.yVel += 0.001, this.maxVel); //idk why, but otherwise it's too fast
        }
        if (this.down) {
            this.yVel = Math.max(this.yVel -= 0.01, -this.maxVel);
        }
        this.x += !this.isAlive || (this.x < -7.5 && this.xVel < 0) || (this.x > 7.5 && this.xVel > 0) ? 0 : this.xVel;
        this.y += !this.isAlive || (this.y < .5 && this.yVel < 0) || (this.y > 8.5 && this.yVel > 0) ? 0 : this.yVel;
        this.xVel *= 0.95;
        this.yVel *= 0.95;
        this.sprite.position.set(this.x, this.y, 0);
        if (this.health <= 0) {
            this.isAlive = false;
        }
        else {
            this.isAlive = true;
        }
    };
    Player.prototype.render = function () {
    };
    return Player;
}(stage_1.Updateable));
exports.Player = Player;
