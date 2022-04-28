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
    this.last_cycle = millis();
    this.period = 1000;
    this.output1 = new ConnectionOutPoint(this, createVector(clock_width / 2, clock_height / 2), 
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
    return p5.Vector.add(this.pos, createVector(clock_width / 2, clock_height / 2));
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            this.pos.x, this.pos.y, 
                            clock_width, clock_height);
  }
  
  update() {
    super.update();

    if (frame_millis - this.last_cycle >= this.period) {
      this.last_cycle = frame_millis;
      this.powered = !this.powered;
    }
    
    this.output1.update();
  }

  draw() {
    this.output1.draw();
    
    push();

    const clock_center = this.center_coord;
    const clock_x = this.pos.x;
    const clock_y = this.pos.y;
    
    strokeWeight(clock_stroke_weight);
    stroke(clock_stroke);
    fill(clock_fill);
    rect(clock_x, clock_y, clock_width, clock_height);

    fill(this.powered ? clock_powered_fill : clock_fill);

    strokeWeight(clock_animation_stroke_weight);
    stroke(this.powered ? clock_powered_fill : clock_stroke);
    noFill();
    
    beginShape();
    vertex(clock_x + (clock_width * 0.25), clock_y + (clock_height * 0.5));
    vertex(clock_x + (clock_width * 0.25), clock_y + (clock_height * 0.25));
    vertex(clock_x + (clock_width * 0.5), clock_y + (clock_height * 0.25));
    vertex(clock_x + (clock_width * 0.5), clock_y + (clock_height * 0.75));
    vertex(clock_x + (clock_width * 0.5), clock_y + (clock_height * 0.75));
    vertex(clock_x + (clock_width * 0.75), clock_y + (clock_height * 0.75));
    vertex(clock_x + (clock_width * 0.75), clock_y + (clock_height * 0.5));
    endShape();
    
    pop();
  }
}
