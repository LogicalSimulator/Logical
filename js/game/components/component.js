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
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            (this.pos.x * zoom + camera.x), (this.pos.y * zoom + camera.y), 
                            this.size.x * zoom, this.size.y * zoom);
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
    for (const point of this.connect_points) {
      point.draw(graphics, hovering.indexOf(point) != -1 ? hover_color : undefined);
    }
  }
}
