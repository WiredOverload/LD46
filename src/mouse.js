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
    function Mouse(scene, maxAnisotropy) {
        var _this = _super.call(this) || this;
        _this.x = 0;
        _this.y = 5;
        var spriteMap = new THREE.TextureLoader().load("assets/magnet.png");
        var field = new THREE.TextureLoader().load("assets/magneticField.png");
        field.anisotropy = maxAnisotropy;
        spriteMap.anisotropy = maxAnisotropy; //renderer.capabilities.getMaxAnisotropy()
        // spriteMap.minFilter = THREE.NearestFilter;
        // spriteMap.magFilter = THREE.NearestFilter;
        var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
        var spriteFieldMaterial = new THREE.SpriteMaterial({ map: field, color: 0xffffff });
        //spriteMaterial.map.minFilter = THREE.LinearFilter;
        _this.sprite = new three_1.Sprite(spriteMaterial);
        _this.sprite.scale.set(1 / 8, 1 / 8, 1 / 8);
        _this.sprite.position.set(_this.x, _this.y, 0);
        scene.add(_this.sprite);
        _this.spriteHalo = new three_1.Sprite(spriteFieldMaterial);
        _this.sprite.scale.set(1 / 8, 1 / 8, 1 / 8);
        _this.sprite.position.set(0, 10, 0); //above screen
        return _this;
        //scene.add(this.sprite);
    }
    Mouse.prototype.render = function (scene) {
        if (this.isClickedDown) {
            scene.add(this.spriteHalo);
        }
        if (this.isClickedUp) {
            scene.remove(this.spriteHalo);
        }
    };
    Mouse.prototype.update = function () {
        this.sprite.position.set(this.x, this.y, 0);
        this.spriteHalo.position.set(this.x, this.y, 0);
    };
    return Mouse;
}(stage_1.Updateable));
exports.Mouse = Mouse;
