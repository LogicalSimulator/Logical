"use strict";

const bg_color = 220;

const show_mouse_coords = true;

class Game {
  constructor() {
    this.connections = [];
    this.components = [];
    this.items = [this.connections, this.components];

    // testing
    this.components.push(new Switch(createVector(50, 50)));
    this.components.push(new Light(createVector(150, 50)));
    this.connections.push(make_connection(this.components[0].output1, this.components[1].input1));
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
    for (const group of this.items) {
      for (const item of group) {
        item.update();
      }
    }
  }

  draw() {
    background(bg_color);
    
    for (const group of this.items) {
      for (const item of group) {
        item.draw();
      }
    }

    if (show_mouse_coords) {
      push();
      fill(0);
      text(mouseX + ", " + mouseY, mouseX, mouseY);
      pop();
    }
  }
}
