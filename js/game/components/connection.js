"use strict";

const connection_stroke_weight = component_stroke_weight * 2;
const connection_stroke = component_stroke;
const connection_powered_stroke = component_powered_fill;

function make_connection(from_point, to_point) {
  if (to_point.connection != undefined) {
    // console.log("creating connection to already used input");
    // console.log(to_point.connection.from_point.connections.length);
    for (const index in to_point.connection.from_point.connections) {
      const conn = to_point.connection.from_point.connections[index];
      if (conn != undefined && conn.to_point === to_point) {
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
  to_point.powered = from_point.powered;
  from_point.parent.powered = from_point.parent.powered;
  return connection;
}

function destroy_connection(connection) {
  connection.powered = false;
  for (const index in connection.from_point.connections) {
    const conn = connection.from_point.connections[index];
    if (conn !== connection) {
      continue;
    }
    // console.log("destroying connection at index " + index);
    connection.from_point.connections[index].destroy_me = true;
    connection.from_point.connections[index] = undefined;
  }
}

class Connection {
  constructor(from_point, to_point) {
    this.from_point = from_point;
    this.to_point = to_point;
    this.destroy_me = false;
    this._powered = false;
    this.hovering = false;
  }

  get powered() {
    return this._powered;
  }

  set powered(state) {
    this._powered = state;
    this.to_point.powered = state;
  }

  mouse_overlapping() {
    const from_point_offset = rotate_to_real(
      this.from_point.pos,
      this.from_point.offset,
      this.from_point.angle
    );
    const to_point_offset = rotate_to_real(
      this.to_point.pos,
      this.to_point.offset,
      this.to_point.angle
    );

    let skip_perc = 1 / 4;
    let ler_perc = skip_perc;
    let line_verts = [];
    let mp = createVector(
      (mouseX - camera.x) / zoom,
      (mouseY - camera.y) / zoom
    );

    for (let i = 0; i < 1; i += skip_perc) {
      let px = bezierPoint(
        this.from_point.pos.x,
        from_point_offset.x,
        to_point_offset.x,
        this.to_point.pos.x,
        ler_perc
      );
      let py = bezierPoint(
        this.from_point.pos.y,
        from_point_offset.y,
        to_point_offset.y,
        this.to_point.pos.y,
        ler_perc
      );
      let bx = bezierPoint(
        this.from_point.pos.x,
        from_point_offset.x,
        to_point_offset.x,
        this.to_point.pos.x,
        ler_perc - skip_perc
      );
      let by = bezierPoint(
        this.from_point.pos.y,
        from_point_offset.y,
        to_point_offset.y,
        this.to_point.pos.y,
        ler_perc - skip_perc
      );

      line_verts.push(createVector(px, py));
      if (collideLineCircle(bx, by, px, py, mp.x, mp.y, 10)) {
        return true;
      }
      ler_perc += skip_perc;
    }
    return false;
  }

  update() {
    if (this.mouse_overlapping()) {
      hovering.push(this);
    }
  }

  draw(graphics, outline) {
    graphics.push();

    // const from_point_offset = p5.Vector.add(this.from_point.pos, this.from_point.offset);
    // const to_point_offset = p5.Vector.add(this.to_point.pos, this.to_point.offset);

    const from_point_offset = rotate_to_real(
      this.from_point.pos,
      this.from_point.offset,
      this.from_point.angle
    );
    const to_point_offset = rotate_to_real(
      this.to_point.pos,
      this.to_point.offset,
      this.to_point.angle
    );

    graphics.strokeWeight(connection_stroke_weight);
    if (outline != undefined) {
      graphics.stroke(outline);
    } else {
      graphics.stroke(
        this._powered ? connection_powered_stroke : connection_stroke
      );
    }

    graphics.noFill();

    graphics.beginShape();
    graphics.vertex(this.from_point.pos.x, this.from_point.pos.y);
    graphics.bezierVertex(
      from_point_offset.x,
      from_point_offset.y,
      to_point_offset.x,
      to_point_offset.y,
      this.to_point.pos.x,
      this.to_point.pos.y
    );
    graphics.endShape();

    // graphics.push();
    // graphics.strokeWeight(5);
    // graphics.stroke(255, 0, 0);
    // graphics.point(from_point_offset.x, from_point_offset.y);
    // graphics.stroke(255, 255, 0);
    // graphics.point(to_point_offset.x, to_point_offset.y);
    // graphics.pop();

    //  graphics.bezier(this.from_point.pos.x, this.from_point.pos.y,
    //                  from_point_offset.x, from_point_offset.y,
    //                  to_point_offset.x, to_point_offset.y,
    //                  this.to_point.pos.x, this.to_point.pos.y);

    graphics.pop();
  }
}

const connection_point_stroke_weight = component_stroke_weight;
const connection_point_stroke = component_stroke;
const connection_point_fill = component_fill;
const connection_point_powered_fill = component_powered_fill;
const connection_point_radius = 10;

class ConnectionPoint {
  constructor(parent, from, offset, assign_name) {
    this.parent = parent;
    this.from = from;
    this.offset = offset;
    this.assign_name = assign_name;
    this.pos = p5.Vector.add(p5.Vector.add(this.parent.pos, from), this.offset);
    this.mouse_pressed = false;
    this._powered = false;
    this.angle = 0;
  }

  get powered() {
    return this._powered;
  }

  set powered(state) {
    this._powered = state;
  }

  mouse_overlapping() {
    return collidePointCircle(
      mouseX,
      mouseY,
      this.pos.x * zoom + camera.x,
      this.pos.y * zoom + camera.y,
      connection_point_radius * zoom
    );
  }

  on_left_mouse_click() {}

  on_right_mouse_click() {}

  on_left_mouse_release() {}

  on_right_mouse_release() {}

  handle_mouse() {
    if (this.mouse_overlapping() && !(this in hovering)) {
      hovering.push(this);
    }
    if (mouseIsPressed) {
      if (this.mouse_overlapping()) {
        if (!this.mouse_pressed) {
          this.mouse_pressed = true;
          if (mouseButton === LEFT) {
            this.on_left_mouse_click();
          } else if (mouseButton === RIGHT) {
            this.on_right_mouse_click();
          }
        }
      }
    } else {
      if (this.mouse_pressed) {
        this.mouse_pressed = false;
        if (mouseButton === LEFT) {
          this.on_left_mouse_release();
        } else if (mouseButton === RIGHT) {
          this.on_right_mouse_release();
        }
      }
    }
  }

  update() {
    this.angle = this.parent.angle;
    this.handle_mouse();
  }

  draw(graphics, outline) {
    graphics.push();

    const parent_cen = this.parent.center_coord;
    // const from_vec = p5.Vector.add(this.parent.pos, this.from);
    let from_vec = p5.Vector.add(this.parent.pos, this.from);
    from_vec = rotate_to_real(
      parent_cen,
      p5.Vector.sub(from_vec, parent_cen),
      this.angle
    );
    // from_vec = this.rotate_to_real(this.parent.pos, this.from, this.angle);
    // this.pos = p5.Vector.add(from_vec, this.offset);

    //graphics.circle(this.parent.pos.x,this.parent.pos.y,30)
    // TODO: FIX THIS MAKES IT SQUISH INWARDS
    // I THINK YOU NEED TO ROTATE FROM_VEC BUT IDK HOW
    // from_vec = this.rotate_to_real(from_vec, this.offset, this.angle);
    this.pos = rotate_to_real(from_vec, this.offset, this.angle);

    graphics.strokeWeight(connection_point_stroke_weight);
    graphics.stroke(connection_point_stroke);
    graphics.line(from_vec.x, from_vec.y, this.pos.x, this.pos.y);
    graphics.stroke(outline == undefined ? connection_point_stroke : outline);
    graphics.fill(
      this._powered ? connection_point_powered_fill : connection_point_fill
    );
    graphics.circle(this.pos.x, this.pos.y, connection_point_radius);
    graphics.fill(255, 0, 0);
    graphics.pop();

    // graphics.push();
    // graphics.strokeWeight(5);
    // graphics.stroke(255, 0, 0);
    // graphics.point(from_vec);
    // graphics.stroke(255, 255, 0);
    // graphics.point(this.pos);
    // graphics.pop();
  }
}

class ConnectionInPoint extends ConnectionPoint {
  constructor(parent, from, offset, set_name, assign_name) {
    super(parent, from, offset, assign_name);
    this.set_name = set_name;
    this.connection = undefined;
  }

  set powered(state) {
    this._powered = state;
    this.parent[this.set_name] = state;
  }
}

class ConnectionOutPoint extends ConnectionPoint {
  constructor(parent, from, offset, assign_name) {
    super(parent, from, offset, assign_name);
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
