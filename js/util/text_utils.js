"use strict";

function get_text_size(string, max_width, max_height) {
  for (let s = 0; s < max_height; s ++) {
    textSize(s);
    if (textWidth(string) > max_width) {
      return last_text_size_size;
    }
  }
}
