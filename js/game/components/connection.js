"use strict";

const connection_stroke_weight = component_stroke_weight;
const connection_stroke = component_stroke;
const connection_powered_stroke = component_powered_fill;

function make_connection(from_point, to_point) {
  const connection = new Connection(from_point, to_point);
  from_point.connect_point = connection;
  return connection;
}

class Connection {
  constructor(from_point, to_point) {
    this.from_point = from_point;
    this.to_point = to_point;
    this._powered = false;
  }

  get powered() {
    return this._powered;
  }

  set powered(state) {
    this._powered = state;
    this.to_point.powered = state;
  }

  update() {
    
  }

  draw() {
    push();

    strokeWeight(connection_stroke_weight);
    stroke(this._powered ? connection_powered_stroke : connection_stroke);

    bezier(this.from_point.point_x, this.from_point.point_y, 
           this.from_point.point_x, this.from_point.point_y, 
           this.to_point.point_x, this.to_point.point_y, 
           this.to_point.point_x, this.to_point.point_y);
    
    pop();
  }
}

const connection_point_stroke_weight = component_stroke_weight;
const connection_point_stroke = component_stroke;
const connection_point_fill = component_fill;
const connection_point_powered_fill = component_powered_fill;
const connection_point_radius = 10;

class ConnectionPoint {
  constructor(parent, center_x, center_y, offset_x, offset_y) {
    this.parent = parent;
    this.center_x = center_x;
    this.center_y = center_y;
    this.offset_x = offset_x;
    this.offset_y = offset_y;
    this.point_x = center_x + offset_x;
    this.point_y = center_y + offset_y;
    this._powered = false;
  }

  get powered() {
    return this._powered;
  }

  set powered(state) {
    this._powered = state;
  }

  update() {
    
  }

  draw() {
    push();

    const from_x = this.center_x;
    const from_y = this.center_y;
    const to_x = this.point_x;
    const to_y = this.point_y;

    strokeWeight(connection_point_stroke_weight);
    stroke(connection_point_stroke);
    line(from_x, from_y, to_x, to_y);

    fill(this._powered ? connection_point_powered_fill : connection_point_fill);
    circle(to_x, to_y, connection_point_radius);
    
    pop();
  }
}

class ConnectionInPoint extends ConnectionPoint {  
  set powered(state) {
    this._powered = state;
    this.parent.powered = state;
  }
}

class ConnectionOutPoint extends ConnectionPoint {
  constructor(parent, center_x, center_y, offset_x, offset_y) {
    super(parent, center_x, center_y, offset_x, offset_y);
    this.connect_point = undefined;
  }

  set powered(state) {
    this._powered = state;
    if (this.connect_point != undefined) {
      this.connect_point.powered = state;
    }
  }
}
