"use strict";

const xnor_width = gate_width;
const xnor_height = gate_height;

const xnor_stroke_weight = gate_stroke_weight;
const xnor_stroke = gate_stroke;
const xnor_fill = gate_fill;
const xnor_powered_fill = gate_powered_fill;
const xnor_point_radius = connection_point_radius * 0.75;
const xnor_line_sub = xnor_width * 0.1;

class XnorGate extends Gate {
  constructor(pos) {
    super(pos);
    this.input1_state = false;
    this.input1 = new ConnectionInPoint(this, createVector(xnor_width / 2, (xnor_height * 0.25)), 
                                        createVector(-(xnor_width * 0.75), 0), "input1_state");
    this.input2_state = false;
    this.input2 = new ConnectionInPoint(this, createVector(xnor_width / 2, (xnor_height * 0.75)), 
                                        createVector(-(xnor_width * 0.75), 0), "input2_state");
    this.output1 = new ConnectionOutPoint(this, createVector(xnor_width / 2, xnor_height / 2), 
                                          createVector(xnor_width * 0.75, 0));
    this.powered = false;
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            (this.pos.x * zoom + camera.x), (this.pos.y * zoom + camera.y), 
                            xnor_width * zoom, xnor_height * zoom);
  }

  get center_coord() {
    return p5.Vector.add(this.pos, createVector(xnor_width / 2, xnor_height / 2));
  }
  
  update() {
    super.update();
    this.input1.update();
    this.input2.update();
    this.output1.update();
    
    this.powered = this.input1_state === this.input2_state;
    this.output1.powered = this.powered;
  }

  draw(outline) {
    this.input1.draw();
    this.input2.draw();
    this.output1.draw();
    
    push();

    strokeWeight(xnor_stroke_weight);
    stroke(outline == undefined ? xnor_stroke : outline);
    fill(this.powered ? xnor_powered_fill : xnor_fill);

    const tip_sub = (xnor_point_radius / 2);
    
    const top_left = this.pos;
    const bottom_left = p5.Vector.add(top_left, createVector(0, xnor_height));
    const top_right = p5.Vector.add(top_left, createVector(xnor_width, 0));
    const bottom_right = p5.Vector.add(top_left, createVector(xnor_width, xnor_height));
    const right_center = p5.Vector.add(top_left, createVector(xnor_width - tip_sub, xnor_height / 2));

    beginShape();
    vertex(top_left.x, top_left.y);
    bezierVertex(top_right.x - (xnor_width * 0.75), top_right.y, 
                 top_left.x + (xnor_width * 0.75), top_left.y, 
                 right_center.x, right_center.y);
    bezierVertex(right_center.x, right_center.y,
                 top_left.x + (xnor_width * 0.75), bottom_right.y,
                 bottom_left.x, bottom_left.y);
    bezierVertex(bottom_left.x, bottom_left.y,
                 top_left.x + (xnor_width * 0.25), top_left.y + (xnor_height * 0.5),
                 top_left.x, top_left.y);
    endShape();

    noFill();
    beginShape();
    vertex(top_left.x - xnor_line_sub, top_left.y);
    bezierVertex(top_left.x - xnor_line_sub, top_left.y,
                 top_left.x - xnor_line_sub + (xnor_width * 0.25), top_left.y + (xnor_height * 0.5), 
                 bottom_left.x - xnor_line_sub, bottom_left.y);
    endShape();

    fill(this.powered ? xnor_powered_fill : xnor_fill);
    circle(right_center.x - tip_sub + (nor_point_radius / 1), right_center.y, xnor_point_radius);
    
    pop();
  }
}