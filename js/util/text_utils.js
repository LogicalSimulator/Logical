"use strict";

let last_text_size_string_len;
let last_text_size_max_width;
let last_text_size_max_height;
let last_text_size_size;

function get_text_size(string, max_width, max_height) {
  if (last_text_size_string_len === string &&
      last_text_size_max_width === max_width &&
      last_text_size_max_height === height) {
    return last_text_size_size;
  }
  last_text_size_string_len = string.length;
  last_text_size_max_width = max_width;
  last_text_size_max_height = max_height;
  for (let s = 0; s < max_height; s ++) {
    textSize(s);
    if (textWidth(string) > max_width) {
      last_text_size_size = s - 1;
      return last_text_size_size;
    }
  }
}
