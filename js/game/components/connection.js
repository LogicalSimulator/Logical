"use strict";

const connection_stroke_weight = component_stroke_weight;
const connection_stroke = component_stroke;
const connection_powered_stroke = component_powered_fill;

function make_connection(from_point, to_point) {
  if (to_point.connection != undefined) {
    // console.log("creating connection to already used input");
    // console.log(to_point.connection.from_point.connections.length);
    for (const index in to_point.connection.from_point.connections) {
      const conn = to_point.connection.from_point.connections[index];
      if (conn.to_point === to_point) {
        // console.log("destroying connection at index " + index);
        to_point.connection.from_point.connections[index].destroy_me = true;
        to_point.connection.from_point.connections[index] = undefined;
      }
    }
    // console.log(to_point.connection.from_point);
  }
  const connection = new Connection(from_point, to_point);
  from_point.connections.push(connection);
  to_point.connection = connection;
  return connection;
}

class Connection {
  constructor(from_point, to_point) {
    this.from_point = from_point;
    this.to_point = to_point;
    this.destroy_me = false;
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

    const from_point_offset = p5.Vector.add(this.from_point.pos, this.from_point.offset);
    const to_point_offset = p5.Vector.add(this.to_point.pos, this.to_point.offset);
    
    strokeWeight(connection_stroke_weight);
    stroke(this._powered ? connection_powered_stroke : connection_stroke);
    noFill();
    
    bezier(this.from_point.pos.x, this.from_point.pos.y,
           from_point_offset.x, from_point_offset.y,
           to_point_offset.x, to_point_offset.y,
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
  constructor(parent, from, offset) {
    this.parent = parent;
    this.from = from;
    this.offset = offset;
    this.pos = p5.Vector.add(p5.Vector.add(this.parent.pos, from), this.offset);
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

    const from_vec = p5.Vector.add(this.parent.pos, this.from);
    this.pos = p5.Vector.add(from_vec, this.offset);
    
    strokeWeight(connection_point_stroke_weight);
    stroke(connection_point_stroke);
    line(from_vec.x, from_vec.y, this.pos.x, this.pos.y);

    fill(this._powered ? connection_point_powered_fill : connection_point_fill);
    circle(this.pos.x, this.pos.y, connection_point_radius);
    
    pop();
  }
}

class ConnectionInPoint extends ConnectionPoint {  
  constructor(parent, from, offset, set_name) {
    super(parent, from, offset);
    this.set_name = set_name;
    this.connection = undefined;
  }
  
  set powered(state) {
    this._powered = state;
    this.parent[this.set_name] = state;
  }
}

class ConnectionOutPoint extends ConnectionPoint {
  constructor(parent, from, offset) {
    super(parent, from, offset);
    this.connections = [];
  }

  set powered(state) {
    this._powered = state;
    this.connections = this.connections.filter((element) => {
      return element != undefined;
    });
    for (const conn of this.connections) {
      conn.powered = state;
    }
  }
}
