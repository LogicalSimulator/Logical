"use strict";

const clock_width = component_width * 0.75;
const clock_height = clock_width;
const clock_stroke_weight = component_stroke_weight;
const clock_animation_stroke_weight = component_stroke_weight * 5;
const clock_stroke = component_stroke;
const clock_fill = component_fill;
const clock_powered_fill = component_powered_fill;

class Clock extends Component {
  constructor(pos) {
    super(pos);
    this.size = createVector(clock_width, clock_height);
    this.last_cycle = millis();
    this.period = 1000;
    this.output1 = new ConnectionOutPoint(this, createVector(clock_width / 2, clock_height / 2), 
                                          createVector(component_width * 0.75, 0));
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
  
  update() {
    super.update();

    if (frame_millis - this.last_cycle >= this.period) {
      this.last_cycle = frame_millis;
      this.powered = !this.powered;
    }
  }

  draw(graphics, outline) {
    super.draw(graphics, outline);
    
    graphics.push();

    graphics.translate(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
    graphics.rotate(this.angle);
    const clock_x = -this.size.x / 2;
    const clock_y = -this.size.y / 2
    const clock_center = createVector(0, 0);
    
    graphics.strokeWeight(clock_stroke_weight);
    graphics.stroke(outline == undefined ? clock_stroke : outline);
    graphics.fill(clock_fill);
    graphics.rect(clock_x, clock_y, clock_width, clock_height);

    graphics.fill(this.powered ? clock_powered_fill : clock_fill);

    graphics.strokeWeight(clock_animation_stroke_weight);
    graphics.stroke(this.powered ? clock_powered_fill : clock_stroke);
    graphics.noFill();
    
    graphics.beginShape();
    graphics.vertex(clock_x + (clock_width * 0.25), clock_y + (clock_height * 0.5));
    graphics.vertex(clock_x + (clock_width * 0.25), clock_y + (clock_height * 0.25));
    graphics.vertex(clock_x + (clock_width * 0.5), clock_y + (clock_height * 0.25));
    graphics.vertex(clock_x + (clock_width * 0.5), clock_y + (clock_height * 0.75));
    graphics.vertex(clock_x + (clock_width * 0.5), clock_y + (clock_height * 0.75));
    graphics.vertex(clock_x + (clock_width * 0.75), clock_y + (clock_height * 0.75));
    graphics.vertex(clock_x + (clock_width * 0.75), clock_y + (clock_height * 0.5));
    graphics.endShape();
    
    graphics.pop();
  }
}
