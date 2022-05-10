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
    this.size = createVector(light_width, light_height);
    this.input1_state = false;
    this.input1 = new ConnectionInPoint(this, createVector(light_width / 2, light_height / 2), 
                                        createVector(0, component_height * 0.75), "input1_state");
    this.connect_points = [this.input1];
    this.powered = false;
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            (this.pos.x * zoom + camera.x), (this.pos.y * zoom + camera.y), 
                            light_width * zoom, light_height * zoom);
  }

  get center_coord() {
    return p5.Vector.add(this.pos, createVector(light_width / 2, light_height / 2));
  }
  
  update() {
    super.update();
    this.powered = this.input1_state;
  }

  draw(graphics, outline) {
    super.draw(graphics, outline);
    
    graphics.push();

    const light_x = this.pos.x;
    const light_y = this.pos.y;

    const light_bulb_height = light_height * 0.75;

    graphics.strokeWeight(light_stroke_weight);
    graphics.stroke(outline == undefined ? light_stroke : outline);
    graphics.fill(this.powered ? light_powered_fill : light_fill);
    graphics.ellipseMode(CORNER);
    graphics.arc(light_x, light_y, light_width, light_bulb_height, HALF_PI + QUARTER_PI, QUARTER_PI, OPEN);

    const light_center_x = light_x + (light_width / 2);
    const light_center_y = light_y + (light_bulb_height / 2);
    
    const light_bulb_radius = light_width / 2;
    
    const right_light_bulb_point_x = light_bulb_radius * cos(QUARTER_PI) + light_center_x;
    const right_light_bulb_point_y = light_bulb_radius * sin(QUARTER_PI) + light_center_y;

    const left_light_bulb_point_x = light_bulb_radius * cos(HALF_PI + QUARTER_PI) + light_center_x;
    const left_light_bulb_point_y = light_bulb_radius * sin(HALF_PI + QUARTER_PI) + light_center_y;

    const light_bulb_straight_y = (light_y + light_height) - ((light_height - light_bulb_height) / 2);
    
    graphics.strokeWeight(0);
    graphics.rectMode(CORNERS);
    graphics.rect(left_light_bulb_point_x, left_light_bulb_point_y, right_light_bulb_point_x, light_bulb_straight_y);

    graphics.strokeWeight(1);
    graphics.line(left_light_bulb_point_x, left_light_bulb_point_y, left_light_bulb_point_x, light_bulb_straight_y);
    graphics.line(right_light_bulb_point_x, right_light_bulb_point_y, right_light_bulb_point_x, light_bulb_straight_y);

    graphics.fill(light_stroke);
    graphics.ellipseMode(CORNER);
    graphics.arc(left_light_bulb_point_x, left_light_bulb_point_y, 
                 right_light_bulb_point_x - left_light_bulb_point_x, 
                 (light_y + light_height) - left_light_bulb_point_y,
                 0, PI, CHORD);
    
    graphics.pop();
  }
}
