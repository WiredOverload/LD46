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
var Mouse = /** @class */ (function (_super) {
    __extends(Mouse, _super);
    function Mouse(scene) {
        var _this = _super.call(this) || this;
        _this.x = 0;
        _this.y = 5;
        _this.spriteMap = new three_1.TextureLoader().load("assets/sparkle5.png");
        _this.spriteMap.wrapS = _this.spriteMap.wrapT = three_1.RepeatWrapping;
        _this.spriteMap.repeat.set(1 / 8, 1);
        _this.animationDelay = 4;
        _this.animationFrame = 0;
        _this.tick = 0;
        _this.spriteMap.anisotropy = 0; //maxAnisotropy;//renderer.capabilities.getMaxAnisotropy()
        _this.spriteMap.minFilter = three_1.LinearFilter;
        _this.spriteMap.magFilter = three_1.NearestFilter;
        var spriteMaterial = new three_1.SpriteMaterial({ map: _this.spriteMap, color: 0xffffff });
        _this.sprite = new three_1.Sprite(spriteMaterial);
        _this.sprite.scale.set(1 / 8, 1 / 8, 1 / 8);
        _this.sprite.position.set(_this.x, _this.y, 0);
        scene.add(_this.sprite);
        return _this;
    }
    Mouse.prototype.render = function (scene) {
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
    };
    Mouse.prototype.update = function () {
        this.tick++;
        this.sprite.position.set(this.x, this.y, 0.1);
        if (this.tick % this.animationDelay == 0) {
            this.animationFrame++;
            if (this.animationFrame > 7) {
                this.animationFrame = 0;
            }
        }
        this.spriteMap.offset.x = this.animationFrame / 8;
    };
    return Mouse;
}(stage_1.Updateable));
exports.Mouse = Mouse;
