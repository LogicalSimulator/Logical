"use strict";

const nand_width = gate_width;
const nand_height = gate_height;

const nand_stroke_weight = gate_stroke_weight;
const nand_stroke = gate_stroke;
const nand_fill = gate_fill;
const nand_powered_fill = gate_powered_fill;
const nand_point_radius = connection_point_radius * 0.75;

class NandGate extends Gate {
  constructor(pos) {
    super(pos);
    this.input1_state = false;
    this.input1 = new ConnectionInPoint(this, createVector(nand_width / 2, (nand_height * 0.25)), 
                                        createVector(-(nand_width * 0.75), 0), "input1_state");
    this.input2_state = false;
    this.input2 = new ConnectionInPoint(this, createVector(nand_width / 2, (nand_height * 0.75)), 
                                        createVector(-(nand_width * 0.75), 0), "input2_state");
    this.output1 = new ConnectionOutPoint(this, createVector(nand_width / 2, nand_height / 2), 
                                          createVector(nand_width * 0.75, 0));
    this.connect_points = [this.input1, this.input2, this.output1];
    this.powered = false;
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            (this.pos.x * zoom + camera.x), (this.pos.y * zoom + camera.y), 
                            nand_width * zoom, nand_height * zoom);
  }

  get center_coord() {
    return p5.Vector.add(this.pos, createVector(nand_width / 2, nand_height / 2));
  }
  
  update() {
    super.update();
    
    this.powered = !(this.input1_state && this.input2_state);
    this.output1.powered = this.powered;
  }

  draw(outline) {
    super.draw(outline);
    
    push();

    strokeWeight(nand_stroke_weight);
    stroke(outline == undefined ? nand_stroke : outline);
    fill(this.powered ? nand_powered_fill : nand_fill);

    rect(this.pos.x, this.pos.y, nand_width / 2, nand_height);

    const tip_sub = (nand_point_radius / 2);
    
    ellipseMode(CORNER);
    arc(this.pos.x - (nand_stroke_weight + 1), this.pos.y, 
        nand_width, nand_height, 
        -HALF_PI, HALF_PI);

    ellipseMode(CENTER)
    const output_point = p5.Vector.add(this.pos, createVector(nand_width - tip_sub + (nand_point_radius / 2), nand_height / 2));
    circle(output_point.x, output_point.y, nand_point_radius);
    
    pop();
  }
}