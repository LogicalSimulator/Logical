"use strict";

const eight_bit_digit_width = (component_width * 0.75) * 2;
const eight_bit_digit_height = component_height;
const eight_bit_digit_stroke_weight = component_stroke_weight;
const eight_bit_digit_stroke = component_stroke;
const eight_bit_digit_fill = component_fill;
const eight_bit_digit_powered_fill = component_powered_fill;

class EightBitDigit extends Component {
  constructor(pos) {
    super(pos);
    this.input1_state = false;
    this.input1 = new ConnectionInPoint(this, createVector(eight_bit_digit_width * (1 / 9), eight_bit_digit_height / 2), 
                                        createVector(0, -(component_height * 0.75)), "input1_state");
    this.input2_state = false;
    this.input2 = new ConnectionInPoint(this, createVector(eight_bit_digit_width * (2 / 9), eight_bit_digit_height / 2), 
                                        createVector(0, -(component_height * 0.75)), "input2_state");
    this.input3_state = false;
    this.input3 = new ConnectionInPoint(this, createVector(eight_bit_digit_width * (3 / 9), eight_bit_digit_height / 2), 
                                        createVector(0, -(component_height * 0.75)), "input3_state");
    this.input4_state = false;
    this.input4 = new ConnectionInPoint(this, createVector(eight_bit_digit_width * (4 / 9), eight_bit_digit_height / 2), 
                                        createVector(0, -(component_height * 0.75)), "input4_state");
    this.input5_state = false;
    this.input5 = new ConnectionInPoint(this, createVector(eight_bit_digit_width * (5 / 9), eight_bit_digit_height / 2), 
                                        createVector(0, -(component_height * 0.75)), "input5_state");
    this.input6_state = false;
    this.input6 = new ConnectionInPoint(this, createVector(eight_bit_digit_width * (6 / 9), eight_bit_digit_height / 2), 
                                        createVector(0, -(component_height * 0.75)), "input6_state");
    this.input7_state = false;
    this.input7 = new ConnectionInPoint(this, createVector(eight_bit_digit_width * (7 / 9), eight_bit_digit_height / 2), 
                                        createVector(0, -(component_height * 0.75)), "input7_state");
    this.input8_state = false;
    this.input8 = new ConnectionInPoint(this, createVector(eight_bit_digit_width * (8 / 9), eight_bit_digit_height / 2), 
                                        createVector(0, -(component_height * 0.75)), "input8_state");
    this.connect_points = [this.input1, this.input2, this.input3, this.input4, this.input5, this.input6, this.input7, this.input8];
    this.display_digit = "00";
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            (this.pos.x * zoom + camera.x), (this.pos.y * zoom + camera.y), 
                            eight_bit_digit_width * zoom, eight_bit_digit_height * zoom);
  }

  get center_coord() {
    return p5.Vector.add(this.pos, createVector(eight_bit_digit_width / 2, eight_bit_digit_height / 2));
  }
  
  update() {
    super.update();

    let value = 0;
    
    if (this.input1_state) {
      value += 1;
    }
    for (let i = 2; i <= 8; i ++) {
      const pwr = Math.pow(2, i - 1);
      if (this["input" + i + "_state"]) {
        value += pwr;
      }
    }
    
    this.display_digit = value.toString(16).toUpperCase();
    if (this.display_digit.length === 1) {
      this.display_digit = "0" + this.display_digit;
    }
  }

  draw(graphics, outline) {
    super.draw(graphics, outline);
    
    graphics.push();

    const eight_bit_center = this.center_coord;
    const eight_bit_digit_x = this.pos.x;
    const eight_bit_digit_y = this.pos.y;

    graphics.strokeWeight(eight_bit_digit_stroke_weight);
    graphics.stroke(outline == undefined ? eight_bit_digit_stroke : outline);
    graphics.fill(eight_bit_digit_fill);

    graphics.rect(eight_bit_digit_x, eight_bit_digit_y, eight_bit_digit_width, eight_bit_digit_height);

    graphics.stroke(eight_bit_digit_stroke);
    graphics.fill(this.display_digit === "00" ? eight_bit_digit_stroke : eight_bit_digit_powered_fill);
    graphics.textAlign(CENTER, CENTER);
    graphics.textSize(get_text_size(this.display_digit, eight_bit_digit_width * 0.75, eight_bit_digit_height * 0.75));
    graphics.text(this.display_digit, eight_bit_center.x, eight_bit_center.y + (eight_bit_digit_height * 0.05));
    
    graphics.pop();
  }
}
