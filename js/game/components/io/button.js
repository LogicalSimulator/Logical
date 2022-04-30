"use strict";

const button_width = component_width * 0.75;
const button_height = button_width;
const button_stroke_weight = component_stroke_weight;
const button_stroke = component_stroke;
const button_fill = component_fill;
const button_powered_fill = component_powered_fill;

class Button extends Component {
  constructor(pos) {
    super(pos);
    this.output1 = new ConnectionOutPoint(this, createVector(button_width / 2, button_height / 2), 
                                          createVector(component_width * 0.75, 0));
    this._powered = false;
  }

  get powered() {
    return this._powered;
  }

  set powered(state) {
    this._powered = state;
    this.output1.powered = state;
  }

  get center_coord() {
    return p5.Vector.add(this.pos, createVector(button_width / 2, button_height / 2));
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            this.pos.x + camera.x, this.pos.y + camera.y, 
                            button_width, button_height);
  }

  on_left_mouse_click() {
    this.powered = true;
  }

  on_left_mouse_release() {
    this.powered = false;
  }
  
  update() {
    super.update();
    this.output1.update();
  }

  draw() {
    this.output1.draw();
    
    push();

    const button_center = this.center_coord;
    const button_x = this.pos.x;
    const button_y = this.pos.y;
    
    strokeWeight(button_stroke_weight);
    stroke(button_stroke);
    fill(button_fill);
    rect(button_x, button_y, button_width, button_height);

    const button_outer_radius = button_width * 0.8;
    const button_inner_radius = button_width * 0.6;

    fill(this.powered ? button_powered_fill : button_fill);
    circle(button_center.x, button_center.y, button_outer_radius);

    fill(button_fill);
    circle(button_center.x, button_center.y, button_inner_radius);
    
    pop();
  }
}
