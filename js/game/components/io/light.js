"use strict";

const light_width = component_width * 0.75;
const light_height = component_height;
const light_stroke_weight = component_stroke_weight;
const light_stroke = component_stroke;
const light_fill = component_fill;
const light_powered_fill = component_powered_fill;

class Light extends Component {
  constructor(pos) {
    super(pos);
    this.input1_state = false;
    this.input1 = new ConnectionInPoint(this, createVector(light_width / 2, light_height / 2), 
                                        createVector(0, component_height * 0.75), "input1_state");
    this.powered = false;
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            this.pos.x, this.pos.y, 
                            light_width, light_height);
  }

  get center_coord() {
    return p5.Vector.add(this.pos, createVector(light_width / 2, light_height / 2));
  }
  
  update() {
    super.update();
    this.input1.update();
    this.powered = this.input1_state;
  }

  draw() {
    this.input1.draw();
    
    push();

    const light_x = this.pos.x;
    const light_y = this.pos.y;

    const light_bulb_height = light_height * 0.75;

    strokeWeight(light_stroke_weight);
    stroke(light_stroke);
    fill(this.powered ? light_powered_fill:light_fill);
    ellipseMode(CORNER);
    arc(light_x, light_y, light_width, light_bulb_height, HALF_PI + QUARTER_PI, QUARTER_PI, OPEN);

    const light_center_x = light_x + (light_width / 2);
    const light_center_y = light_y + (light_bulb_height / 2);
    
    const light_bulb_radius = light_width / 2;
    
    const right_light_bulb_point_x = light_bulb_radius * cos(QUARTER_PI) + light_center_x;
    const right_light_bulb_point_y = light_bulb_radius * sin(QUARTER_PI) + light_center_y;

    const left_light_bulb_point_x = light_bulb_radius * cos(HALF_PI + QUARTER_PI) + light_center_x;
    const left_light_bulb_point_y = light_bulb_radius * sin(HALF_PI + QUARTER_PI) + light_center_y;

    const light_bulb_straight_y = (light_y + light_height) - ((light_height - light_bulb_height) / 2);

    strokeWeight(0)
    rectMode(CORNERS)
    rect(left_light_bulb_point_x, left_light_bulb_point_y, right_light_bulb_point_x, light_bulb_straight_y);

    strokeWeight(1);
    line(left_light_bulb_point_x, left_light_bulb_point_y, left_light_bulb_point_x, light_bulb_straight_y);
    line(right_light_bulb_point_x, right_light_bulb_point_y, right_light_bulb_point_x, light_bulb_straight_y);

    fill(light_stroke);
    ellipseMode(CORNERS);
    arc(left_light_bulb_point_x, left_light_bulb_point_y, right_light_bulb_point_x, light_y + light_height,
        0, PI, CHORD);
    
    pop();
  }
}
