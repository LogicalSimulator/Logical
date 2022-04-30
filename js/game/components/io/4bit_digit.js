"use strict";

const four_bit_digit_width = component_width * 0.75;
const four_bit_digit_height = component_height;
const four_bit_digit_stroke_weight = component_stroke_weight;
const four_bit_digit_stroke = component_stroke;
const four_bit_digit_fill = component_fill;
const four_bit_digit_powered_fill = component_powered_fill;

class FourBitDigit extends Component {
  constructor(pos) {
    super(pos);
    this.input1_state = false;
    this.input1 = new ConnectionInPoint(this, createVector(four_bit_digit_width / 2, four_bit_digit_height * 0.2), 
                                        createVector(-(component_height * 0.75), 0), "input1_state");
    this.input2_state = false;
    this.input2 = new ConnectionInPoint(this, createVector(four_bit_digit_width / 2, four_bit_digit_height * 0.4), 
                                        createVector(-(component_height * 0.75), 0), "input2_state");
    this.input3_state = false;
    this.input3 = new ConnectionInPoint(this, createVector(four_bit_digit_width / 2, four_bit_digit_height * 0.6), 
                                        createVector(-(component_height * 0.75), 0), "input3_state");
    this.input4_state = false;
    this.input4 = new ConnectionInPoint(this, createVector(four_bit_digit_width / 2, four_bit_digit_height * 0.8), 
                                        createVector(-(component_height * 0.75), 0), "input4_state");
    this.display_digit = "0";
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            this.pos.x + camera.x, this.pos.y + camera.y, 
                            four_bit_digit_width, four_bit_digit_height);
  }

  get center_coord() {
    return p5.Vector.add(this.pos, createVector(four_bit_digit_width / 2, four_bit_digit_height / 2));
  }
  
  update() {
    super.update();
    this.input1.update();
    this.input2.update();
    this.input3.update();
    this.input4.update();

    let value = 0;
    if (this.input1_state) {
      value += 1;
    }
    if (this.input2_state) {
      value += 2;
    }
    if (this.input3_state) {
      value += 4;
    }
    if (this.input4_state) {
      value += 8;
    }
    
    this.display_digit = value.toString(16).toUpperCase();
  }

  draw() {
    this.input1.draw();
    this.input2.draw();
    this.input3.draw();
    this.input4.draw();
    
    push();

    const four_bit_center = this.center_coord;
    const four_bit_digit_x = this.pos.x;
    const four_bit_digit_y = this.pos.y;

    strokeWeight(four_bit_digit_stroke_weight);
    stroke(four_bit_digit_stroke);
    fill(four_bit_digit_fill);

    rect(four_bit_digit_x, four_bit_digit_y, four_bit_digit_width, four_bit_digit_height);

    fill(this.display_digit === "0" ? four_bit_digit_stroke : four_bit_digit_powered_fill);
    textAlign(CENTER, CENTER);
    textSize(get_text_size(this.display_digit, four_bit_digit_width * 0.75, four_bit_digit_height * 0.75));
    text(this.display_digit, four_bit_center.x, four_bit_center.y + (four_bit_digit_height * 0.05));
    
    pop();
  }
}
