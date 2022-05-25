"use strict";

const not_width = gate_width;
const not_height = gate_height;

const not_stroke_weight = gate_stroke_weight;
const not_stroke = gate_stroke;
const not_fill = gate_fill;
const not_powered_fill = gate_powered_fill;
const not_point_radius = connection_point_radius * 0.75;

class NotGate extends Gate {
  constructor(pos) {
    super(pos);
    this.size = createVector(not_width, not_height);
    this.input1_state = false;
    this.input1 = new ConnectionInPoint(
      this,
      createVector(not_width / 2, not_height / 2),
      createVector(-(not_width * 0.75), 0),
      "input1_state"
    );
    this.output1 = new ConnectionOutPoint(
      this,
      createVector(not_width / 2, not_height / 2),
      createVector(not_width * 0.75, 0)
    );
    this.connect_points = [this.input1, this.output1];
    this.powered = false;
  }

  update() {
    super.update();

    this.powered = !this.input1_state;
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
    const not_pos = createVector(-this.size.x / 2, -this.size.y / 2);

    graphics.strokeWeight(buffer_stroke_weight);
    graphics.stroke(outline == undefined ? buffer_stroke : outline);
    graphics.fill(this.powered ? buffer_powered_fill : buffer_fill);

    const bottom_point = p5.Vector.add(not_pos, createVector(0, buffer_height));
    const right_point = p5.Vector.add(
      not_pos,
      createVector(buffer_width, buffer_height / 2)
    );

    graphics.triangle(
      not_pos.x,
      not_pos.y,
      bottom_point.x,
      bottom_point.y,
      right_point.x,
      right_point.y
    );

    graphics.circle(right_point.x, right_point.y, not_point_radius);

    graphics.pop();
  }
}
