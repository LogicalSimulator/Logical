"use strict";

const xor_width = gate_width;
const xor_height = gate_height;

const xor_stroke_weight = gate_stroke_weight;
const xor_stroke = gate_stroke;
const xor_fill = gate_fill;
const xor_powered_fill = gate_powered_fill;
// const xor_point_radius = connection_point_radius * 0.75;
const xor_line_sub = xor_width * 0.1;

class XorGate extends Gate {
  constructor(pos) {
    super(pos);
    this.input1_state = false;
    this.input1 = new ConnectionInPoint(this, createVector(xor_width / 2, (xor_height * 0.25)), 
                                        createVector(-(xor_width * 0.75), 0), "input1_state");
    this.input2_state = false;
    this.input2 = new ConnectionInPoint(this, createVector(xor_width / 2, (xor_height * 0.75)), 
                                        createVector(-(xor_width * 0.75), 0), "input2_state");
    this.output1 = new ConnectionOutPoint(this, createVector(xor_width / 2, xor_height / 2), 
                                          createVector(xor_width * 0.75, 0));
    this.powered = false;
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            this.pos.x + camera.x, this.pos.y + camera.y, 
                            xor_width, xor_height);
  }

  get center_coord() {
    return p5.Vector.add(this.pos, createVector(xor_width / 2, xor_height / 2));
  }
  
  update() {
    super.update();
    this.input1.update();
    this.input2.update();
    this.output1.update();
    
    this.powered = this.input1_state !== this.input2_state;
    this.output1.powered = this.powered;
  }

  draw() {
    this.input1.draw();
    this.input2.draw();
    this.output1.draw();
    
    push();

    strokeWeight(xor_stroke_weight);
    stroke(xor_stroke);
    fill(this.powered ? xor_powered_fill : xor_fill);
    
    const top_left = this.pos;
    const bottom_left = p5.Vector.add(top_left, createVector(0, xor_height));
    const top_right = p5.Vector.add(top_left, createVector(xor_width, 0));
    const bottom_right = p5.Vector.add(top_left, createVector(xor_width, xor_height));
    const right_center = p5.Vector.add(top_left, createVector(xor_width, xor_height / 2));

    beginShape();
    vertex(top_left.x, top_left.y);
    bezierVertex(top_right.x - (xor_width * 0.75), top_right.y, 
                 top_left.x + (xor_width * 0.75), top_left.y, 
                 right_center.x, right_center.y);
    bezierVertex(right_center.x, right_center.y,
                 top_left.x + (xor_width * 0.75), bottom_right.y,
                 bottom_left.x, bottom_left.y);
    bezierVertex(bottom_left.x, bottom_left.y,
                 top_left.x + (xor_width * 0.25), top_left.y + (xor_height * 0.5),
                 top_left.x, top_left.y);
    endShape();

    noFill();
    beginShape();
    vertex(top_left.x - xor_line_sub, top_left.y);
    bezierVertex(top_left.x - xor_line_sub, top_left.y,
                 top_left.x - xor_line_sub + (xor_width * 0.25), top_left.y + (xor_height * 0.5), 
                 bottom_left.x - xor_line_sub, bottom_left.y);
    endShape();
    
    pop();
  }
}