"use strict";

const component_width = 50;
const component_height = 50;

const component_stroke_weight = 1;
const component_stroke = 0;  // black 
const component_fill = 255;  // white
const component_powered_fill = [0, 255, 255];  // cyan

function destroy_component(comp) {
  comp.destroy_me = true;
  for (let i = 1; ; i ++) {
    const maybe_out = comp["output" + i];
    if (maybe_out == undefined) {
      break;
    }
    maybe_out.powered = false;
    for (const conn of maybe_out.connections) {
      conn.destroy_me = true;
    }
  }
  for (let i = 1; ; i ++) {
    const maybe_in = comp["input" + i];
    if (maybe_in == undefined) {
      break;
    }
    if (maybe_in.connection != undefined) {
      maybe_in.connection.destroy_me = true;
    }
  }
}

class Component {
  constructor(pos) {
    this.pos = pos;
    this.size = createVector(component_width, component_height);
    this.mouse_pressed = false;
    this.camera_shifted = false;
    this.activated_check = false;
    this.old_pos_mouse = createVector(mouseX, mouseY);
    this.click_activate = true;
    this.mouse_select_pos_diff = createVector();
    this.connect_points = [];
    this.angle = 0;
  }
  get_poly_verts(){
    const center = this.center_coord;
    const top_left_offset = p5.Vector.sub(this.pos, center);
    const top_right_offset = top_left_offset.copy();
    top_right_offset.x += this.size.x;
    const bottom_right_offset = p5.Vector.sub(center, this.pos);
    const bottom_left_offset = bottom_right_offset.copy();
    bottom_left_offset.x -= this.size.x;
    // wait above commented out
    // it doesn't scale mousex and mousey
    // only scales and translates this.pos and this.size
    // const mp = createVector((mouseX - camera.x) / zoom, (mouseY - camera.y) / zoom);
    const top_left = rotate_to_real(center, top_left_offset, this.angle);
    const top_right = rotate_to_real(center, top_right_offset, this.angle);
    const bottom_right = rotate_to_real(center, bottom_right_offset, this.angle);
    const bottom_left = rotate_to_real(center, bottom_left_offset, this.angle);
    return [
                              top_left, 
                              top_right, 
                              bottom_right, 
                              bottom_left
                            ]
  }
  mouse_overlapping() {
    // return collidePointRect(mouseX, mouseY, 
    //                         (this.pos.x * zoom + camera.x), (this.pos.y * zoom + camera.y), 
    //                         this.size.x * zoom, this.size.y * zoom);
    const center = this.center_coord;
    const top_left_offset = p5.Vector.sub(this.pos, center);
    const top_right_offset = top_left_offset.copy();
    top_right_offset.x += this.size.x;
    const bottom_right_offset = p5.Vector.sub(center, this.pos);
    const bottom_left_offset = bottom_right_offset.copy();
    bottom_left_offset.x -= this.size.x;
    // wait above commented out
    // it doesn't scale mousex and mousey
    // only scales and translates this.pos and this.size
    // const mp = createVector((mouseX - camera.x) / zoom, (mouseY - camera.y) / zoom);
    const top_left = rotate_to_real(center, top_left_offset, this.angle);
    const top_right = rotate_to_real(center, top_right_offset, this.angle);
    const bottom_right = rotate_to_real(center, bottom_right_offset, this.angle);
    const bottom_left = rotate_to_real(center, bottom_left_offset, this.angle);
    top_left.mult(zoom);
    top_left.add(camera);
    top_right.mult(zoom);
    top_right.add(camera);
    bottom_right.mult(zoom);
    bottom_right.add(camera);
    bottom_left.mult(zoom);
    bottom_left.add(camera);
    return collidePointPoly(mouseX, mouseY, 
                            [
                              top_left, 
                              top_right, 
                              bottom_right, 
                              bottom_left
                            ],true);
  }

  get center_coord() {
    return p5.Vector.add(this.pos, p5.Vector.div(this.size, 2));
  }

  set_pos_center(p) {
    this.pos = p;
    this.pos.sub(this.mouse_select_pos_diff)
    //this.pos.add(createVector(component_width / 2, components_height / 2));
  }

  on_left_mouse_click() {
    
  }

  on_right_mouse_click() {
    
  }

  on_left_mouse_release() {
    
  }

  on_right_mouse_release() {
    
  }

  mouse_clicked() {
    
  }

  handle_mouse() {
    if (this.mouse_overlapping() && !(this in hovering)) {
      hovering.push(this);
    }
    if (hovering_on_button()) {
      return;
    }
    if (this.click_activate) {
      if (mouseIsPressed) {
        if (!this.activated_check) {
          this.old_pos_mouse = createVector(mouseX, mouseY);
        }
        if (this.mouse_overlapping()) {
          this.activated_check = true;
        }
      } else {
        if (this.activated_check) {
          this.activated_check = false;
          if (this.mouse_overlapping()) {
            let diff = p5.Vector.sub(createVector(mouseX, mouseY), this.old_pos_mouse);
            if (diff.mag() < 1) {
              if (mouseButton === LEFT) {
                this.on_left_mouse_click();
              } else if (mouseButton === RIGHT) {
                this.on_right_mouse_click();
              }
            }
          }
        }
      }
    } else {
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
  }
  
  update() {
    this.handle_mouse();
    for (const point of this.connect_points) {
      point.update();
    }
  }

  draw(graphics, outline) {
    graphics.push();
    for (const point of this.connect_points) {
      point.draw(graphics, hovering.indexOf(point) != -1 ? hover_color : undefined);
    }
    graphics.pop();

    if (draw_component_bounds) {
      graphics.push();
      graphics.stroke(255, 0, 0);
      graphics.strokeWeight(5);
      graphics.noFill();
      const center = this.center_coord;
      const top_left_offset = p5.Vector.sub(this.pos, center);
      const top_right_offset = top_left_offset.copy();
      top_right_offset.x += this.size.x;
      const bottom_right_offset = p5.Vector.sub(center, this.pos);
      const bottom_left_offset = bottom_right_offset.copy();
      bottom_left_offset.x -= this.size.x;
      graphics.beginShape();
      graphics.vertex(rotate_to_real(center, top_left_offset, this.angle).x, rotate_to_real(center, top_left_offset, this.angle).y);
      graphics.vertex(rotate_to_real(center, top_right_offset, this.angle).x, rotate_to_real(center, top_right_offset, this.angle).y);
      graphics.vertex(rotate_to_real(center, bottom_right_offset, this.angle).x, rotate_to_real(center, bottom_right_offset, this.angle).y);
      graphics.vertex(rotate_to_real(center, bottom_left_offset, this.angle).x, rotate_to_real(center, bottom_left_offset, this.angle).y);
      graphics.endShape(CLOSE);
      graphics.pop();
    }
  }
}
