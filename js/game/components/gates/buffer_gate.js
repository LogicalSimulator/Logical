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
    this.size = createVector(buffer_width, buffer_height);
    this._delay = 0;
    this._last_state_insert = false;
    this.change_queue = [];
    this._powered = false;
    this.input1_state = false;
    this.input1 = new ConnectionInPoint(
      this,
      createVector(buffer_width / 2, buffer_height / 2),
      createVector(-(buffer_width * 0.75), 0),
      "input1_state"
    );
    this.output1 = new ConnectionOutPoint(
      this,
      createVector(buffer_width / 2, buffer_height / 2),
      createVector(buffer_width * 0.75, 0)
    );
    this.connect_points = [this.input1, this.output1];
    this.powered = false;
  }

  get delay() {
    return this._delay;
  }

  set delay(d) {
    this._delay = Math.max(d, 0);
    this.change_queue.length = 0;
    if (this.delay > 0) {
      this._powered = false;
      this.powered = false;
      this._last_state_insert = false;
    }
  }

  get powered() {
    if (this.delay > 0) {
      const next_change = this.change_queue[0];
      if (next_change != undefined) {
        if (next_change["at"] < millis()) {
          this._powered = next_change["state"];
          this.change_queue.splice(0, 1);
        }
      }
    }
    return this._powered;
  }

  set powered(state) {
    if (this.delay > 0) {
      if (this._last_state_insert != state) {
        this.change_queue.push({
          at: millis() + this.delay,
          state: state,
        });
        this._last_state_insert = state;
      }
    } else {
      this._powered = state;
    }
    // this.output1.powered = state;
  }

  update() {
    super.update();

    this.powered = this.input1_state;
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
    const buffer_pos = createVector(-this.size.x / 2, -this.size.y / 2);

    graphics.strokeWeight(buffer_stroke_weight);
    graphics.stroke(outline == undefined ? buffer_stroke : outline);
    graphics.fill(this.powered ? buffer_powered_fill : buffer_fill);

    const bottom_point = p5.Vector.add(
      buffer_pos,
      createVector(0, buffer_height)
    );
    const right_point = p5.Vector.add(
      buffer_pos,
      createVector(buffer_width, buffer_height / 2)
    );

    graphics.triangle(
      buffer_pos.x,
      buffer_pos.y,
      bottom_point.x,
      bottom_point.y,
      right_point.x,
      right_point.y
    );

    graphics.pop();
  }
}
