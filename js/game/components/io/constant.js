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
    this.size = createVector(constant_width, constant_height);
    this.output1 = new ConnectionOutPoint(this, createVector(constant_width / 2, constant_height / 2), 
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

  get center_coord() {
    return p5.Vector.add(this.pos, createVector(constant_width / 2, constant_height / 2));
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            (this.pos.x * zoom + camera.x), (this.pos.y * zoom + camera.y), 
                            constant_width * zoom, constant_height * zoom);
  }
  
  update() {
    super.update();

    // subclass will set true or false here
    // and update output
  }

  draw(graphics, outline) {
    super.draw(graphics, outline);
    // subclasses will override drawing method
  }
}

class TrueConstant extends Constant {
  update() {
    super.update();

    this.powered = true;
  }

  draw(graphics, outline) {
    super.draw(graphics, outline);
    
    graphics.push();

    const constant_center = this.center_coord;
    const constant_x = this.pos.x;
    const constant_y = this.pos.y;
    
    graphics.strokeWeight(constant_stroke_weight);
    graphics.stroke(outline == undefined ? constant_stroke : outline);
    graphics.fill(constant_fill);
    graphics.rect(constant_x, constant_y, constant_width, constant_height);

    graphics.fill(this.powered ? constant_powered_fill : constant_stroke);
    graphics.stroke(constant_stroke);

    const str = "1";
    
    graphics.textAlign(CENTER, CENTER);
    graphics.textSize(get_text_size(str, constant_width * 0.75, constant_height * 0.75));
    graphics.text(str, constant_center.x, constant_center.y + (constant_height * 0.05));
    
    graphics.pop();
  }
}

class FalseConstant extends Constant {
  update(highlighted) {
    super.update();

    this.powered = false;
  }

  draw(graphics, outline) {
    super.draw(graphics, outline);
    
    graphics.push();

    const constant_center = this.center_coord;
    const constant_x = this.pos.x;
    const constant_y = this.pos.y;
    
    graphics.strokeWeight(constant_stroke_weight);
    graphics.stroke(outline == undefined ? constant_stroke : outline);
    graphics.fill(constant_fill);
    graphics.rect(constant_x, constant_y, constant_width, constant_height);

    graphics.fill(this.powered ? constant_powered_fill : constant_stroke);
    graphics.stroke(constant_stroke);

    const str = "0";
    
    graphics.textAlign(CENTER, CENTER);
    graphics.textSize(get_text_size(str, constant_width * 0.75, constant_height * 0.75));
    graphics.text(str, constant_center.x, constant_center.y + (constant_height * 0.05));
    
    graphics.pop();
  }
}
