"use strict";

const nor_width = gate_width;
const nor_height = gate_height;

const nor_stroke_weight = gate_stroke_weight;
const nor_stroke = gate_stroke;
const nor_fill = gate_fill;
const nor_powered_fill = gate_powered_fill;
const nor_point_radius = connection_point_radius * 0.75;

class NorGate extends Gate {
  constructor(pos) {
    super(pos);
    this.input1_state = false;
    this.input1 = new ConnectionInPoint(this, createVector(nor_width / 2, (nor_height * 0.25)), 
                                        createVector(-(nor_width * 0.75), 0), "input1_state");
    this.input2_state = false;
    this.input2 = new ConnectionInPoint(this, createVector(nor_width / 2, (nor_height * 0.75)), 
                                        createVector(-(nor_width * 0.75), 0), "input2_state");
    this.output1 = new ConnectionOutPoint(this, createVector(nor_width / 2, nor_height / 2), 
                                          createVector(nor_width * 0.75, 0));
    this.connect_points = [this.input1, this.input2, this.output1];
    this.powered = false;
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            (this.pos.x * zoom + camera.x), (this.pos.y * zoom + camera.y), 
                            nor_width * zoom, nor_height * zoom);
  }

  get center_coord() {
    return p5.Vector.add(this.pos, createVector(nor_width / 2, nor_height / 2));
  }
  
  update() {
    super.update();
    
    this.powered = !(this.input1_state || this.input2_state);
    this.output1.powered = this.powered;
  }

  draw(outline) {
    super.draw(outline);
    
    push();

    strokeWeight(nor_stroke_weight);
    stroke(outline == undefined ? nor_stroke : outline);
    fill(this.powered ? nor_powered_fill : nor_fill);

    const tip_sub = (nor_point_radius / 2);
    
    const top_left = this.pos;
    const bottom_left = p5.Vector.add(top_left, createVector(0, nor_height));
    const top_right = p5.Vector.add(top_left, createVector(nor_width, 0));
    const bottom_right = p5.Vector.add(top_left, createVector(nor_width, nor_height));
    const right_center = p5.Vector.add(top_left, createVector(nor_width - tip_sub, nor_height / 2));

    beginShape();
    vertex(top_left.x, top_left.y);
    bezierVertex(top_right.x - (nor_width * 0.75), top_right.y, 
                 top_left.x + (nor_width * 0.75), top_left.y, 
                 right_center.x, right_center.y);
    bezierVertex(right_center.x, right_center.y,
                 top_left.x + (nor_width * 0.75), bottom_right.y,
                 bottom_left.x, bottom_left.y);
    bezierVertex(bottom_left.x, bottom_left.y,
                 top_left.x + (nor_width * 0.25), top_left.y + (nor_height * 0.5),
                 top_left.x, top_left.y);
    endShape();

    circle(right_center.x - tip_sub + (nor_point_radius / 1), right_center.y, nor_point_radius);
    
    pop();
  }
}