class Circle {
  constructor(radius, offset, color) {
    this.r = radius;
    this.inici = true;
    this.offset = offset;
    this.color = color;
    this.i = 1;
  }

  show() {
    stroke(this.color);
    let val = this.i + this.offset;
    if (this.inici) {
      arc(0, 0, this.r, this.r, val, 0, OPEN);
    } else {
      arc(0, 0, this.r, this.r, 0, val, OPEN);
    }
  }

  update() {
    this.i += increment;
    if (this.i + this.offset >= 360) {
      this.inici = !this.inici;
      this.i = 1 - this.offset;
    }
  }
  
  // Setters that only exist because the sliders need to update in real time
  setRadius(val) {
    this.r = val;
  }
  
  setColor(val) {
    this.color = val;
  }
  
}