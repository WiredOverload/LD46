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
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(scene, x, y, imageURL, text) {
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        var spriteMap = new THREE.TextureLoader().load(imageURL);
        spriteMap.minFilter = THREE.NearestFilter;
        spriteMap.magFilter = THREE.NearestFilter;
        var spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
        var planeGeo = new three_1.PlaneGeometry(spriteMap.center.width, spriteMap.center.height);
        var plane = new three_1.Mesh(planeGeo, spriteMaterial);
        //spriteMaterial.map.minFilter = THREE.LinearFilter;
        _this.sprite = new three_1.Sprite(spriteMaterial);
        //this.sprite.scale.set(scale.x, scale.y, scale.z);
        var singleMaterial = new three_1.MeshPhongMaterial({ color: 0xFF0000 });
        var singleMesh;
        var loader = new THREE.FontLoader();
        loader.load('assets/helvetiker_regular.typeface.json', function (font) {
            var textGeometry = new THREE.TextGeometry(text, {
                font: font,
                size: 80
            });
            var textMaterial = new three_1.MeshPhongMaterial({ color: 0xFF0000, specular: 0xffffff }); //new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
            var textMesh = new three_1.Mesh(textGeometry, textMaterial);
            // var newGeo:Geometry = new Geometry();
            // textMesh.updateMatrix();
            // newGeo.merge(textGeometry, textMesh.matrix);
            // plane.updateMatrix();
            // newGeo.merge(planeGeo, plane.matrix);
            // singleMesh = new Mesh(newGeo, singleMaterial);
            //scene.add(singleMesh);
            scene.add(textMesh);
            var dirLight = new THREE.DirectionalLight(0xffffff, 0.125);
            dirLight.position.set(0, 0, 1).normalize();
            scene.add(dirLight);
        });
        _this.sprite.position.set(x, y, 0);
        return _this;
        //scene.add(this.sprite);
        //scene.add(singleMesh);
    }
    Button.prototype.render = function () {
    };
    Button.prototype.update = function () {
        this.sprite.position.set(this.x, this.y, 0);
    };
    Button.prototype.click = function () {
    };
    return Button;
}(stage_1.Updateable));
exports.Button = Button;
