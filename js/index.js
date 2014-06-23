var saves = [
  {
    name: "Five",
    transforms: [
      {
        a: 0.4,
        b: 0,
        c: 0,
        d: 0.4,
        e: 0,
        f: 0
      },
      {
        a: 0.4,
        b: 0,
        c: 0,
        d: 0.4,
        e: 3,
        f: 0
      },
      {
        a: 0.4,
        b: 0,
        c: 0,
        d: 0.4,
        e: 0,
        f: 3
      },
      {
        a: 0.4,
        b: 0,
        c: 0,
        d: 0.4,
        e: 3,
        f: 3
      },
      {
        a: 0.4,
        b: 0,
        c: 0,
        d: 0.4,
        e: 1.5,
        f: 1.5
      }
    ]
  },
  {
    name: "Sierpensky"
  }
];

var transforms = saves[0].transforms;

var Color = function (red, green, blue) {
  this.red = red;
  this.green = green;
  this.blue = blue;
  return this;
};

var FractalImage = function (width, height) {
  this.width = width;
  this.height = height;
  this.colors = [
    new Color(255, 0, 0),
    new Color(0, 255, 0),
    new Color(0, 0, 255),
    new Color(255, 255, 0),
    new Color(0, 255, 255)
  ];

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
  this.imgData.data[(y * this.width + x) * 4 + 0] = color.red;
  this.imgData.data[(y * this.width + x) * 4 + 1] = color.green;
  this.imgData.data[(y * this.width + x) * 4 + 2] = color.blue;
};

FractalImage.prototype.draw = function () {
  this.ctx.putImageData(this.imgData, 0, 0);
};

FractalImage.prototype.render = function (transforms) {
  var self = this;
  this.xMax = 0;
  this.xMin = 99999999;
  this.yMax = 0;
  this.yMin = 99999999;

  this.xs = this.ys = this.xo = this.yo = this.xo2 = this.yo2 = this.sz = 0;

  this.clear();

  //var it = tonumber(boxTab[73].val)
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
  console.log(this.d);
  console.log(this.buckets);

  function renderPixels() {
    for(var i = 0; i < 100; i++) {
      var rnd = Math.random();
      var idx;
      for(var j = 0; j < self.buckets.length; j++) {
        idx = j;
        if(rnd < self.buckets[j]) break;
      }

      self.x1 = transforms[idx].a * self.x1 + transforms[idx].b * self.y1 + transforms[idx].e;
      self.y1 = transforms[idx].c * self.x1 + transforms[idx].d * self.y1 + transforms[idx].f;
      if(self.counter > 5000) {
        //console.log((x1 - xo) * sz, (y1 - yo) * sz);
        self.setPixel(Math.round((self.x1 - self.xo) * self.sz), Math.round((self.y1 - self.yo) * self.sz), self.colors[idx]);
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
      setTimeout(renderPixels, 0);
  }

  this.counter = 0;
  setTimeout(renderPixels, 0);
};

FractalImage.prototype.start = function(transforms) {
  this.counter = 0;
  self.render(transforms);
};

var fractal = new FractalImage(500, 500);
//fractal.setPixel(0,0,green);
//fractal.setPixel(1,1,green);
//fractal.setPixel(2,2,green);
//fractal.setPixel(3,3,green);
//fractal.setPixel(4,4,green);
setTimeout(function () {
  fractal.render(transforms);
}, 1000);
