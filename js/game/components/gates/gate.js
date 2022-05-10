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
    this.size = createVector(gate_width, gate_height);
  }
}