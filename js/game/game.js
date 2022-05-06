"use strict";

const bg_color = 220;
const dark_bg_color = 56;
const grid_color = 240;
const dark_grid_color = 100;

const grid_size = 20;

const make_testing_objs = true;
const show_mouse_coords = true;
const zoom_diff = 0.1;
const zoom_min = 0.1;
const zoom_max = 3;

let hovering_on_obj = false;

let frame_millis = 0;

let camera;
let zoom = 1;

class Game {
  constructor() {
    this.connections = [];
    this.components = [];
    this.gui = [];
    this.items = [this.connections, this.components];
    
    this.drag_mode = true;
    this.dark_mode = false;
    
    frame_millis = millis();

    camera = createVector(0, 0);
    
    hovering_on_obj = false;

    this.make_gui();

    if (make_testing_objs) {
      this.make_testing_objects();  
    }
  }

  make_gui() {
    let main_group;
    let sub_group;
    const make_vertical = width > height * 2;
    if (make_vertical) {
      main_group = VerticalWidgetGroup;
      sub_group = HorizontalWidgetGroup;
    } else {
      sub_group = VerticalWidgetGroup;
      main_group = HorizontalWidgetGroup;
    }
    this.side_group = new main_group();

    const button_names = {
      "Switch": () => {},
      "Button": () => {},
      "Clock": () => {},
      "True\nconstant": () => {},
      "False\nconstant": () => {},
      "Light": () => {},
      "4 bit\ndisplay": () => {},
      "8 bit\ndisplay": () => {},
      "Buffer gate": () => {},
      "NOT gate": () => {},
      "OR gate": () => {},
      "NOR gate": () => {},
      "AND gate": () => {},
      "NAND gate": () => {},
      "XOR gate": () => {},
      "XNOR gate": () => {}
    };
    
    const buttons = [];

    for (const key of Object.keys(button_names)) {
      const button = create_button(key, 0, 0, 0, 0, button_names[key]);
      button.clickable.cornerRadius = 0;
      button.clickable.strokeWeight = 0;
      buttons.push(button);
    }

    const btns_per_row = 2;
    for (let i = 0; i < buttons.length; i += btns_per_row) {
      const row = new sub_group();
      for (let j = 0; j < btns_per_row; j ++) {
        row.widgets.push(buttons[i + j]);
      }
      this.side_group.widgets.push(row);
    }

    this.side_group.x = 0;
    this.side_group.y = 0;
    if (make_vertical) {
      this.side_group.width = 150;
      this.side_group.height = height;
      this.side_group.y_pad = -1;
    } else {
      this.side_group.width = width;
      this.side_group.height = 100;
      this.side_group.x_pad = -1;
    }

    this.gui.push(this.side_group);

    this.button_line = new WidgetLine();
    if (make_vertical) {
      this.button_line.x = this.side_group.x + this.side_group.width;
      this.button_line.y = this.side_group.y;
      this.button_line.width = 0;
      this.button_line.height = this.side_group.height;
    } else {
      this.button_line.x = this.side_group.x;
      this.button_line.y = this.side_group.y + this.side_group.height;
      this.button_line.width = this.side_group.width;
      this.button_line.height = 0;
    }
    this.gui.push(this.button_line);
  }

  resize_gui() {
    if (this.side_group instanceof VerticalWidgetGroup) {
      this.side_group.height = height;
      this.button_line.height = this.side_group.height;
    } else {
      this.side_group.width = width;
      this.button_line.width = this.side_group.width;
    }
  }
  
  get_hover_component(distance) {
    if (distance == undefined) {
      for (const i in this.components) {
        const comp = this.components[i];
        if (comp.mouse_overlapping()) {
          return i;
        }
      }
      return -1;
    } else {
      const comps = [];
      for (const i in this.components) {
        const comp = this.components[i];
        if (dist(mouseX, mouseY, comp.pos.x, comp.pos.y) < distance) {
          comps.push(comp);
        }
      }
      return comps;
    }
  }

  get_hover_connect_point(component) {
    const all_connect_points = [];
    for (let i = 1; ; i ++) {
      const attr = "input" + i;
      if (component[attr] != undefined) {
        all_connect_points.push(attr);
      } else {
        break;
      }
    }
    for (let i = 1; ; i ++) {
      const attr = "output" + i;
      if (component[attr] != undefined) {
        all_connect_points.push(attr);
      } else {
        break;
      }
    }
    for (const attr of all_connect_points) {
      const connect_point = component[attr];
      if (connect_point.mouse_overlapping()) {
        return connect_point;
      }
    }
    return undefined;
  }
  
  on_resize() {
    this.resize_gui();
  }

  on_mouse_press() {
    return false;
  }
  
  on_mouse_drag() {
    if (this.drag_mode && !hovering_on_obj && !hovering_on_button()) {
      camera.add(createVector(movedX, 
                              movedY));
    }
    return false;
  }

  on_mouse_release() {
    return false;
  }

  on_mouse_wheel(event) {
    if (hovering_on_button()) {
      
    } else {
      let scale_factor;
      if (event.deltaY > 0) {
        scale_factor = (zoom - zoom_diff) / zoom;
        // scale_factor = 1 - zoom_diff;
      } else {
        scale_factor = (zoom + zoom_diff) / zoom;
        // scale_factor = 1 + zoom_diff;
      }
  
      // https://stackoverflow.com/a/70660569/10291933
      const previous = zoom;
      zoom *= scale_factor;
      zoom = Math.min(Math.max(zoom, zoom_min), zoom_max);
      zoom = Math.round(zoom * 10) / 10;
  
      if (zoom != previous) {
        camera.x = mouseX - (mouseX * scale_factor) + (camera.x * scale_factor);
        camera.y = mouseY - (mouseY * scale_factor) + (camera.y * scale_factor);
      }
    }
    
    return false;
  }

  make_testing_objects() {
    // testing
    console.log("creating test objects");
    // testing switches and lights
    this.components.push(new Switch(createVector(10, 10)));
    this.components.push(new Light(createVector(80, 10)));
    this.components.push(new Light(createVector(140, 10)));
    this.components.push(new Switch(createVector(10, 70)));
    this.components.push(new Light(createVector(200, 10)));
    // -- connect one switch to multiple lights
    this.connections.push(make_connection(this.components[0].output1, this.components[1].input1));
    this.connections.push(make_connection(this.components[0].output1, this.components[2].input1));
    // -- connect one switch to another light
    this.connections.push(make_connection(this.components[3].output1, this.components[4].input1));
    // -- connect a switch to a light, changing it's connection
    this.connections.push(make_connection(this.components[3].output1, this.components[2].input1));
    // buffer gate
    this.components.push(new BufferGate(createVector(320, 10)));
    // -- switch to buffer gate
    this.components.push(new Switch(createVector(300, 80)));
    // -- connect switch to buffer
    this.connections.push(make_connection(this.components[6].output1, this.components[5].input1));
    // -- light bulbs from buffer gate
    this.components.push(new Light(createVector(400, 10)));
    this.connections.push(make_connection(this.components[5].output1, this.components[7].input1));
    this.components.push(new Light(createVector(450, 10)));
    this.connections.push(make_connection(this.components[5].output1, this.components[8].input1));
    // -- not gate
    this.components.push(new NotGate(createVector(400, 80)));
    // -- connection from switch to not gate
    this.connections.push(make_connection(this.components[6].output1, this.components[9].input1));
    // -- light bulb from not gate
    this.components.push(new Light(createVector(500, 10)));
    this.connections.push(make_connection(this.components[9].output1, this.components[10].input1));
    // not gate
    this.components.push(new NotGate(createVector(300, 160)));
    // -- connect not gate to self to test
    this.connections.push(make_connection(this.components[11].output1, this.components[11].input1));
    // and gate
    this.components.push(new AndGate(createVector(300, 250)));
    // -- switches for and gate
    this.components.push(new Switch(createVector(200, 200)));
    this.components.push(new Switch(createVector(200, 260)));
    // -- connect switches to and gate
    this.connections.push(make_connection(this.components[13].output1, this.components[12].input1));
    this.connections.push(make_connection(this.components[14].output1, this.components[12].input2));
    // -- connect and gate to light
    this.components.push(new Light(createVector(380, 200)));
    this.connections.push(make_connection(this.components[12].output1, this.components[15].input1));
    // nand gate
    this.components.push(new NandGate(createVector(500, 200)));
    // -- switches for nand gate
    this.components.push(new Switch(createVector(500, 260)));
    this.components.push(new Switch(createVector(500, 320)));
    // -- connect switches to and gate
    this.connections.push(make_connection(this.components[17].output1, this.components[16].input1));
    this.connections.push(make_connection(this.components[18].output1, this.components[16].input2));
    // -- connect nand gate to lights
    this.components.push(new Light(createVector(600, 200)));
    this.connections.push(make_connection(this.components[16].output1, this.components[19].input1));
    this.components.push(new Light(createVector(650, 200)));
    this.connections.push(make_connection(this.components[16].output1, this.components[20].input1));
    // or gate
    this.components.push(new OrGate(createVector(800, 260)));
    // -- switches for or gate
    this.components.push(new Switch(createVector(700, 200)));
    this.components.push(new Switch(createVector(700, 260)));
    // -- connect switches to and gate
    this.connections.push(make_connection(this.components[22].output1, this.components[21].input1));
    this.connections.push(make_connection(this.components[23].output1, this.components[21].input2));
    // conecting multiple gates together
    this.components.push(new AndGate(createVector(400, 350)));
    this.components.push(new OrGate(createVector(500, 400)));
    // -- connect or gate output to and gate
    this.connections.push(make_connection(this.components[24].output1, this.components[25].input1));
    // -- 3 switches, 2 for and gate and 1 for the or gate
    this.components.push(new Switch(createVector(350, 480)));
    this.components.push(new Switch(createVector(420, 480)));
    this.components.push(new Switch(createVector(480, 480)));
    // -- connect switches to or and and gates
    this.connections.push(make_connection(this.components[26].output1, this.components[24].input1));
    this.connections.push(make_connection(this.components[27].output1, this.components[24].input2));
    this.connections.push(make_connection(this.components[28].output1, this.components[25].input2));
    // -- attach not gate to output
    this.components.push(new NotGate(createVector(600, 450)));
    // -- connect or gate output to not gate
    this.connections.push(make_connection(this.components[25].output1, this.components[29].input1));
    // -- light bulb for output
    this.components.push(new Light(createVector(600, 350)));
    this.connections.push(make_connection(this.components[29].output1, this.components[30].input1));
    // nor gate
    this.components.push(new NorGate(createVector(50, 150)));
    // -- switches for nor gate
    this.components.push(new Switch(createVector(50, 220)));
    this.components.push(new Switch(createVector(50, 280)));
    // -- connect switches to nor gate
    this.connections.push(make_connection(this.components[32].output1, this.components[31].input1));
    this.connections.push(make_connection(this.components[33].output1, this.components[31].input2));
    // extended not gate to self test
    this.components.push(new NotGate(createVector(150, 450)));
    this.components.push(new NorGate(createVector(100, 400)));
    this.components.push(new NotGate(createVector(50, 350)));
    this.connections.push(make_connection(this.components[36].output1, this.components[35].input1));
    this.connections.push(make_connection(this.components[35].output1, this.components[34].input1));
    this.connections.push(make_connection(this.components[34].output1, this.components[36].input1));
    this.components.push(new Switch(createVector(200, 400)));
    this.connections.push(make_connection(this.components[37].output1, this.components[35].input2));
    // xor gate
    this.components.push(new XorGate(createVector(750, 10)));
    // -- switches for xor gate
    this.components.push(new Switch(createVector(580, 10)));
    this.components.push(new Switch(createVector(640, 10)));
    // -- connect switches to xor gate
    this.connections.push(make_connection(this.components[39].output1, this.components[38].input1));
    this.connections.push(make_connection(this.components[40].output1, this.components[38].input2));
    // xnor gate
    this.components.push(new XnorGate(createVector(750, 70)));
    // -- switch and button for xnor gate
    this.components.push(new Switch(createVector(580, 70)));
    this.components.push(new Button(createVector(660, 75)));
    // -- connect switch and button to xnor gate
    this.connections.push(make_connection(this.components[42].output1, this.components[41].input1));
    this.connections.push(make_connection(this.components[43].output1, this.components[41].input2));
    // clock signal
    this.components.push(new Clock(createVector(700, 350)));
    // -- another clock signal with 500ms period instead of 1000ms
    this.components.push(new Clock(createVector(700, 400)));
    this.components[45].period = 500;
    // -- and gate for clocks
    this.components.push(new AndGate(createVector(800, 370)));
    // -- connect clocks to and gate
    this.connections.push(make_connection(this.components[44].output1, this.components[46].input1));
    this.connections.push(make_connection(this.components[45].output1, this.components[46].input2));
    // constant true
    this.components.push(new TrueConstant(createVector(200, 340)));
    // constant false
    this.components.push(new FalseConstant(createVector(270, 340)));
    // 4 bit digit
    this.components.push(new FourBitDigit(createVector(350, 550)));
    // -- switches for 4 bit digit
    this.components.push(new Switch(createVector(50, 550)));
    this.components.push(new Switch(createVector(110, 550)));
    this.components.push(new Switch(createVector(170, 550)));
    this.components.push(new Switch(createVector(230, 550)));
    // -- connect switches to 4 bit digit
    this.connections.push(make_connection(this.components[50].output1, this.components[49].input1));
    this.connections.push(make_connection(this.components[51].output1, this.components[49].input2));
    this.connections.push(make_connection(this.components[52].output1, this.components[49].input3));
    this.connections.push(make_connection(this.components[53].output1, this.components[49].input4));
    // 8 bit digit
    this.components.push(new EightBitDigit(createVector(700, 460)));
    // -- switches for 8 bit digit
    for (let i = 0; i < 8; i ++) {
      this.components.push(new Switch(createVector(410 + (60 * i), 550)));
    }
    // -- connect switches to 8 bit digit
    for (let i = 0; i < 8; i ++) {
      this.connections.push(make_connection(this.components[55 + i].output1, this.components[54]["input" + (i + 1)]));
    }
    console.log("done with test objects");
  }
  
  update() {
    frame_millis = millis();
    hovering_on_obj = false;
    for (const i in this.items) {
      const group = this.items[i];
      for (const index in group) {
        const item = group[index];
        if (item.destroy_me != undefined && item.destroy_me) {
          group[index] = undefined;
          continue;
        }
        item.update();
      }
      this.items[i] = group;
      this.items[i] = this.items[i].filter((element) => {
        return element != undefined;
      });
    }
    for (const widget of this.gui) {
      widget.update();
    }
  }
  
  draw_grid(cell_size, cam) {
    push();
    if (this.dark_mode) {
      stroke(dark_grid_color) 
    } else {
      stroke(grid_color);
    }
    const shift = p5.Vector.div(cam, zoom);
    const shift_x = shift.x % cell_size;
    const shift_y = shift.y % cell_size;
    const add_some = cell_size * 3 * zoom;
    for (let y = shift_y - shift.y; 
         y < ((height + add_some) / zoom) + (shift_y - shift.y); 
         y += cell_size) {
      line(-shift.x, y, 
           ((width + add_some) / zoom) + (shift_x - shift.x), y);
    }
    for (let x = shift_x - shift.x; 
         x < ((width + add_some) / zoom) + (shift_x - shift.x); 
         x += cell_size) {
      line(x, -shift.y, x, 
           ((height + add_some) / zoom) + (shift_y - shift.y));
    }
    pop();
  }

  draw() {
    if (this.dark_mode) {
      background(dark_bg_color)
    } else {
      background(bg_color);
    }

    push();
    translate(camera);
    scale(zoom);

    this.draw_grid(grid_size, camera);
    
    for (const group of this.items) {
      for (const item of group) {
        item.draw();
      }
    }
    pop();

    
    push();
    for (const widget of this.gui) {
      widget.draw();
    }
    pop();

    if (show_mouse_coords) {
      push();
      translate(camera);
      scale(zoom);
      fill(0);
      textSize(12 / zoom);
      let string = Math.round((mouseX - camera.x) / zoom) + ", " + Math.round((mouseY - camera.y) / zoom);
      if (zoom !== 1) {
        string += " at " + zoom + "x";
      }
      text(string, (mouseX - camera.x) / zoom, (mouseY - camera.y) / zoom);
      pop();
    }
  }
}
