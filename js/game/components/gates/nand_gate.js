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
    this.size = createVector(nand_width, nand_height);
    this.input1_state = false;
    this.input1 = new ConnectionInPoint(
      this,
      createVector(nand_width / 2, nand_height * 0.25),
      createVector(-(nand_width * 0.75), 0),
      "input1_state"
    );
    this.input2_state = false;
    this.input2 = new ConnectionInPoint(
      this,
      createVector(nand_width / 2, nand_height * 0.75),
      createVector(-(nand_width * 0.75), 0),
      "input2_state"
    );
    this.output1 = new ConnectionOutPoint(
      this,
      createVector(nand_width / 2, nand_height / 2),
      createVector(nand_width * 0.75, 0)
    );
    this.connect_points = [this.input1, this.input2, this.output1];
    this.powered = false;
  }

  update() {
    super.update();

    this.powered = !(this.input1_state && this.input2_state);
    this.output1.powered = this.powered;
  }

  draw(graphics, outline) {
    super.draw(graphics, outline);

    graphics.push();

    graphics.translate(
      this.pos.x + this.size.x / 2,
      this.pos.y + this.size.y / 2
    );
    graphics.rotate(this.angle);
    const nand_pos = createVector(-this.size.x / 2, -this.size.y / 2);

    graphics.strokeWeight(nand_stroke_weight);
    graphics.stroke(outline == undefined ? nand_stroke : outline);
    graphics.fill(this.powered ? nand_powered_fill : nand_fill);

    graphics.rect(nand_pos.x, nand_pos.y, nand_width / 2, nand_height);

    const tip_sub = nand_point_radius / 2;

    graphics.ellipseMode(CORNER);
    graphics.arc(
      nand_pos.x - (nand_stroke_weight + 1),
      nand_pos.y,
      nand_width,
      nand_height,
      -HALF_PI,
      HALF_PI
    );

    graphics.ellipseMode(CENTER);
    const output_point = p5.Vector.add(
      nand_pos,
      createVector(
        nand_width - tip_sub + nand_point_radius / 2,
        nand_height / 2
      )
    );
    graphics.circle(output_point.x, output_point.y, nand_point_radius);

    graphics.pop();
  }
}
