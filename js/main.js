"use strict";

p5.disableFriendlyErrors = true;

const window_diff = 20;

const desired_fps = 60;
let last_fps_time = 0;
let last_fps = 0;

let game;

function setup() {
  createCanvas(windowWidth - window_diff, windowHeight - window_diff);
  frameRate(desired_fps);
  game = new Game();
}

function draw() {
  game.update();
  game.draw();
  
  if (millis() - last_fps_time > 1000) {
    last_fps_time = millis();
    last_fps = Math.round(frameRate());
  }
  push();
  strokeWeight(0);
  textAlign(LEFT, BOTTOM);
  textSize(12 / zoom);
  fill(0);
  text("FPS: " + last_fps, (10 - camera.x) / zoom, (height - 10 - camera.y) / zoom);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth - window_diff, windowHeight - window_diff);
  game.on_resize();
}

function mouseDragged() {
  return game.on_mouse_drag();
}

function mouseWheel(event) {
  return game.on_mouse_wheel(event);
}

function mousePressed() {
  return game.on_mouse_press();
}

function keyPressed() {
  return game.on_key_press();
}
