"use strict";

const or_width = gate_width;
const or_height = gate_height;

const or_stroke_weight = gate_stroke_weight;
const or_stroke = gate_stroke;
const or_fill = gate_fill;
const or_powered_fill = gate_powered_fill;
// const or_point_radius = connection_point_radius * 0.75;

class OrGate extends Gate {
  constructor(pos) {
    super(pos);
    this.input1_state = false;
    this.input1 = new ConnectionInPoint(this, createVector(or_width / 2, (or_height * 0.25)), 
                                        createVector(-(or_width * 0.75), 0), "input1_state");
    this.input2_state = false;
    this.input2 = new ConnectionInPoint(this, createVector(or_width / 2, (or_height * 0.75)), 
                                        createVector(-(or_width * 0.75), 0), "input2_state");
    this.output1 = new ConnectionOutPoint(this, createVector(or_width / 2, or_height / 2), 
                                          createVector(or_width * 0.75, 0));
    this.powered = false;
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            this.pos.x, this.pos.y, 
                            or_width, or_height);
  }

  get center_coord() {
    
    return p5.Vector.add(this.pos, createVector(or_width / 2, or_height / 2));
  }
  
  update() {
    super.update();
    this.input1.update();
    this.input2.update();
    this.output1.update();
    
    this.powered = this.input1_state || this.input2_state;
    this.output1.powered = this.powered;
  }

  draw() {
    this.input1.draw();
    this.input2.draw();
    this.output1.draw();
    
    push();

    strokeWeight(or_stroke_weight);
    stroke(or_stroke);
    fill(this.powered ? or_powered_fill : or_fill);

    const top_left = this.pos;
    const bottom_left = p5.Vector.add(top_left, createVector(0, or_height));
    const top_right = p5.Vector.add(top_left, createVector(or_width, 0));
    const bottom_right = p5.Vector.add(top_left, createVector(or_width, or_height));
    const right_center = p5.Vector.add(top_left, createVector(or_width, or_height / 2));

    beginShape();
    vertex(top_left.x, top_left.y);
    bezierVertex(top_right.x - (or_width * 0.75), top_right.y, 
                 top_left.x + (or_width * 0.75), top_left.y, 
                 right_center.x, right_center.y);
    bezierVertex(right_center.x, right_center.y,
                 top_left.x + (or_width * 0.75), bottom_right.y,
                 bottom_left.x, bottom_left.y);
    bezierVertex(bottom_left.x, bottom_left.y,
                 top_left.x + (or_width * 0.25), top_left.y + (or_height * 0.5),
                 top_left.x, top_left.y);
    endShape();
    
    pop();
  }
}