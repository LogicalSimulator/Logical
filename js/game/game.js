"use strict";

const bg_color = 220;

const show_mouse_coords = true;

class Game {
  constructor() {
    this.items = [
      new Switch(50, 50)
    ];
  }

  on_resize() {

  }

  on_mouse_drag() {
    return false;
  }

  on_mouse_wheel(event) {
    return false;
  }

  on_mouse_press() {
    return false;
  }

  on_key_press() {
    return false;
  }
  
  update() {
    for (const item of this.items) {
      item.update();
    }
  }

  draw() {
    background(bg_color);
    
    for (const item of this.items) {
      item.draw();
    }

    if (show_mouse_coords) {
      push();
      fill(0);
      text(mouseX + ", " + mouseY, mouseX, mouseY);
      pop();
    }
  }
}
