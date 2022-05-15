"use strict";

const product = "Logical";
const version = 1;

p5.disableFriendlyErrors = true;

const window_diff = 20;

const desired_fps = 60;
let last_fps_time = 0;
let last_fps = 0;

let game;

function preload() {
  preload_sounds();
}

function setup() {
  createCanvas(windowWidth - window_diff, windowHeight - window_diff);
  frameRate(desired_fps);
  
  make_vertical = width > height * 2;
  preload_icons();  // generates images so can't be in preload
  
  game = new Game();
}

function draw() {
  push();
  game.update();
  game.draw();
  pop();
  
  if (millis() - last_fps_time > 1000) {
    last_fps_time = millis();
    last_fps = Math.round(frameRate());
  }
  push();
  strokeWeight(0);
  textAlign(RIGHT, BOTTOM);
  textSize(12);
  fill(0);
  text("FPS: " + last_fps, width - 10, height - 10);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth - window_diff, windowHeight - window_diff);
  if (game == undefined) {
    return;
  }
  game.on_resize();
}

function mousePressed() {
  if (game == undefined) {
    return;
  }
  return game.on_mouse_press();
}

function mouseClicked() {
  if (game == undefined) {
    return;
  }
  return game.mouse_clicked();
}

function mouseDragged() {
  if (game == undefined) {
    return;
  }
  return game.on_mouse_drag();
}

function mouseReleased() {
  if (game == undefined) {
    return;
  }
  return game.on_mouse_release();
}

function mouseWheel(event) {
  if (game == undefined) {
    return;
  }
  return game.on_mouse_wheel(event);
}

function keyPressed() {
  if (game == undefined) {
    return;
  }
  return game.key_pressed(keyCode);
}
