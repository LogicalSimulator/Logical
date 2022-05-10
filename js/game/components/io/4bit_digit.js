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
    this.size = createVector(four_bit_digit_width, four_bit_digit_height);
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
    this.connect_points = [this.input1, this.input2, this.input3, this.input4];
    this.display_digit = "0";
  }
  
  update() {
    super.update();

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

  draw(graphics, outline) {
    super.draw(graphics, outline);
    
    graphics.push();

    const four_bit_center = this.center_coord;
    const four_bit_digit_x = this.pos.x;
    const four_bit_digit_y = this.pos.y;

    graphics.strokeWeight(four_bit_digit_stroke_weight);
    graphics.stroke(outline == undefined ? four_bit_digit_stroke : outline);
    graphics.fill(four_bit_digit_fill);

    graphics.rect(four_bit_digit_x, four_bit_digit_y, four_bit_digit_width, four_bit_digit_height);
    
    graphics.stroke(four_bit_digit_stroke);
    graphics.fill(this.display_digit === "0" ? four_bit_digit_stroke : four_bit_digit_powered_fill);
    graphics.textAlign(CENTER, CENTER);
    graphics.textSize(get_text_size(this.display_digit, four_bit_digit_width * 0.75, four_bit_digit_height * 0.75));
    graphics.text(this.display_digit, four_bit_center.x, four_bit_center.y + (four_bit_digit_height * 0.05));
    
    graphics.pop();
  }
}
