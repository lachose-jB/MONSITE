
// - Noel Delgado | @pixelia_me

const nodes = [].slice.call(document.querySelectorAll('li'), 0);
const directions  = { 0: 'top', 1: 'right', 2: 'bottom', 3: 'left' };
const classNames = ['in', 'out'].map((p) => Object.values(directions).map((d) => `${p}-${d}`)).reduce((a, b) => a.concat(b));

const getDirectionKey = (ev, node) => {
  const { width, height, top, left } = node.getBoundingClientRect();
  const l = ev.pageX - (left + window.pageXOffset);
  const t = ev.pageY - (top + window.pageYOffset);
  const x = (l - (width/2) * (width > height ? (height/width) : 1));
  const y = (t - (height/2) * (height > width ? (width/height) : 1));
  return Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
}

class Item {
  constructor(element) {
    this.element = element;    
    this.element.addEventListener('mouseover', (ev) => this.update(ev, 'in'));
    this.element.addEventListener('mouseout', (ev) => this.update(ev, 'out'));
  }
  
  update(ev, prefix) {
    this.element.classList.remove(...classNames);
    this.element.classList.add(`${prefix}-${directions[getDirectionKey(ev, this.element)]}`);
  }
}

nodes.forEach(node => new Item(node));

//******************************************************************** */
//******************************************************************** */

"use strict";
class Mouse {
    static handleMouseMove(e) {
        if (Mouse.x < e.x) {
            Mouse.directionX = 1;
        }
        else if (Mouse.x > e.x) {
            Mouse.directionX = -1;
        }
        else {
            Mouse.directionX = 0;
        }
        if (Mouse.y < e.y) {
            Mouse.directionY = 1;
        }
        else if (Mouse.y > e.y) {
            Mouse.directionY = -1;
        }
        else {
            Mouse.directionY = 0;
        }
        Mouse.x = e.x;
        Mouse.y = e.y;
    }
    static speed() {
        Mouse.speedX = Mouse.x - Mouse.lastX;
        Mouse.speedY = Mouse.y - Mouse.lastY;
        Mouse.lastX = Mouse.x;
        Mouse.lastY = Mouse.y;
        setTimeout(Mouse.speed, 50);
    }
}
Mouse.x = 0;
Mouse.y = 0;
Mouse.lastX = 0;
Mouse.lastY = 0;
Mouse.directionX = 0;
Mouse.directionY = 0;
Mouse.speedX = 0;
Mouse.speedY = 0;
class Point {
    constructor(x, y, axis, fixed, canvas) {
        this.isAnimating = false;
        this.amplitude = Math.floor(Math.random() * wave.amplitudeRange);
        this.random = Math.floor(Math.random() * wave.randomRange);
        this.time = Date.now();
        this.move = () => {
            if (this.fixed) {
                return;
            }
            this.vx += (this.ix - this.x) / wave.viscosity;
            this.vy += (this.iy - this.y) / wave.viscosity;
            const dx = this.ix - Mouse.x;
            const dy = this.iy - Mouse.y;
            const vGap = MenuApp.vGap;
            const isVerticalAxis = this.axis === "v";
            if ((isVerticalAxis && Mouse.directionX > 0 && Mouse.x > this.x) ||
                (Mouse.directionX < 0 && Mouse.x < this.x)) {
                if (this.axis === "v" &&
                    Math.sqrt(dx * dx) < wave.mouseDist &&
                    Math.sqrt(dy * dy) < vGap) {
                    if (this.axis === "v") {
                        this.vx = Mouse.speedX / 8;
                    }
                    else {
                        this.vx = 0;
                    }
                }
            }
            if (this.axis === "v") {
                this.vx *= 1 - wave.damping;
                this.x += this.vx;
                this.y = this.iy;
            }
        };
        this.x = x;
        this.ix = x;
        this.vx = 0;
        this.y = y;
        this.iy = y;
        this.vy = 0;
        this.cx = 0;
        this.cy = 0;
        this.axis = axis;
        this.fixed = fixed;
        this.canvas = canvas;
    }
}
const wave = {
    viscosity: 340,
    mouseDist: 54,
    damping: 0.1,
    amplitudeRange: 100,
    randomRange: 4,
    randomTransition: 5,
    speed: 0.02
};
class MenuApp {
  constructor() {
      this.random = Math.random() * 1;
      this.ctxDom = document.querySelector("#menu");
      this.ctx = this.ctxDom.getContext("2d");
      this.vPoints = [];
      this.mainColor = "#238CEF";
      this.time = Date.now();
      this.start = false;
      this.initVPoints = () => {
          this.vPoints = [];
          for (let i = 0; i <= MenuApp.vTotalPoints - 1; i++) {
              // const startX = this.ctx.canvas.width * 0.5 + Math.sin(i * MenuApp.vGap + this.time) * 70;
              this.vPoints.push(new Point(this.ctx.canvas.width * 0.5, i * MenuApp.vGap, "v", false, this.ctxDom));
          }
      };
      this.clear = () => {
          this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      };
      this.render = () => {
          // console.log(this.vPoints.length);
          this.clear();
          this.ctx.fillStyle = this.mainColor;
          for (let i = 0; i <= this.vPoints.length - 1; i++) {
              if (TweenMax.ticker.frame % 200 === 0) {
                  TweenMax.to(this.vPoints[i], wave.randomTransition, {
                      random: Math.floor(Math.random() * wave.randomRange),
                      amplitude: Math.floor(Math.random() * wave.amplitudeRange)
                  });
              }
              const waveValue = Math.sin(i + this.time + this.vPoints[i].random) *
                  this.vPoints[i].amplitude;
              const origin = this.ctx.canvas.width * 0.5;
              this.vPoints[i].ix = origin + waveValue;
              // this.vPoints[i].iy = i * MenuApp.vGap;
              this.vPoints[i].move();
          }
          this.ctx.beginPath();
          this.ctx.moveTo(this.ctx.canvas.width * 0.5, 0);
          for (let i = 0; i <= this.vPoints.length - 1; i++) {
              const p = this.vPoints[i];
              if (i < this.vPoints.length - 1) {
                  if (i === 0) {
                      p.y = 0;
                      p.cx = p.x;
                      p.cy = p.y;
                  }
                  else {
                      p.cx = (p.x + this.vPoints[i + 1].x) / 2;
                      p.cy = (p.y + this.vPoints[i + 1].y) / 2;
                  }
              }
              else {
                  p.cx = p.x;
                  p.cy = p.y;
              }
              this.ctx.bezierCurveTo(p.x, p.y, p.cx, p.cy, p.cx, p.cy);
          }
          this.ctx.lineTo(0, this.ctx.canvas.height);
          this.ctx.lineTo(0, 0);
          this.ctx.closePath();
          this.ctx.fill();
          this.time -= wave.speed;
      };
      document.addEventListener("mousemove", Mouse.handleMouseMove);
      document.addEventListener("click", () => {
          if (!this.start) {
              console.log("here I start");
              this.start = true;
          }
      });
      this.ctx.canvas.width = window.innerWidth;
      this.ctx.canvas.height = window.innerHeight;
      this.initVPoints();
      const controller = MenuApp.gui.add(MenuApp, "vTotalPoints", 0, 30);
      controller.onFinishChange((value) => {
          MenuApp.vTotalPoints = Math.floor(value);
          MenuApp.vGap = window.innerHeight / (MenuApp.vTotalPoints - 1);
          this.initVPoints();
      });
      MenuApp.gui.add(wave, "viscosity", 0, 500);
      MenuApp.gui.add(wave, "mouseDist", 0, 500);
      MenuApp.gui.add(wave, "damping", 0, 1);
      MenuApp.gui.add(wave, "amplitudeRange", 1, 201);
      MenuApp.gui.add(wave, "randomRange", 1, 101);
      MenuApp.gui.add(wave, "randomTransition", 0, 10);
      MenuApp.gui.add(wave, "speed", -0.1, 0.1);
      Mouse.speed();
      TweenMax.ticker.addEventListener("tick", this.render);
      // TweenMax.ticker.fps();
      // this.render();
  }
}
MenuApp.gui = new dat.GUI();
MenuApp.vTotalPoints = 15;
MenuApp.vGap = window.innerHeight / (MenuApp.vTotalPoints - 1);
const menu = new MenuApp();
