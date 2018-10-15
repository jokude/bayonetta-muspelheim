class Distortion {
  constructor(canvas, image, amplitude, frequency) {
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

  init(image) {
    this.context.drawImage(image, 0, 0);
    const source = this.context.getImageData(0, 0, this.width, this.height);

    this.result = this.context.createImageData(this.width, this.height);
    for (let i = 0; i < 4 * this.height * this.width; i += 1) {
      this.pixels[i] = source.data[i];
      this.result.data[i] = 255;
    }
  }

  apply() {
    const r = this.result.data;
    const T = (this.frames * this.interval * this.frequency) / 1000;

    for (let x = this.amplitude; x < this.width - this.amplitude; x += 1) {
      for (let y = this.amplitude; y < this.height - this.amplitude; y += 1) {
        let xs = this.amplitude * Math.sin(2 * Math.PI * ((3 * y) / this.height + T));
        let ys = this.amplitude * Math.cos(2 * Math.PI * ((3 * x) / this.width + T));
        xs = Math.round(xs);
        ys = Math.round(ys);
        const dest = y * this.stride + x * 4;
        const src = (y + ys) * this.stride + (x + xs) * 4;
        r[dest] = this.pixels[src];
        r[dest + 1] = this.pixels[src + 1];
        r[dest + 2] = this.pixels[src + 2];
      }
    }

    this.context.putImageData(this.result, 0, 0);
    this.frames += 1;
    this.context.getImageData(0, 0, 1, 1);
  }

  start() {
    window.setInterval(this.apply, this.interval);
  }
}
