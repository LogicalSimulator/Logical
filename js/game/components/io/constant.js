"use strict";

const constant_width = component_width * 0.75;
const constant_height = constant_width;
const constant_stroke_weight = component_stroke_weight;
const constant_stroke = component_stroke;
const constant_fill = component_fill;
const constant_powered_fill = component_powered_fill;


class Constant extends Component {
  constructor(pos) {
    super(pos);
    this.output1 = new ConnectionOutPoint(this, createVector(constant_width / 2, constant_height / 2), 
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
    return p5.Vector.add(this.pos, createVector(constant_width / 2, constant_height / 2));
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            this.pos.x, this.pos.y, 
                            constant_width, constant_height);
  }
  
  update() {
    super.update();

    // subclass will set true or false here
    // and update output
  }

  draw() {
    this.output1.draw();
    // subclasses will override drawing method
  }
}

class TrueConstant extends Constant {
  update() {
    super.update();

    this.powered = true;
    
    this.output1.update();
  }

  draw() {
    super.draw();
    
    push();

    const constant_center = this.center_coord;
    const constant_x = this.pos.x;
    const constant_y = this.pos.y;
    
    strokeWeight(constant_stroke_weight);
    stroke(constant_stroke);
    fill(constant_fill);
    rect(constant_x, constant_y, constant_width, constant_height);

    fill(this.powered ? constant_powered_fill : constant_stroke);

    const str = "1";
    
    textAlign(CENTER, CENTER);
    textSize(get_text_size(str, constant_width * 0.75, constant_height * 0.75));
    text(str, constant_center.x, constant_center.y + (constant_height * 0.05));
    
    pop();
  }
}

class FalseConstant extends Constant {
  update() {
    super.update();

    this.powered = false;
    
    this.output1.update();
  }

  draw() {
    super.draw();
    
    push();

    const constant_center = this.center_coord;
    const constant_x = this.pos.x;
    const constant_y = this.pos.y;
    
    strokeWeight(constant_stroke_weight);
    stroke(constant_stroke);
    fill(constant_fill);
    rect(constant_x, constant_y, constant_width, constant_height);

    fill(this.powered ? constant_powered_fill : constant_stroke);

    const str = "0";
    
    textAlign(CENTER, CENTER);
    textSize(get_text_size(str, constant_width * 0.75, constant_height * 0.75));
    text(str, constant_center.x, constant_center.y + (constant_height * 0.05));
    
    pop();
  }
}
