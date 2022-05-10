// const top_text_size = 12;
// const top_pad = top_text_size + 2;
const icon_pad = 25;

const icons = {
  "switch_icon": {"name": "Switch", "class": Switch},
  "button_icon": {"name": "Button", "class": Button},
  "clock_icon": {"name": "Clock", "class": Clock},
  "true_constant_icon": {"name": "True\nconstant", "class": TrueConstant},
  "false_constant_icon": {"name": "False\nconstant", "class": FalseConstant},
  "light_icon": {"name": "Light", "class": Light},
  "four_bit_display_icon": {"name": "4 bit\ndisplay", "class": FourBitDigit},
  "eight_bit_display_icon": {"name": "8 bit\ndisplay", "class": EightBitDigit},
  "buffer_gate_icon": {"name": "Buffer gate", "class": BufferGate},
  "not_gate_icon": {"name": "NOT gate", "class": NotGate},
  "or_gate_icon": {"name": "OR gate", "class": OrGate},
  "nor_gate_icon": {"name": "NOR gate", "class": NorGate},
  "and_gate_icon": {"name": "AND gate", "class": AndGate},
  "nand_gate_icon": {"name": "NAND gate", "class": NandGate},
  "xor_gate_icon": {"name": "XOR gate", "class": XorGate},
  "xnor_gate_icon": {"name": "XNOR gate", "class": XnorGate}
};


class Icons {
  static switch_icon;
  static button_icon;
  static clock_icon;
  static true_constant_icon;
  static false_constant_icon;
  static light_icon;
  static four_bit_display_icon;
  static eight_bit_display_icon;
  static buffer_gate_icon;
  static not_gate_icon;
  static or_gate_icon;
  static nor_gate_icon;
  static and_gate_icon;
  static nand_gate_icon;
  static xor_gate_icon;
  static xnor_gate_icon;
}

function preload_icons() {
  for (const name in icons) {
    const item = new icons[name]["class"](createVector(icon_pad, icon_pad));
    const buffer = createGraphics(item.size.x + (icon_pad * 2), 
                                  item.size.y + (icon_pad * 2));
    item.draw(buffer);
    // buffer.push();
    // buffer.fill(0);
    // buffer.strokeWeight(0);
    // buffer.text(icons[name]["name"], 0, 0);
    // buffer.pop();
    Icons[name] = buffer;
  }
}
