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
    this.components.push(new Light(createVector(200, 50)));
    this.components.push(new Switch(createVector(50, 150)));
    this.components.push(new Light(createVector(300, 100)));
    // connect one switch to multiple lights
    this.connections.push(make_connection(this.components[0].output1, this.components[1].input1));
    this.connections.push(make_connection(this.components[0].output1, this.components[2].input1));
    // connect one switch to another light
    this.connections.push(make_connection(this.components[3].output1, this.components[4].input1));
    // connect a switch to a light, changing it's connection
    this.connections.push(make_connection(this.components[3].output1, this.components[2].input1));
  }

  on_resize() {

  }

  on_mouse_drag() {
    // return false;
  }

  on_mouse_wheel(event) {
    // return false;
  }

  on_mouse_press() {
    // return false;
  }

  on_key_press() {
    // return false;
  }
  
  update() {
    for (const i in this.items) {
      const group = this.items[i];
      for (const index in group) {
        const item = group[index];
        if (item.destroy_me != undefined && item.destroy_me) {
          group[index] = undefined;
          continue;
        }
        item.update();
      }
      this.items[i] = group;
      this.items[i] = this.items[i].filter((element) => {
        return element != undefined;
      });
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
