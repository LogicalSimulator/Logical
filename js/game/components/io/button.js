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
    this.size = createVector(button_width, button_height);
    this.output1 = new ConnectionOutPoint(this, createVector(button_width / 2, button_height / 2), 
                                          createVector(component_width * 0.75, 0));
    this.connect_points = [this.output1];
    this._powered = false;
    this.click_activate = false
  }

  get powered() {
    return this._powered;
  }

  set powered(state) {
    this._powered = state;
    this.output1.powered = state;
  }

  on_left_mouse_click() {
    Sounds.play_tap();
    this.powered = true;
  }

  on_left_mouse_release() {
    this.powered = false;
  }
  
  update() {
    super.update();
  }

  draw(graphics, outline) {
    super.draw(graphics, outline);
    
    graphics.push();

    graphics.translate(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
    graphics.rotate(this.angle);
    const button_x = -this.size.x / 2;
    const button_y = -this.size.y / 2
    const button_center = createVector(0, 0);
    
    graphics.strokeWeight(button_stroke_weight);
    graphics.stroke(outline == undefined ? button_stroke : outline);
    graphics.fill(button_fill);
    graphics.rect(button_x, button_y, button_width, button_height);

    const button_outer_radius = button_width * 0.8;
    const button_inner_radius = button_width * 0.6;

    graphics.stroke(button_stroke);
    graphics.fill(this.powered ? button_powered_fill : button_fill);
    graphics.circle(button_center.x, button_center.y, button_outer_radius);

    graphics.fill(button_fill);
    graphics.circle(button_center.x, button_center.y, button_inner_radius);
    
    graphics.pop();
  }
}
