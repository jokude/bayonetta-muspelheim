"use strict";

(function () {
  var drawImage = function drawImage(image) {
    var canvas = document.getElementById('surface');
    var fx = new Distortion(canvas, image, 6, 0.4);
    window.setTimeout(function () {
      fx.start();
    }, 300);
  };

  var rotateText = function rotateText(elementNode) {
    var text = elementNode.innerText;
    var textLength = text.length;
    elementNode.innerText = '';

    for (var i = 1; i <= textLength; i += 1) {
      var characterNode = document.createElement('div');
      characterNode.className = "char".concat(i);
      characterNode.innerText = text[i - 1];
      characterNode.style.transform = "rotate(180deg * ".concat(i, ")");
      elementNode.appendChild(characterNode);
    }
  };

  window.onload = function () {
    var innerCircle = document.getElementById('inner-text');
    var outerCircle = document.getElementById('outer-text');
    rotateText(innerCircle);
    rotateText(outerCircle);
    var img = new Image();
    img.addEventListener('load', function () {
      return drawImage(img);
    }, false);
    img.src = './assets/background.jpg';
    var mainCircle = document.getElementById('main-circle');
    mainCircle.style.opacity = 1;
  };
})();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Distortion =
/*#__PURE__*/
function () {
  function Distortion(canvas, image, amplitude, frequency) {
    _classCallCheck(this, Distortion);

    this.context = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.stride = this.width * 4;
    this.pixels = new Array(4 * this.width * this.height);
    this.result = this.context.createImageData(this.width, this.height);
    this.interval = 1000 / 60;
    this.frames = 0;
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.init = this.init.bind(this);
    this.apply = this.apply.bind(this);
    this.init(image);
  }

  _createClass(Distortion, [{
    key: "init",
    value: function init(image) {
      this.context.drawImage(image, 0, 0);
      var source = this.context.getImageData(0, 0, this.width, this.height);
      this.result = this.context.createImageData(this.width, this.height);

      for (var i = 0; i < 4 * this.height * this.width; i += 1) {
        this.pixels[i] = source.data[i];
        this.result.data[i] = 255;
      }
    }
  }, {
    key: "apply",
    value: function apply() {
      var r = this.result.data;
      var T = this.frames * this.interval * this.frequency / 1000;

      for (var x = this.amplitude; x < this.width - this.amplitude; x += 1) {
        for (var y = this.amplitude; y < this.height - this.amplitude; y += 1) {
          var xs = this.amplitude * Math.sin(2 * Math.PI * (3 * y / this.height + T));
          var ys = this.amplitude * Math.cos(2 * Math.PI * (3 * x / this.width + T));
          xs = Math.round(xs);
          ys = Math.round(ys);
          var dest = y * this.stride + x * 4;
          var src = (y + ys) * this.stride + (x + xs) * 4;
          r[dest] = this.pixels[src];
          r[dest + 1] = this.pixels[src + 1];
          r[dest + 2] = this.pixels[src + 2];
        }
      }

      this.context.putImageData(this.result, 0, 0);
      this.frames += 1;
      this.context.getImageData(0, 0, 1, 1);
    }
  }, {
    key: "start",
    value: function start() {
      window.setInterval(this.apply, this.interval);
    }
  }]);

  return Distortion;
}();

