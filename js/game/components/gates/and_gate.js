"use strict";

const and_width = gate_width;
const and_height = gate_height;

const and_stroke_weight = gate_stroke_weight;
const and_stroke = gate_stroke;
const and_fill = gate_fill;
const and_powered_fill = gate_powered_fill;
// const and_point_radius = connection_point_radius * 0.75;

class AndGate extends Gate {
  constructor(pos) {
    super(pos);
    this.input1_state = false;
    this.input1 = new ConnectionInPoint(this, createVector(and_width / 2, (and_height * 0.25)), 
                                        createVector(-(and_width * 0.75), 0), "input1_state");
    this.input2_state = false;
    this.input2 = new ConnectionInPoint(this, createVector(and_width / 2, (and_height * 0.75)), 
                                        createVector(-(and_width * 0.75), 0), "input2_state");
    this.output1 = new ConnectionOutPoint(this, createVector(and_width / 2, and_height / 2), 
                                          createVector(and_width * 0.75, 0));
    this.powered = false;
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            this.pos.x, this.pos.y, 
                            and_width, and_height);
  }

  get center_coord() {
    return p5.Vector.add(this.pos, createVector(and_width / 2, and_height / 2));
  }
  
  update() {
    super.update();
    this.input1.update();
    this.input2.update();
    this.output1.update();
    
    this.powered = this.input1_state && this.input2_state;
    this.output1.powered = this.powered;
  }

  draw() {
    this.input1.draw();
    this.input2.draw();
    this.output1.draw();
    
    push();

    strokeWeight(and_stroke_weight);
    stroke(and_stroke);
    fill(this.powered ? and_powered_fill : and_fill);

    rect(this.pos.x, this.pos.y, and_width / 2, and_height);
    
    ellipseMode(CORNERS);
    arc(this.pos.x - (and_stroke_weight + 1), this.pos.y, 
        this.pos.x + and_width, this.pos.y + and_height, 
        -HALF_PI, HALF_PI);
    
    pop();
  }
}