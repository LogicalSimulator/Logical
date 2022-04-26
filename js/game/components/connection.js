"use strict";

class Connection {
  constructor() {
    
  }

  update() {
    
  }

  draw() {
    
  }
}

const connection_point_stroke_weight = component_stroke_weight;
const connection_point_stroke = component_stroke;
const connection_point_fill = component_fill;
const connection_point_powered_fill = component_powered_fill;
const connection_point_radius = 10;

class ConnectionPoint {
  constructor(parent, offset_x, offset_y) {
    this.parent = parent;
    this.offset_x = offset_x;
    this.offset_y = offset_y;
    this.powered = false;
  }

  update() {
    
  }

  draw() {
    push();

    const from_x = this.parent.x + (component_width / 2);
    const from_y = this.parent.y + (component_height / 2);
    const to_x = from_x + this.offset_x;
    const to_y = from_y + this.offset_y;

    strokeWeight(connection_point_stroke_weight);
    stroke(connection_point_stroke);
    line(from_x, from_y, to_x, to_y);

    fill(this.powered ? connection_point_powered_fill : connection_point_fill);
    circle(to_x, to_y, connection_point_radius);
    
    pop();
  }
}
