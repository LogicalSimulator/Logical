"use strict";

const switch_width = component_width * 0.75;
const switch_height = component_height;
const switch_stroke_weight = component_stroke_weight;
const switch_stroke = component_stroke;
const switch_fill = component_fill;
const switch_powered_fill = component_powered_fill;

class Switch extends Component {
  constructor(x, y) {
    super(x, y);
    this.output1 = new ConnectionOutPoint(
      this, 
      this.x + (switch_width / 2), this.y + (switch_height / 2),
      component_width * 0.75, 0
    );
    this._powered = false;
  }

  get powered() {
    return this._powered;
  }

  set powered(state) {
    this._powered = state;
    this.output1.powered = state;
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            this.x, this.y, 
                            switch_width, switch_height);
  }

  on_left_mouse_click() {
    this.powered = !this.powered;
  }
  
  update() {
    super.update();
    this.output1.update();
  }

  draw() {
    this.output1.draw();
    
    push();

    const switch_x = this.x;
    const switch_y = this.y;

    strokeWeight(switch_stroke_weight);
    stroke(switch_stroke);
    fill(switch_fill);
    rect(switch_x, switch_y, switch_width, switch_height);

    const inner_gap_width = switch_width * 0.1;
    const inner_switch_width = switch_width - (inner_gap_width * 2);
    const inner_switch_height = switch_height - (inner_gap_width * 2);
    const inner_switch_x = switch_x + inner_gap_width;
    const inner_switch_y = switch_y + inner_gap_width;

    fill(this.powered ? switch_powered_fill : switch_fill);
    rect(inner_switch_x, inner_switch_y, inner_switch_width, inner_switch_height);

    const center_gap_width = switch_width * 0.3;
    const center_switch_width = switch_width - (center_gap_width * 2);
    const center_switch_height = switch_height - (center_gap_width * 2);
    const center_switch_x = switch_x + center_gap_width;
    const center_switch_y = switch_y + center_gap_width;

    fill(switch_fill);
    rect(center_switch_x, center_switch_y, center_switch_width, center_switch_height);

    const switch_part_diff = switch_width * 0.1;
    const center_half_height = center_switch_height / 2;

    if (this.powered) {
      rect(center_switch_x - switch_part_diff, center_switch_y - switch_part_diff, 
           center_switch_width + (switch_part_diff * 2), center_half_height + switch_part_diff);
    } else {
      rect(center_switch_x - switch_part_diff, center_switch_y + center_half_height, 
           center_switch_width + (switch_part_diff * 2), center_half_height + switch_part_diff);
    }
    
    pop();
  }
}
