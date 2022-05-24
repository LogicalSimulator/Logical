"use strict";

const bg_color = 220;
const dark_bg_color = 56;
const grid_color = 240;
const dark_grid_color = 100;

const hover_color = [127, 255, 0];
const right_click_color = [255, 127, 80];

const grid_size = 20;

const make_testing_objs = true;
const test_export_import = true;
const draw_component_bounds = false;

const show_mouse_coords = true;
const zoom_sensitivity = 0.1;
let zoom_min = 0.1;
let zoom_max = 5;

const hovering = [];

let right_clicked = undefined;

let frame_millis = 0;
let frame_sub = 0;
let last_frame_sub = 0;

let camera;
let zoom = 1; // 1 For 1280:720 resolutions

const NONE_MODE = 0;
const PAN_MODE = 1;
const ITEM_MODE = 2;
const ADD_MODE = 3;
const CONNECT_MODE = 4;

let mouse_mode = PAN_MODE;

const add_item_top_pad = 30;
const menu_outside_pad = 10;
const menu_button_width = 100;
const menu_button_height = 30;

let snap_to_grid = false;

const components = [
  Switch, Button, Clock, TrueConstant, FalseConstant,
  Light, FourBitDigit, EightBitDigit, BufferGate,
  NotGate, OrGate, NorGate, AndGate, 
  NandGate, XorGate, XnorGate, Note
];

const dialog_message_names = [
  "message_dialog_import_success_clipboard",
  "message_dialog_import_failed_clipboard",
  "message_dialog_import_failed_import",
  "message_dialog_export_success_clipboard",
  "message_dialog_export_failed_clipboard"
]

/* TODO:
- Fix icon file's weird transparency (set to 1 bit alpha???)
- Format this code base with some tool
- Website and move this to /editor path
*/

class Game {
  constructor() {
    this.graphics = createGraphics(width, height);
    
    this.connections = [];
    this.connect_points = [];
    this.components = [];
    this.gui = [];
    this.items = [this.connections, this.connect_points, this.components];
    
    this.dark_mode = false;
    this.drag_component = undefined;
    this.selected_component = undefined;
    this.creating_new_component = false;
    this.new_component = undefined;
    this.drag_connection = undefined;
    this.multi_selections = [];
    this.multi_selecting = false;
    this.multi_select_origin = undefined;
    this.play = true;
    this.can_reset = true;
    this.update_cycles_left = -1;
    this.panned = false;
    this.panned_prev = createVector()
    this.rotate_button_pressed = false
    this.copy_selected = []
    this.export_box = undefined
    this.import_box = undefined
    this.grey_out = false
    
    frame_millis = millis();
    frame_sub = millis();
    last_frame_sub = millis();

    camera = createVector(0, 0);
    
    hovering.length = 0;

    this.make_gui();
    this.initalize_dom();

    if (make_testing_objs) {
      this.make_testing_objects();  
    }

    if (test_export_import) {
      this.import_game_state(this.export_game_state());
    }
  }

  make_gui() {
    let main_group;
    let sub_group;
    if (make_vertical) {
      main_group = VerticalWidgetGroup;
      sub_group = HorizontalWidgetGroup;
    } else {
      main_group = HorizontalWidgetGroup;
      sub_group = VerticalWidgetGroup;
    }
    this.side_group = new main_group();

    const button_names = {
      "Switch": {"image": Icons.switch_icon, "callback": () => {this.add_component(0)}},
      "Button": {"image": Icons.button_icon, "callback": () => {this.add_component(1)}},
      "Clock": {"image": Icons.clock_icon, "callback": () => {this.add_component(2)}},
      "True\nconstant": {"image": Icons.true_constant_icon, "callback": () => {this.add_component(3)}},
      "False\nconstant": {"image": Icons.false_constant_icon, "callback": () => {this.add_component(4)}},
      "Light": {"image": Icons.light_icon, "callback": () => {this.add_component(5)}},
      "4 bit\ndisplay": {"image": Icons.four_bit_display_icon, "callback": () => {this.add_component(6)}},
      "8 bit\ndisplay": {"image": Icons.eight_bit_display_icon, "callback": () => {this.add_component(7)}},
      "Buffer gate": {"image": Icons.buffer_gate_icon, "callback": () => {this.add_component(8)}},
      "NOT gate": {"image": Icons.not_gate_icon, "callback": () => {this.add_component(9)}},
      "OR gate": {"image": Icons.or_gate_icon, "callback": () => {this.add_component(10)}},
      "NOR gate": {"image": Icons.nor_gate_icon, "callback": () => {this.add_component(11)}},
      "AND gate": {"image": Icons.and_gate_icon, "callback": () => {this.add_component(12)}},
      "NAND gate": {"image": Icons.nand_gate_icon, "callback": () => {this.add_component(13)}},
      "XOR gate": {"image": Icons.xor_gate_icon, "callback": () => {this.add_component(14)}},
      "XNOR gate": {"image": Icons.xnor_gate_icon, "callback": () => {this.add_component(15)}}
    };
    
    const buttons = [];

    for (const key of Object.keys(button_names)) {
      const button = create_button("", 0, 0, 0, 0, button_names[key]["callback"]);
      button.clickable.cornerRadius = 0;
      button.clickable.strokeWeight = 0;
      button.clickable.image = button_names[key]["image"];
      button.clickable.fitImage = true;
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
      camera.x = this.side_group.width;
    } else {
      this.side_group.width = width;
      this.side_group.height = 100;
      this.side_group.x_pad = -1;
      camera.y = this.side_group.height;
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

    this.rotate_button = create_button("Rotate", 0, 0, 0, 0, () => {this.rotate_selected_component(PI / 2);});
    this.delete_button = create_button("Delete", 0, 0, 0, 0, () => {this.destroy_selected_component();});
    this.copy_button = create_button("Copy", 0, 0, 0, 0, () => {this.copy_selection();});
    this.paste_button = create_button("Paste", 0, 0, 0, 0, () => {this.paste_selection();});
    // this.export_button = create_button("Export", 0, 0, 0, 0, () => {this.make_export_box()});
    // this.import_button = create_button("Import", 0, 0, 0, 0, () => {});
    this.menu_group = new sub_group(
      [
        // this.export_button,
        // this.import_button,
        this.copy_button, 
        this.paste_button,
        this.rotate_button,
        this.delete_button,
        create_button("Menu", 0, 0, 0, 0, () => {this.show_menu();})
      ]
    );
    
    if (make_vertical) {
      this.menu_group.x_pad = 5;
      this.menu_group.width = menu_button_width * this.menu_group.widgets.length;
      this.menu_group.height = menu_button_height;
      this.menu_group.x = width - this.menu_group.width - menu_outside_pad + this.menu_group.x_pad;
      this.menu_group.y = this.side_group.y + menu_outside_pad;
    } else {
      this.menu_group.y_pad = 5;
      this.menu_group.width = menu_button_width;
      this.menu_group.height = menu_button_height * this.menu_group.widgets.length;
      this.menu_group.x = this.side_group.x + menu_outside_pad;
      this.menu_group.y = height - this.menu_group.height - menu_outside_pad + this.menu_group.y_pad;
    }

    this.gui.push(this.menu_group);

    this.menu_line = new WidgetLine();
    this.menu_line.stroke = 0;
    if (make_vertical) {
      this.menu_line.x = this.menu_group.x - 5;
      this.menu_line.y = this.menu_group.y;
      this.menu_line.width = 0;
      this.menu_line.height = this.menu_group.height;
    } else {
      this.menu_line.x = this.menu_group.x;
      this.menu_line.y = this.menu_group.y - 5;
      this.menu_line.width = this.menu_group.width;
      this.menu_line.height = 0;
    }
    this.gui.push(this.menu_line);

    this.set_specific_button = create_button("Set specific", 0, 0, 0, 0, () => {
      if (this.selected_component instanceof Clock) {
        this.set_period_of_selected_component();
      } else if (this.selected_component instanceof Note) {
        this.set_note_value();
      }
    });
    this.create_comment_button = create_button("Make note", 0, 0, 0, 0, () => {this.add_component(16)});
    this.play_pause_button = create_button("Pause", 0, 0, 0, 0, () => {this.toggle_play_pause_simulation();});
    this.step_button = create_button("Step", 0, 0, 0, 0, () => {this.step_simulation();});
    this.reset_button = create_button("Reset", 0, 0, 0, 0, () => {this.reset_simulation();});
    this.control_group = new sub_group(
      [
        this.set_specific_button,
        this.create_comment_button,
        this.play_pause_button,
        this.step_button,
        this.reset_button
      ]
    );
    
    if (make_vertical) {
      this.control_group.x_pad = 5;
      this.control_group.width = menu_button_width * this.control_group.widgets.length;
      this.control_group.height = menu_button_height;
      this.control_group.x = this.menu_group.x - 5 - this.menu_line.stroke_weight - this.control_group.width;
      this.control_group.y = this.side_group.y + menu_outside_pad;
    } else {
      this.control_group.y_pad = 5;
      this.control_group.width = menu_button_width;
      this.control_group.height = menu_button_height * this.control_group.widgets.length;
      this.control_group.x = this.side_group.x + menu_outside_pad;
      this.control_group.y = this.menu_group.y - 5 - this.menu_line.stroke_weight - this.control_group.height;
    }
    this.gui.push(this.control_group);
  }
  
  resize_gui() {
    this.graphics.resizeCanvas(windowWidth - window_diff, windowHeight - window_diff);
    if (this.side_group instanceof VerticalWidgetGroup) {
      this.side_group.height = height;
      this.button_line.height = this.side_group.height;
      this.menu_group.x = width - this.menu_group.width - menu_outside_pad + this.menu_group.x_pad;
      this.menu_group.y = this.side_group.y + menu_outside_pad;
      this.menu_line.x = this.menu_group.x - 5;
      this.menu_line.y = this.menu_group.y;
      this.control_group.x = this.menu_group.x - 5 - this.menu_line.stroke_weight - this.control_group.width;
      this.control_group.y = this.side_group.y + menu_outside_pad;
    } else {
      this.side_group.width = width;
      this.button_line.width = this.side_group.width;
      this.menu_group.x = this.side_group.x + menu_outside_pad;
      this.menu_group.y = height - this.menu_group.height - menu_outside_pad + this.menu_group.y_pad;
      this.menu_line.x = this.menu_group.x;
      this.menu_line.y = this.menu_group.y - 5;
      this.control_group.x = this.side_group.x + menu_outside_pad;
      this.control_group.y = this.menu_group.y - 5 - this.menu_line.stroke_weight - this.control_group.height;
    }
  }

  initalize_dom() {
    this.dialog_menu = document.getElementById("dialog_menu");
    this.dialog_menu.addEventListener("close", () => {this.hide_menu();});
    this.dialog_import = document.getElementById("dialog_import");
    this.dialog_import.addEventListener("close", () => {this.hide_import_menu();});
    this.dialog_export = document.getElementById("dialog_export");
    this.dialog_export.addEventListener("close", () => {this.hide_export_menu();});
    this.dialog_clock_period = document.getElementById("dialog_clock_period");
    this.dialog_clock_period.addEventListener("close", () => {this.hide_clock_period_menu();});
    this.dialog_note = document.getElementById("dialog_note");
    this.dialog_note.addEventListener("close", () => {this.hide_note_menu();});
    this.input_code = document.getElementById("input_code");
    this.output_code = document.getElementById("output_code");
    this.clock_period_code = document.getElementById("clock_period_code");
    this.note_code = document.getElementById("note_code");
    this.dialog_messages = {};
    for (name of dialog_message_names) {
      this.dialog_messages[name] = document.getElementById(name);
    }
    this.copy_export_button = document.getElementById("copy_export_button");
    this.copy_export_button.addEventListener("click", (event) => {
      copyTextToClipboard(
        this.output_code.value, 
        () => {  // success
          this.show_message("message_dialog_export_success_clipboard");
        },
        () => {  // fail
          this.show_message("message_dialog_export_failed_clipboard");
        }
      );
    });
    this.copy_import_button = document.getElementById("copy_import_button");
    this.copy_import_button.addEventListener("click", (event) => {
      readTextFromClipboard(
        (text) => {  // success
          this.input_code.value = text;
          this.show_message("message_dialog_import_success_clipboard");
        }, 
        () => {  // fail
          this.show_message("message_dialog_import_failed_clipboard");
        }
      );
    });
  }

  show_message(show_name) {
    for (key in this.dialog_messages) {
      this.dialog_messages[key].hidden = true;
    }
    if (show_name != undefined){
      setTimeout(() => {
        this.dialog_messages[show_name].hidden = false;
      }, 100);
    }
  }

  show_menu() {
    this.show_message(undefined);
    this.dialog_menu.showModal();
    this.grey_out = true;
  }

  hide_menu() {
    this.dialog_menu.close();
    this.grey_out = false;
    // console.log(this.dialog_menu.returnValue);
    if (this.dialog_menu.returnValue === "import") {
      this.show_import_menu();
    } else if (this.dialog_menu.returnValue === "export") {
      this.show_export_menu();
    }
  }

  show_import_menu() {
    this.input_code.value = "";
    this.dialog_import.showModal();
    this.grey_out = true;
    this.show_message(undefined);
  }

  hide_import_menu() {
    this.dialog_import.close();
    this.grey_out = false;
    if (this.dialog_import.returnValue === "import") {
      try {
        this.import_game_state(this.input_code.value);
        // alert("Import successful!");
      } catch {
        this.show_import_menu();
        this.show_message("message_dialog_import_failed_import");
        // alert("Failed to import!");
      }
    } else {
      this.show_menu();
    }
    // console.log(this.dialog_import.returnValue);
  }

  show_export_menu() {
    this.dialog_export.showModal();
    this.grey_out = true;
    this.show_message(undefined);
    this.output_code.value = this.export_game_state();
  }

  hide_export_menu() {
    this.dialog_export.close();
    this.grey_out = false;
    this.show_menu();
    // console.log(this.dialog_export.returnValue);
  }

  show_clock_period_menu() {
    this.clock_period_code.value = this.selected_component.period;
    this.dialog_clock_period.showModal();
    this.grey_out = true;
  }

  hide_clock_period_menu() {
    this.dialog_clock_period.close();
    this.grey_out = false;
    if (this.dialog_clock_period.returnValue === "submit") {
      this.selected_component.period = this.clock_period_code.value;
    }
    this.selected_component = undefined;
    // console.log(this.dialog_note.returnValue);
  }
  
  show_note_menu() {
    this.note_code.value = this.selected_component.note_text;
    this.dialog_note.showModal();
    this.grey_out = true;
  }

  hide_note_menu() {
    this.dialog_note.close();
    this.grey_out = false;
    if (this.dialog_note.returnValue === "submit") {
      this.selected_component.note_text = this.note_code.value;
    }
    this.selected_component = undefined;
    // console.log(this.dialog_note.returnValue);
  }
  
  add_component(c) {
    if (mouse_mode != ADD_MODE) {
      return;
    }
    this.creating_new_component = true;
    this.drag_component = new components[c](
      createVector(
        (mouseX - camera.x) / zoom, 
        (mouseY - camera.y) / zoom
      )
    );
    this.drag_component.pos.sub(p5.Vector.div(this.drag_component.size, 2));
    // mouse_mode = ITEM_MODE;
    this.items[2].push(this.drag_component);
  }

  destroy_selected_component() {
    if (this.selected_component instanceof Component) {
      destroy_component(this.selected_component); 
    } else if (this.selected_component instanceof Connection) {
      destroy_connection(this.selected_component);
    } else if (this.multi_selections.length > 0){
      for (let comp of this.multi_selections){
        destroy_component(comp)
      }
    }
    this.selected_component = undefined;
  }

  rotate_selected_component(rads) {
    this.rotate_button_pressed = true;
    // Shift
    let rev = keyIsDown(16) ? -1 : 1;
    if (this.multi_selections.length > 0) {
      let avg = createVector();
      let center_avg = createVector();
      for (let comp of this.multi_selections) {
        avg.add(comp.pos);
        center_avg.add(comp.center_coord);
        comp.angle += rev * rads;
      }
      avg.div(this.multi_selections.length);
      center_avg.div(this.multi_selections.length);
      for (let comp of this.multi_selections) {
        let diff = p5.Vector.sub(comp.pos, avg);
        // const center_diff = p5.Vector.sub(comp.center_coord, center_avg);
        // const off_center = p5.Vector.sub(comp.center_coord,comp.get_poly_verts()[0])
        comp.pos = rotate_to_real(avg, diff, rev * PI / 2);
      }
    } else if (this.selected_component instanceof Component) {
      this.selected_component.angle += rev * rads;
    }
  }

  set_period_of_selected_component() {
    this.show_clock_period_menu();
    // while (true) {
    //   const result = prompt("Set the period of the clock: (milliseconds)", 
    //                       this.selected_component.period);
    //   if (result != null && result.length > 0) {
    //     const int_result = parseInt(result, 10);
    //     if (isNaN(int_result)) {
    //       alert("Period must be a number greater than 0!");
    //     } else if (int_result <= 0) {
    //       alert("Period can not be less than or equal to 0!");
    //     } else {
    //       this.selected_component.period = int_result;
    //       break;
    //     }
    //   } else {
    //     break;
    //   }
    // }
    // this.selected_component = undefined;
  }

  set_note_value() {
    this.show_note_menu();
    // while (true) {
    //   const result = prompt("Set the text of the note", 
    //                         this.selected_component.note_text);
    //   if (result != null && result.length > 0) {
    //     this.selected_component.note_text = result;
    //     break;
    //   } else {
    //     break;
    //   }
    // }
    // this.selected_component = undefined;
  }
  
  toggle_play_pause_simulation() {
    this.play = !this.play;
  }

  step_simulation() {
    this.update_cycles_left = 1;
  }

  reset_simulation() {
    if (!this.can_reset) {
      return;
    }
    this.import_game_state(this.export_game_state());
    this.can_reset = false;
  }
  
  destroy_all_components() {
    this.connections.length = 0;
    this.connect_points.length = 0;
    this.components.length = 0;
    this.items = [this.connections, this.connect_points, this.components];
    this.drag_component = undefined;
    this.selected_component = undefined;
    this.creating_new_component = false;
    this.new_component = undefined;
    this.drag_connection = undefined;
    hovering.length = 0;
  }

  export_game_state() {
    this.connections = this.items[0];
    this.connect_points = this.items[1];
    this.components = this.items[2];
    this.items = [this.connections, this.connect_points, this.components];
    return export_game(this.connections, this.connect_points, this.components);
  }

  import_game_state(json) {
    const import_obj = import_game(json);
    this.connections = import_obj["connections"];
    this.connect_points = import_obj["connection_points"];
    this.components = import_obj["components"];
    this.items = [this.connections, this.connect_points, this.components];
    this.connections = this.items[0];
    this.connect_points = this.items[1];
    this.components = this.items[2];
  }
  
  get_hover_component(distance) {
    let allOverlaps = []
    for (let comp of this.items[2]) {
      if (comp.mouse_overlapping()) {
        allOverlaps.push(comp)
      }
    }
    // Get the one closest
    let return_comp = undefined
    if (allOverlaps.length > 0){
      let closest = 99999
      return_comp = allOverlaps[0]
      for (let comp of allOverlaps){
        let centerPosX = comp.center_coord.x * zoom + camera.x
        let centerPosY= comp.center_coord.y * zoom + camera.y
        let d = dist(mouseX,mouseY,centerPosX,centerPosY)
        if (d < distance){
          return_comp = comp
          closest = d
        }
      }
    }
    
    return return_comp
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

  copy_selection() {
    this.copy_selected = []
    this.copy_selected = [...this.multi_selections];
    for (let comp of this.multi_selections){
      //this.copy_selected.push(new comp.constructor(comp.pos))
    }
    if (this.selected_component instanceof Component) {
      this.copy_selected.push(this.selected_component);
    }
  }

  paste_selection() {
    this.multi_selections = [];
    for (const comp of this.copy_selected) {
      const new_comp = new comp.constructor(p5.Vector.add(comp.pos, createVector(30, 30)));
      this.items[2].push(new_comp);
      this.items[2][this.items[2].length-1].angle = comp.angle
      this.multi_selections.push(this.items[2][this.items[2].length-1]);
    }
    for (const i in this.multi_selections) {
      const old_comp = this.copy_selected[i];
      const new_comp = this.multi_selections[i];

      const conn_out_pt_names = get_component_output_connect_point_names(old_comp);
      for (const name of conn_out_pt_names) {
        for (const conn of old_comp[name].connections) {
          if (conn == undefined) {
            continue;
          }
          const to_new_comp = this.multi_selections[this.copy_selected.indexOf(conn.to_point.parent)];
          const to_new_comp_name = conn.to_point.set_name.replace("_state", "");
          // console.log(to_new_comp);
          // console.log(to_new_comp_name);
          //console.log(name,to_new_comp_name)
          try {
            this.items[1].push(make_connection(new_comp[name], to_new_comp[to_new_comp_name]));
          } catch {
            
          }
        }
      }
    }
    //this.copy_selected = [...this.multi_selections]
  }

  on_mouse_press() {
    // if (this.grey_out){
    //   if (!collidePointRect(mouseX,mouseY,
    //                       this.export_button.x,this.export_button.y,
    //                       this.export_button.width,this.export_button.height)){
    //     this.grey_out = false
    //     this.export_button.remove()
    //   }
    //   return
    // }
    if (this.grey_out) {
      return;
    }
    let mp = createVector((mouseX - camera.x) / zoom, (mouseY - camera.y) / zoom);
    let mouse_on_multi = false;
      for (let comp of this.multi_selections){
        if (comp.mouse_overlapping()){
          mouse_on_multi = true
          break
        }
      }
    if (mouseButton === LEFT) {
      this.panned_prev = camera.copy()
      
      let hover_con;
      for (let comp of this.items[2]) {
        hover_con = this.get_hover_connect_point(comp);
        if (!(hover_con instanceof ConnectionOutPoint)) {
          hover_con = undefined;
        }
        if (hover_con != undefined) {
          break;
        } 
      }
      //--
      
      //console.log(mouse_on_multi)
      if (hovering_on_button()) {
        mouse_mode = ADD_MODE;
      } else if (keyIsDown(17)){
        this.multi_select_origin = mp.copy()        
      } else if (this.multi_select_origin != undefined){
        
      } else if (mouse_on_multi){
        mouse_mode = ITEM_MODE
      } else if (hover_con != undefined) {
        this.drag_connection = hover_con;
        this.selected_component = undefined;
        this.multi_selections = [];
        mouse_mode = CONNECT_MODE;
      } else if (hovering.length > 0 && this.multi_selections.length == 0) {
        mouse_mode = ITEM_MODE;
        // this.drag_component = this.get_hover_component(30);
        this.drag_component = hovering[0];
        for (let comp of hovering){
          if (comp instanceof Component){
            this.drag_component = comp
          }
        }
        this.selected_component = undefined;
        this.multi_selections = [];
        //let mp = createVector((mouseX - camera.x) / zoom, (mouseY - camera.y) / zoom);
        //this.drag_component.mouse_select_pos_diff = p5.Vector.sub(this.drag_component.center_coord, mp);
        //this.drag_component.pos = mp;
        //console.log(this.drag_component.mouse_select_pos_diff)
      } else {
        //console.log("panMode"+mouse_on_multi)
        mouse_mode = PAN_MODE;
        this.selected_component = undefined;
        this.multi_selections = [];
      }

      if (this.multi_select_origin == undefined && !mouse_on_multi){
        // this.multi_selections = []
      }
    } else if (mouseButton === RIGHT) {
      if (this.drag_component !== hovering[0]) {
        if (keyIsDown(16) && hovering[0] instanceof Component) {
          const index_multi_selections = this.multi_selections.indexOf(hovering[0]);
          if (index_multi_selections != -1) {
            this.multi_selections.splice(index_multi_selections, 1);
          } else {
            this.multi_selections.push(hovering[0]);
          }
        } else {
        this.selected_component = hovering[0];
        }
      } 
      else {
        this.multi_select_origin = mp.copy()
        this.selected_component = undefined;
        this.multi_selections = [];
      }
      
    }
    return false;
  }
  
  on_mouse_drag() {
    // if (mouse_mode == ADD_MODE){
    //   if (this.creating_new_component) {
    //     let mp = createVector((mouseX - camera.x) / zoom, (mouseY - camera.y) / zoom);
    //     this.items[1][this.items[1].length-1].set_pos_center(mp)
    //   }
    // }
    if (this.grey_out) {
      return;
    } else if (mouse_mode === ADD_MODE && this.multi_select_origin == undefined) {
      if (this.drag_component != undefined) {
        this.drag_component.pos.add(createVector(movedX / zoom, movedY / zoom));
      }      
    } else if (hovering.length > 0) {
      if (mouse_mode === ITEM_MODE && 
          mouseIsPressed && 
          this.drag_component instanceof Component && this.multi_selections.length == 0) {
        // let mp = createVector((mouseX - camera.x) / zoom, (mouseY - camera.y) / zoom);
        // this.drag_component.set_pos_center(mp)
        // this.drag_component.pos = mp;
        this.drag_component.pos.add(createVector(movedX / zoom, movedY / zoom));
      } else if (mouse_mode === ITEM_MODE && 
          mouseIsPressed && this.multi_selections.length > 0){

        for (let comp of this.multi_selections){
          comp.pos.add(createVector(movedX / zoom, movedY / zoom))
        }
      }
    } else {
      if (mouse_mode === PAN_MODE && this.multi_select_origin == undefined) {
        camera.add(createVector(movedX, movedY));
      }
    }
    return false;
  }

  on_mouse_release() {
    if (this.grey_out) {
      return;
    }
    if (camera.x != this.panned_prev.x || camera.y != this.panned_prev.y || this.rotate_button_pressed || keyIsDown(16)){
      this.rotate_button_pressed = false
    }
    else if (mouse_mode != ITEM_MODE){
      this.multi_selections = []
    }
    const m_pos = createVector(mouseX, mouseY);
    m_pos.sub(camera);
    m_pos.div(zoom);
    if (this.multi_select_origin != undefined){
      for (let comp of this.multi_selections){
        
      }
      this.multi_selections = []
      if (this.multi_select_origin != undefined){
        let diff = p5.Vector.sub(m_pos,this.multi_select_origin)
        let rect_verts = [this.multi_select_origin,
                         p5.Vector.add(this.multi_select_origin,createVector(diff.x,0)),
                         p5.Vector.add(this.multi_select_origin,createVector(diff.x,diff.y)),
                         p5.Vector.add(this.multi_select_origin,createVector(0,diff.y))]
        for (let comp of this.items[2]){
          let verts = comp.get_poly_verts()
          if (collidePolyPoly(verts,rect_verts,true)){
            this.multi_selections.push(comp)
          }
        }
        if (this.selected_component != undefined && this.selected_component instanceof Component){
          this.multi_selections.push(this.selected_component)
        }
      }
    }
    if (this.drag_connection != undefined) {
      let hover_con = undefined;
      for (let comp of this.items[2]) {
        hover_con = this.get_hover_connect_point(comp);
        if (hover_con != undefined) {
          break;
        } 
      }
      if (((this.drag_connection instanceof ConnectionOutPoint) && 
           (hover_con instanceof ConnectionInPoint))) {
        this.items[0].push(make_connection(this.drag_connection, hover_con));
      }
    }
    //console.log(this.multi_selections.length)
    if (this.drag_component != undefined){
      this.selected_component = this.drag_component
    }
    this.multi_select_origin = undefined
    this.drag_connection = undefined;
    this.creating_new_component = false;
    this.drag_component = undefined;
    this.mouse_mode = NONE_MODE;
    return false;
  }
  
  mouse_clicked() {
    if (this.grey_out) {
      return;
    } else {
      for (let comp of this.components) {
        comp.mouse_clicked();
      }
    }
  }

  on_mouse_wheel(event) {
    if (this.grey_out) {
      return;
    } else if (hovering_on_button()) {
      
    } else {
      let scale_factor;
      
      if (event.deltaY > 0) {
        scale_factor = 1 - zoom_sensitivity;
      } else {
        scale_factor = 1 + zoom_sensitivity;
      }
  
      // https://stackoverflow.com/a/70660569/10291933

      const new_zoom = zoom * scale_factor;
      if (new_zoom > zoom_min && new_zoom < zoom_max) {
        zoom *= scale_factor;
        zoom = Math.min(Math.max(zoom, zoom_min), zoom_max);
  
        let mp = createVector((mouseX - camera.x) / zoom, (mouseY - camera.y) / zoom)
        camera.x = mouseX - (mouseX * scale_factor) + (camera.x * scale_factor);
        camera.y = mouseY - (mouseY * scale_factor) + (camera.y * scale_factor);
      }
    }
    
    return false;
  }

  key_pressed(code) {
    // backspace or "d" key
    if (!this.grey_out) {
      if (code === 8 || code === 68) {
        if (this.delete_button.enabled) {
          this.destroy_selected_component();
        }
      }
      if (this.rotate_button.enabled) {
        // "r" key
        if (code === 82) {
          // shift key
          this.rotate_selected_component(PI/2)
        }
      }
      if (this.play_pause_button.enabled) {
        // "p" key
        if (code === 80) {
          this.toggle_play_pause_simulation();
        }
      }
      if (this.step_button.enabled) {
        // "s" key
        if (code === 83) {
          this.step_simulation();
        }
      }
  
      // Copy-paste
      if (code == 67) {
        if (keyIsDown(17)) {
          console.log("COPY");
          this.copy_selection();
        }
      } else if (code == 86) {
        if (keyIsDown(17)) {
          console.log("PASTE");
          this.paste_selection();
        }
      } else if (code == 83) {
        navigator.clipboard.writeText(this.export_game_state());
      } else if (code == 65) {
        if (keyIsDown(17)) {
          for (let comp of this.items[2]) {
            this.multi_selections.push(comp);
          }
        }
      }
    }
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
    this.components.push(new Note(createVector(150, 140)))

    console.log("done with test objects");
  }
  
  update() {
    const update = this.update_cycles_left === -1 || 
                   this.update_cycles_left > 0;
    frame_millis = millis() - frame_sub;
    if (!update) {
      frame_sub += millis() - last_frame_sub;
    }
    last_frame_sub = millis();
    hovering.length = 0;
    for (const i in this.items) {
      const group = this.items[i];
      // let did_destroy = false;
      for (const index in group) {
        const item = group[index];
        if (item.destroy_me != undefined && item.destroy_me) {
          console.log("destroying item " + item);
          group[index] = undefined;
          // did_destroy = true;
          continue;
        }
        if (this.grey_out) {
          
        } else if (update) {
          item.update();
        } else if (item.handle_mouse != undefined) {
          item.handle_mouse();
        }
        if (item instanceof Component) {
          if (snap_to_grid) {
            item.pos.x = round(item.pos.x / grid_size) * grid_size;
            item.pos.y = round(item.pos.y / grid_size) * grid_size;
          }
        }
      }
      this.items[i] = group;
      // if (did_destroy) {
        this.items[i] = this.items[i].filter((element) => {
          return element != undefined;
        });
      // }
      this.update_cycles_left --;
      this.can_reset = true;
    }
    this.copy_button.enabled = this.selected_component instanceof Component ||
                               this.multi_selections.length > 0;
    this.paste_button.enabled = this.copy_selected.length > 0;
    this.delete_button.enabled = this.selected_component instanceof Component || 
                                 this.selected_component instanceof Connection || 
                                 this.multi_selections.length > 0;
    this.rotate_button.enabled = this.multi_selections.length > 0 || 
                                 this.selected_component instanceof Component;
    this.play_pause_button.clickable.text = this.play ? "Pause" : "Play";
    if (this.play) {
      this.update_cycles_left = -1;
    } else {
      this.update_cycles_left = 0;
    }
    this.step_button.enabled = !this.play && this.update_cycles_left === 0;
    this.reset_button.enabled = this.can_reset;
    this.create_comment_button.enabled = this.selected_component == undefined;
    if (this.selected_component instanceof Clock) {
      this.set_specific_button.invisible = false;
      this.set_specific_button.clickable.text = "Set clock period";
    } else if (this.selected_component instanceof Note) {
      this.set_specific_button.invisible = false;
      this.set_specific_button.clickable.text = "Set note text";
    } else {
      this.set_specific_button.invisible = true;
    }
    for (const widget of this.gui) {
      widget.update();
    }
  }
  
  draw_grid(cell_size, cam) {
    this.graphics.push();
    if (this.dark_mode) {
      this.graphics.stroke(dark_grid_color) 
    } else {
      this.graphics.stroke(grid_color);
    }
    
    const shift = p5.Vector.div(cam, zoom);
    const shift_x = shift.x % cell_size;
    const shift_y = shift.y % cell_size;
    const add_some = cell_size * 3 * zoom;
    for (let y = shift_y - shift.y; 
         y < ((height + add_some) / zoom) + (shift_y - shift.y); 
         y += cell_size) {
      this.graphics.line(-shift.x, y, 
                        ((width + add_some) / zoom) + (shift_x - shift.x), y);
    }
    for (let x = shift_x - shift.x; 
         x < ((width + add_some) / zoom) + (shift_x - shift.x); 
         x += cell_size) {
      this.graphics.line(x, -shift.y, x, 
                        ((height + add_some) / zoom) + (shift_y - shift.y));
    }
    this.graphics.pop();
  }

  draw() {
    if (this.dark_mode) {
      this.graphics.background(dark_bg_color)
    } else {
      this.graphics.background(bg_color);
    }

    this.graphics.push();
    this.graphics.translate(camera);
    
    this.graphics.scale(zoom);
    this.draw_grid(grid_size, camera);
    const m_pos = createVector(mouseX, mouseY);
    m_pos.sub(camera);
    m_pos.div(zoom);

    if (this.drag_connection != undefined) {
      this.graphics.push();
      this.graphics.strokeWeight(1);
      this.graphics.stroke(0);
      const from_point = this.drag_connection.pos.copy();
      // from_point.mult(zoom);
      // from_point.add(camera);
      // this.graphics.push();
      // this.graphics.strokeWeight(5);
      // this.graphics.stroke(255, 0, 0);
      // this.graphics.point(from_point.x, from_point.y);
      // this.graphics.pop();
      
      // this.graphics.push();
      // this.graphics.strokeWeight(5);
      // this.graphics.stroke(255, 255, 0);
      // this.graphics.point(m_pos.x, m_pos.y);
      // this.graphics.pop();
      this.graphics.line(from_point.x, from_point.y, m_pos.x, m_pos.y);
      this.graphics.pop();
    }
    
    for (const group of this.items) {
      for (const item of group) {
        if (item === this.selected_component || this.multi_selections.includes(item)) {
          item.draw(this.graphics, right_click_color);
        } else if (hovering.indexOf(item) != -1) {
          item.draw(this.graphics, hover_color);
        } else {
          item.draw(this.graphics);
        }
        // if (item === this.drag_component) {
        //   console.log("look it's me " + item);
        // }
      }
    }
    if (this.multi_select_origin != undefined) {
      this.graphics.rectMode(CORNER);
      this.graphics.fill(3, 227, 252, 30);
      //this.graphics.circle(this.multi_select_origin.x,this.multi_select_origin.y,30);
      let diff = p5.Vector.sub(m_pos,this.multi_select_origin);
      this.graphics.rect(this.multi_select_origin.x,this.multi_select_origin.y,
                        diff.x,diff.y);
      let rect_verts = [this.multi_select_origin,
                       p5.Vector.add(this.multi_select_origin,createVector(diff.x,0)),
                       p5.Vector.add(this.multi_select_origin,createVector(diff.x,diff.y)),
                       p5.Vector.add(this.multi_select_origin,createVector(0,diff.y))];
      for (let comp of this.items[2]) {
        let verts = comp.get_poly_verts();
        if (collidePolyPoly(verts,rect_verts,true)) {
          this.graphics.fill(0,255,255,100);
          this.graphics.beginShape();
          for (const { x, y } of verts) {
            vertex(x, y)
          }
          this.graphics.endShape(CLOSE);
        }
      }
    }
    for (let comp of this.multi_selections) {
      let verts = comp.get_poly_verts();
      this.graphics.fill(255,0,0,100)
      this.graphics.beginShape();
      //for (const { x, y } of verts)  vertex(x, y);
      this.graphics.endShape(CLOSE);
    }
    this.graphics.pop();
    
    
    image(this.graphics, 0, 0);

    if (!this.grey_out) {
      push();
      for (const widget of this.gui) {
        widget.draw();
      }
      pop();
    }

    if (show_mouse_coords) {
      push();
      translate(camera);
      scale(zoom);
      fill(0);
      textSize(12 / zoom);
      let string = Math.round((mouseX - camera.x) / zoom) + ", " + Math.round((mouseY - camera.y) / zoom);
      if (zoom !== 1) {
        string += " at " + (Math.round(zoom * 10) / 10) + "x";
      }
      string += " at frame " + Math.round(frame_millis) + " sub " + Math.round(frame_sub);
      // string += " hovering " + hovering.length;
      text(string, (mouseX - camera.x) / zoom, (mouseY - camera.y) / zoom);
      pop();
    }
    if (this.grey_out){
      push()
      fill(100,100,100,150)
      rect(0,0,width,height)
      pop()
    }
  }
}
