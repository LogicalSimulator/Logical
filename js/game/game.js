"use strict";

const bg_color = 220;
const grid_color = 240;

const grid_size = 20;

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
    // not gate
    this.components.push(new NotGate(createVector(300, 300)));
    // connect not gate to self to test
    this.connections.push(make_connection(this.components[11].output1, this.components[11].input1));
    // and gate
    this.components.push(new AndGate(createVector(300, 400)));
    // switches for and gate
    this.components.push(new Switch(createVector(200, 350)));
    this.components.push(new Switch(createVector(200, 450)));
    // connect switches to and gate
    this.connections.push(make_connection(this.components[13].output1, this.components[12].input1));
    this.connections.push(make_connection(this.components[14].output1, this.components[12].input2));
    // connect and gate to light
    this.components.push(new Light(createVector(400, 300)));
    this.connections.push(make_connection(this.components[12].output1, this.components[15].input1));
    // nand gate
    this.components.push(new NandGate(createVector(500, 300)));
    // switches for nand gate
    this.components.push(new Switch(createVector(500, 400)));
    this.components.push(new Switch(createVector(500, 500)));
    // connect switches to and gate
    this.connections.push(make_connection(this.components[17].output1, this.components[16].input1));
    this.connections.push(make_connection(this.components[18].output1, this.components[16].input2));
    // connect nand gate to lights
    this.components.push(new Light(createVector(600, 300)));
    this.connections.push(make_connection(this.components[16].output1, this.components[19].input1));
    this.components.push(new Light(createVector(650, 300)));
    this.connections.push(make_connection(this.components[16].output1, this.components[20].input1));
    // or gate
    this.components.push(new OrGate(createVector(800, 300)));
    // switches for or gate
    this.components.push(new Switch(createVector(700, 400)));
    this.components.push(new Switch(createVector(700, 500)));
    // connect switches to and gate
    this.connections.push(make_connection(this.components[22].output1, this.components[21].input1));
    this.connections.push(make_connection(this.components[23].output1, this.components[21].input2));
    // conecting multiple gates together
    this.components.push(new AndGate(createVector(400, 500)));
    this.components.push(new OrGate(createVector(500, 600)));
    // connect or gate output to and gate
    this.connections.push(make_connection(this.components[24].output1, this.components[25].input1));
    // 3 switches, 2 for and gate and 1 for the or gate
    this.components.push(new Switch(createVector(300, 700)));
    this.components.push(new Switch(createVector(400, 700)));
    this.components.push(new Switch(createVector(500, 700)));
    // connect switches to or and and gates
    this.connections.push(make_connection(this.components[26].output1, this.components[24].input1));
    this.connections.push(make_connection(this.components[27].output1, this.components[24].input2));
    this.connections.push(make_connection(this.components[28].output1, this.components[25].input2));
    // attach not gate to output
    this.components.push(new NotGate(createVector(600, 600)));
    // connect or gate output to not gate
    this.connections.push(make_connection(this.components[25].output1, this.components[29].input1));
    // light bulb for output
    this.components.push(new Light(createVector(600, 700)));
    this.connections.push(make_connection(this.components[29].output1, this.components[30].input1));
    // nor gate
    this.components.push(new NorGate(createVector(50, 300)));
    // switches for nor gate
    this.components.push(new Switch(createVector(50, 400)));
    this.components.push(new Switch(createVector(50, 500)));
    // connect switches to nor gate
    this.connections.push(make_connection(this.components[32].output1, this.components[31].input1));
    this.connections.push(make_connection(this.components[33].output1, this.components[31].input2));
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
  
  drawGrid(cellSize) {
    push();
    stroke(grid_color);
    for (let y = 0; y < height; y += cellSize) {
      line(0, y, width, y);
    }
    for (let x = 0; x < width; x += cellSize) {
      line(x, 0, x, height);
    }
    pop();
  }

  draw() {
    background(bg_color);
    
    this.drawGrid(grid_size);
    
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
