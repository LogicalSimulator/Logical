"use strict";

const gate_width = component_width;
const gate_height = component_height;

const gate_stroke_weight = component_stroke_weight;
const gate_stroke = component_stroke;
const gate_fill = component_fill;
const gate_powered_fill = component_powered_fill;

class Gate extends Component {
  constructor(pos) {
    super(pos);
  }

  mouse_overlapping() {
    return collidePointRect(mouseX, mouseY, 
                            (this.pos.x * zoom + camera.x), (this.pos.y * zoom + camera.y), 
                            gate_width * zoom, gate_height * zoom);
  }

  get center_coord() {
    return p5.Vector.add(this.pos, createVector(gate_width / 2, gate_height / 2));
  }

  on_left_mouse_click() {
    
  }

  on_right_mouse_click() {
    
  }
  
  update() {
    super.update();
  }

  draw(graphics, outline) {
    super.draw(graphics, outline);
  }
}