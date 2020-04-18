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
var StaticImage = /** @class */ (function (_super) {
    __extends(StaticImage, _super);
    function StaticImage(scene, x, y, imageURL, scale) {
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        var spriteMap = new THREE.TextureLoader().load(imageURL);
        spriteMap.minFilter = THREE.NearestFilter;
        spriteMap.magFilter = THREE.NearestFilter;
        var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
        //spriteMaterial.map.minFilter = THREE.LinearFilter;
        _this.sprite = new three_1.Sprite(spriteMaterial);
        _this.sprite.scale.set(scale.x, scale.y, scale.z);
        _this.sprite.position.set(x, y, 0);
        scene.add(_this.sprite);
        return _this;
    }
    StaticImage.prototype.render = function () {
    };
    StaticImage.prototype.update = function () {
        this.sprite.position.set(this.x, this.y, 0);
    };
    return StaticImage;
}(stage_1.Updateable));
exports.StaticImage = StaticImage;
