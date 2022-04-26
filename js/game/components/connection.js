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

    bezier(this.from_point.pos.x, this.from_point.pos.y,
           this.from_point.pos.x, this.from_point.pos.y,
           this.to_point.pos.x, this.to_point.pos.y, 
           this.to_point.pos.x, this.to_point.pos.y);
    
    pop();
  }
}

const connection_point_stroke_weight = component_stroke_weight;
const connection_point_stroke = component_stroke;
const connection_point_fill = component_fill;
const connection_point_powered_fill = component_powered_fill;
const connection_point_radius = 10;

class ConnectionPoint {
  constructor(parent, offset) {
    this.parent = parent;
    this.offset = offset;
    this.pos = p5.Vector.add(this.parent.center_coord, this.offset);
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

    const from_vec = this.parent.center_coord;
    this.pos = p5.Vector.add(this.parent.center_coord, this.offset);
    
    strokeWeight(connection_point_stroke_weight);
    stroke(connection_point_stroke);
    line(from_vec.x, from_vec.y, this.pos.x, this.pos.y);

    fill(this._powered ? connection_point_powered_fill : connection_point_fill);
    circle(this.pos.x, this.pos.y, connection_point_radius);
    
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
  constructor(parent, offset) {
    super(parent, offset);
    this.connect_point = undefined;
  }

  set powered(state) {
    this._powered = state;
    if (this.connect_point != undefined) {
      this.connect_point.powered = state;
    }
  }
}
