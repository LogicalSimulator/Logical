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
    this.size = createVector(and_width, and_height);
    this.input1_state = false;
    this.input1 = new ConnectionInPoint(this, createVector(and_width / 2, (and_height * 0.25)), 
                                        createVector(-(and_width * 0.75), 0), "input1_state");
    this.input2_state = false;
    this.input2 = new ConnectionInPoint(this, createVector(and_width / 2, (and_height * 0.75)), 
                                        createVector(-(and_width * 0.75), 0), "input2_state");
    this.output1 = new ConnectionOutPoint(this, createVector(and_width / 2, and_height / 2), 
                                          createVector(and_width * 0.75, 0));
    this.connect_points = [this.input1, this.input2, this.output1];
    this.powered = false;
  }
  
  update() {
    super.update();
    
    this.powered = this.input1_state && this.input2_state;
    this.output1.powered = this.powered;
  }

  draw(graphics, outline) {
    super.draw(graphics, outline);
    
    graphics.push();
    
    graphics.strokeWeight(and_stroke_weight);
    graphics.stroke(outline == undefined ? and_stroke : outline);
    graphics.fill(this.powered ? and_powered_fill : and_fill);

    graphics.rect(this.pos.x, this.pos.y, and_width / 2, and_height);
    
    graphics.ellipseMode(CORNER);
    graphics.arc(this.pos.x - (and_stroke_weight + 1), this.pos.y, 
                 and_width, and_height, 
                 -HALF_PI, HALF_PI);
    
    graphics.pop();
  }
}