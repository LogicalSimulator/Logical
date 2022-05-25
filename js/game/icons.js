const top_text_size = 12 * 2;
const top_pad = top_text_size * 2;
let bottom_pad;
let x_pad;

const icons = {
  switch_icon: { name: "Switch", class: Switch },
  button_icon: { name: "Button", class: Button },
  clock_icon: { name: "Clock", class: Clock },
  true_constant_icon: { name: "True constant", class: TrueConstant },
  false_constant_icon: { name: "False constant", class: FalseConstant },
  light_icon: { name: "Light", class: Light },
  four_bit_display_icon: { name: "4 bit display", class: FourBitDigit },
  eight_bit_display_icon: { name: "8 bit display", class: EightBitDigit },
  buffer_gate_icon: { name: "Buffer gate", class: BufferGate },
  not_gate_icon: { name: "NOT gate", class: NotGate },
  or_gate_icon: { name: "OR gate", class: OrGate },
  nor_gate_icon: { name: "NOR gate", class: NorGate },
  and_gate_icon: { name: "AND gate", class: AndGate },
  nand_gate_icon: { name: "NAND gate", class: NandGate },
  xor_gate_icon: { name: "XOR gate", class: XorGate },
  xnor_gate_icon: { name: "XNOR gate", class: XnorGate },
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
  if (make_vertical) {
    bottom_pad = 5;
    x_pad = 60;
  } else {
    bottom_pad = 5;
    x_pad = 100;
  }
  for (const name in icons) {
    const item = new icons[name]["class"](createVector());
    const buf_width = item.size.x + x_pad * 2;
    const buf_height = item.size.y + top_pad + bottom_pad;
    // item.pos = createVector((buf_width / 2) - item.size.x, (buf_height / 2) - item.size.y);
    item.pos = createVector(buf_width, buf_height);
    item.pos.div(2);
    item.pos.sub(p5.Vector.div(item.size, 2));
    item.pos.y += bottom_pad;
    if (item instanceof EightBitDigit) {
      item.pos.y += bottom_pad * 2;
    }
    const buffer = createGraphics(buf_width, buf_height);
    // buffer.push();
    // buffer.fill(255, 0, 0);
    // buffer.rect(0, 0, buf_width, buf_height);
    // buffer.pop();
    item.draw(buffer);
    buffer.push();
    buffer.fill(0);
    buffer.strokeWeight(0);
    buffer.textSize(top_text_size);
    buffer.textAlign(CENTER, TOP);
    buffer.text(icons[name]["name"], buf_width / 2, 0);
    buffer.pop();
    Icons[name] = buffer;
  }
}
