class Widget {
  constructor() {
    this._x = 0;
    this._y = 0;
    this._width = 0;
    this._height = 0;
    this._enabled = true;
  }

  get x() {
    return this._x;
  }

  set x(x) {
    this._x = x;
  }

  get y() {
    return this._y;
  }

  set y(y) {
    this._y = y;
  }

  get width() {
    return this._width;
  }

  set width(w) {
    this._width = w;
  }

  get height() {
    return this._height;
  }

  set height(h) {
    this._height = h;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(e) {
    this._enabled = e;
  }

  update() {
    
  }

  draw(x, y, width, height) {
    
  }
}

class WidgetButton extends Widget {
  constructor(p5clickable) {
    super();
    this.clickable = p5clickable;
  }

  get x() {
    return this.clickable.x;
  }

  set x(x) {
    this.clickable.x = x;
  }

  get y() {
    return this.clickable.y;
  }

  set y(y) {
    this.clickable.y = y;
  }

  get width() {
    return this.clickable.width;
  }

  set width(w) {
    this.clickable.width = w;
  }

  get height() {
    return this.clickable.height;
  }

  set height(h) {
    this.clickable.height = h;
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(e) {
    this._enabled = e;
    this.clickable.enabled = e;
  }
  
  draw(x, y, width, height) {
    this.clickable.draw();
  }
}

class WidgetGroup {
  constructor(widgets) {
    if (widgets != undefined) {
      this.widgets = widgets;
    } else {
      this.widgets = [];
    }
    this._x = 0;
    this._y = 0;
    this._width = 0;
    this._height = 0;
    this._x_pad = 0;
    this._y_pad = 0;
    this._enabled = true;
    this.resize_widgets();
  }

  get x() {
    return this._x;
  }

  set x(x) {
    this._x = x;
    this.resize_widgets();
  }

  get y() {
    return this._y;
  }

  set y(y) {
    this._y = y;
    this.resize_widgets();
  }

  get width() {
    return this._width;
  }

  set width(w) {
    this._width = w;
    this.resize_widgets();
  }

  get height() {
    return this._height;
  }

  set height(h) {
    this._height = h;
    this.resize_widgets();
  }

  get x_pad() {
    return this._x_pad;
  }

  set x_pad(p) {
    this._x_pad = p;
    this.resize_widgets();
  }

  get y_pad() {
    return this._y_pad;
  }

  set y_pad(p) {
    this._y_pad = p;
    this.resize_widgets();
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(e) {
    this._enabled = e;
    for (const w of this.widgets) {
      w.enabled = e;
    }
  }
  
  resize_widgets() {
    // override in subclasses to order widgets
  }

  update() {
    for (let widget of this.widgets) {
      widget.update();
    }
  }

  draw(x, y, width, height) {
    for (let widget of this.widgets) {
      widget.draw(x, y, width, height);
    }
  }
}

class HorizontalWidgetGroup extends WidgetGroup {
  resize_widgets() {
    const new_width = (this.width - (this.widgets.length * this.x_pad)) / this.widgets.length;
    const new_height = this.height;
    let cur_x = this.x;
    for (let i = 0; i < this.widgets.length; i ++) {
      const widget = this.widgets[i];
      widget.x = cur_x;
      cur_x += new_width + this.x_pad;
      widget.y = this.y;
      widget.width = new_width;
      widget.height = new_height;
    }
  }
}

class VerticalWidgetGroup extends WidgetGroup {
  resize_widgets() {
    const new_width = this.width;
    const new_height = (this.height - (this.widgets.length * this.y_pad)) / this.widgets.length;
    let cur_y = this.y;
    for (let i = 0; i < this.widgets.length; i ++) {
      const widget = this.widgets[i];
      widget.y = cur_y;
      cur_y += new_height + this.y_pad;
      widget.x = this.x;
      widget.width = new_width;
      widget.height = new_height;
    }
  }
}

const button_color = "#FFFFFF";
const button_hover_color = "#D0D0D0";
const button_click_color = "#9E9E9E";
const button_disabled_color = "#505050";

let all_buttons = [];

function hovering_on_button() {
  for (const b of all_buttons) {
    if (b.hovering_on) {
      return true;
    }
  }
  return false;
}

function create_button(text, x, y, width, height, on_click) {
  let btn = new Clickable();
  btn.text = text;
  btn.x = x;
  btn.y = y;
  btn.width = width;
  btn.height = height;
  btn.enabled = true;
  btn.hovering_on = false;
  btn.onOutside = () => {
    btn.color = btn.enabled ? button_color : button_disabled_color;
    btn.hovering_on = false;
  };
  btn.onHover = () => {
    btn.color = btn.enabled ? button_hover_color : button_disabled_color;
    btn.hovering_on = true;
  };
  btn.on_click = on_click;
  btn.onPress = () => {
    if (!btn.enabled) {
      return;
    }
    btn.color = button_click_color;
    btn.on_click();
  };
  all_buttons.push(btn);
  return new WidgetButton(btn);
}
