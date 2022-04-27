"use strict";

const bg_color = 220;

const show_mouse_coords = true;

class Game {
  constructor() {
    this.connections = [];
    this.components = [];
    this.items = [this.connections, this.components];

    // testing
    console.log("creating test objects");
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
    // buffer gate
    this.components.push(new BufferGate(createVector(400, 50)));
    // switch to buffer gate
    this.components.push(new Switch(createVector(400, 200)));
    // connect switch to buffer
    this.connections.push(make_connection(this.components[6].output1, this.components[5].input1));
    // light bulb from buffer gate
    this.components.push(new Light(createVector(600, 50)));
    this.connections.push(make_connection(this.components[5].output1, this.components[7].input1));
    // light bulb from buffer gate
    this.components.push(new Light(createVector(700, 50)));
    this.connections.push(make_connection(this.components[5].output1, this.components[8].input1));
    // not gate
    this.components.push(new NotGate(createVector(500, 200)));
    // connection from switch to not gate
    this.connections.push(make_connection(this.components[6].output1, this.components[9].input1));
    // light bulb from not gate
    this.components.push(new Light(createVector(600, 200)));
    this.connections.push(make_connection(this.components[9].output1, this.components[10].input1));
    console.log("done with test objects");
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
