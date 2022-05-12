"use strict";

const switch_width = component_width * 0.75;
const switch_height = component_height;
const switch_stroke_weight = component_stroke_weight;
const switch_stroke = component_stroke;
const switch_fill = component_fill;
const switch_powered_fill = component_powered_fill;

class Switch extends Component {
  constructor(pos) {
    super(pos);
    this.size = createVector(switch_width, switch_height);
    this.output1 = new ConnectionOutPoint(this, createVector(component_width / 2, component_height / 2), 
                                          createVector(component_width * 0.5, 0));
    this.connect_points = [this.output1];
    this._powered = false;
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
    this.powered = !this.powered;
  }
  
  update() {
    super.update();
  }

  draw(graphics, outline) {
    super.draw(graphics, outline);
    
    graphics.push();
    graphics.translate(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
    graphics.rotate(this.angle);
    const switch_x = -this.size.x / 2;
    const switch_y = -this.size.y / 2

    graphics.strokeWeight(switch_stroke_weight);
    graphics.stroke(outline == undefined ? switch_stroke : outline);
    graphics.fill(switch_fill);
    graphics.rect(switch_x, switch_y, switch_width, switch_height);

    const inner_gap_width = switch_width * 0.1;
    const inner_switch_width = switch_width - (inner_gap_width * 2);
    const inner_switch_height = switch_height - (inner_gap_width * 2);
    const inner_switch_x = switch_x + inner_gap_width;
    const inner_switch_y = switch_y + inner_gap_width;

    graphics.stroke(switch_stroke);
    graphics.fill(this.powered ? switch_powered_fill : switch_fill);
    graphics.rect(inner_switch_x, inner_switch_y, inner_switch_width, inner_switch_height);

    const center_gap_width = switch_width * 0.3;
    const center_switch_width = switch_width - (center_gap_width * 2);
    const center_switch_height = switch_height - (center_gap_width * 2);
    const center_switch_x = switch_x + center_gap_width;
    const center_switch_y = switch_y + center_gap_width;

    graphics.fill(switch_fill);
    graphics.rect(center_switch_x, center_switch_y, center_switch_width, center_switch_height);

    const switch_part_diff = switch_width * 0.1;
    const center_half_height = center_switch_height / 2;

    if (this.powered) {
      graphics.rect(center_switch_x - switch_part_diff, center_switch_y - switch_part_diff, 
                    center_switch_width + (switch_part_diff * 2), center_half_height + switch_part_diff);
    } else {
      graphics.rect(center_switch_x - switch_part_diff, center_switch_y + center_half_height, 
                    center_switch_width + (switch_part_diff * 2), center_half_height + switch_part_diff);
    }
    
    graphics.pop();
  }
}
