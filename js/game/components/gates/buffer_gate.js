"use strict";

const buffer_width = gate_width;
const buffer_height = gate_height;

const buffer_stroke_weight = gate_stroke_weight;
const buffer_stroke = gate_stroke;
const buffer_fill = gate_fill;
const buffer_powered_fill = gate_powered_fill;

class BufferGate extends Gate {
  constructor(pos) {
    super(pos);
    this.input1_state = false;
    this.input1 = new ConnectionInPoint(this, createVector(buffer_width / 2, buffer_height / 2), 
                                        createVector(-(buffer_width * 0.75), 0), "input1_state");
    this.output1 = new ConnectionOutPoint(this, createVector(buffer_width / 2, buffer_height / 2), 
                                          createVector(buffer_width * 0.75, 0));
    this.powered = false;
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            this.pos.x + camera.x, this.pos.y + camera.y, 
                            buffer_width, buffer_height);
  }

  get center_coord() {
    return p5.Vector.add(this.pos, createVector(buffer_width / 2, buffer_height / 2));
  }
  
  update() {
    super.update();
    this.input1.update();
    this.output1.update();
    
    this.powered = this.input1_state
    this.output1.powered = this.powered;
  }

  draw(outline) {
    this.input1.draw();
    this.output1.draw();
    
    push();

    strokeWeight(buffer_stroke_weight);
    stroke(outline == undefined ? buffer_stroke : outline);
    fill(this.powered ? buffer_powered_fill : buffer_fill);

    const bottom_point = p5.Vector.add(this.pos, createVector(0, buffer_height));
    const right_point = p5.Vector.add(this.pos, createVector(buffer_width, buffer_height / 2));
    
    triangle(this.pos.x, this.pos.y,
             bottom_point.x, bottom_point.y,
             right_point.x, right_point.y);
    
    pop();
  }
}