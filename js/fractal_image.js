var FractalImage = function (width, height) {
  this.width = width;
  this.height = height;
  this.colors = [
    new Color(255, 0, 0),
    new Color(0, 255, 0),
    new Color(0, 0, 255),
    new Color(255, 255, 0),
    new Color(0, 255, 255),
    new Color(190, 0, 0),
    new Color(0, 190, 0),
    new Color(0, 0, 190),
    new Color(190, 190, 0),
    new Color(0, 190, 190),
    new Color(127, 0, 0),
    new Color(0, 127, 0),
    new Color(0, 0, 127),
    new Color(127, 127, 0),
    new Color(0, 127, 127),
    new Color(224, 0, 0),
    new Color(0, 224, 0),
    new Color(0, 0, 224),
    new Color(224, 224, 0),
    new Color(0, 224, 224),
    new Color(63, 0, 0),
    new Color(0, 63, 0),
    new Color(0, 0, 63),
    new Color(63, 63, 0),
    new Color(0, 63, 63)
  ];
  this.monochrome = false;

  var c = document.getElementById("render");
  this.ctx = c.getContext("2d");
  this.imgData = this.ctx.createImageData(this.width, this.height);
  this.clear();
  return this;
};

FractalImage.prototype.clear = function () {
  for(var i = 0; i < this.imgData.data.length; i += 4) {
    this.imgData.data[i + 0] = 0;
    this.imgData.data[i + 1] = 0;
    this.imgData.data[i + 2] = 0;
    this.imgData.data[i + 3] = 255;
  }
  this.ctx.putImageData(this.imgData, 0, 0);
};

FractalImage.prototype.setPixel = function (x, y, color) {
  if(x < 0 || y < 0 || x >= this.width || y >= this.height) return;

  y = this.height - y;
  this.imgData.data[(y * this.width + x) * 4 + 0] = color.red;
  this.imgData.data[(y * this.width + x) * 4 + 1] = color.green;
  this.imgData.data[(y * this.width + x) * 4 + 2] = color.blue;
};

FractalImage.prototype.draw = function () {
  this.ctx.putImageData(this.imgData, 0, 0);
};

FractalImage.prototype.render = function (transforms) {
  if(this.thread) clearTimeout(this.thread);
  var self = this;
  this.xMax = 0;
  this.xMin = 99999999;
  this.yMax = 0;
  this.yMin = 99999999;

  this.xs = this.ys = this.xo = this.yo = this.xo2 = this.yo2 = this.sz = 0;

  this.clear();

  this.x1 = 0;
  this.y1 = 0;

  this.d = [];
  this.dSum = 0;

  for(var i = 0; i < transforms.length; i++) {
    var t = transforms[i];
    var di = Math.abs(t.a * t.d - t.c * t.b);
    this.d[i] = (di < 0.02) ? 0.02 : di;
    this.dSum += this.d[i];
  }

  this.buckets = [];
  var lastBucket = 0;
  for(i = 0; i < this.d.length; i++) {
    this.buckets[i] = this.d[i] / this.dSum + lastBucket;
    lastBucket = this.buckets[i];
  }

  function renderPixels() {
    for(var i = 0; i < 1000; i++) {
      var rnd = Math.random();
      var idx;
      for(var j = 0; j < self.buckets.length; j++) {
        idx = j;
        if(rnd < self.buckets[j]) break;
      }

      var tmpX, tmpY;
      tmpX = transforms[idx].a * self.x1 + transforms[idx].b * self.y1 + transforms[idx].e;
      tmpY = transforms[idx].c * self.x1 + transforms[idx].d * self.y1 + transforms[idx].f;
      self.x1 = tmpX;
      self.y1 = tmpY;

      if(self.counter > 5000) {
        //console.log((x1 - xo) * sz, (y1 - yo) * sz);
        if(self.monochrome) {
          self.setPixel(Math.round((self.x1 - self.xo) * self.sz), Math.round((self.y1 - self.yo) * self.sz), new Color(255, 255, 255));
        } else {
          self.setPixel(Math.round((self.x1 - self.xo) * self.sz), Math.round((self.y1 - self.yo) * self.sz), self.colors[idx]);
        }
      } else if(self.counter == 5000) {
        var xs = self.xMax - self.xMin;
        var ys = self.yMax - self.yMin;
        self.xo = self.xMin;
        self.yo = self.yMin;
        self.xo2 = 0;
        self.yo2 = 0;
        if(xs >= ys) {
          self.sz = 500 / xs;
          self.yo2 = (500 - ys * self.sz) / 2
        } else {
          self.sz = 500 / ys;
          self.xo2 = (500 - xs * self.sz) / 2
        }
        console.log(self.xMax, self.xMin, self.yMax, self.yMin, xs, ys, self.sz);
      } else {
        self.xMax = (self.x1 > self.xMax) ? self.x1 : self.xMax;
        self.xMin = (self.x1 < self.xMin) ? self.x1 : self.xMin;
        self.yMax = (self.y1 > self.yMax) ? self.y1 : self.yMax;
        self.yMin = (self.y1 < self.yMin) ? self.y1 : self.yMin;
      }
      self.counter++;
    }

    self.draw();
    if(self.counter < 1000000)
      self.thread = setTimeout(renderPixels, 0);
  }

  this.counter = 0;
  this.thread = setTimeout(renderPixels, 0);
};

FractalImage.prototype.start = function(transforms) {
  this.counter = 0;
  self.render(transforms);
};

FractalImage.prototype.setMonochrome = function (monochrome) {
  this.monochrome = monochrome;
};