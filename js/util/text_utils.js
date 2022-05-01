"use strict";

let text_size_cache = {};

function get_text_size(string, max_width, max_height) {
  const key = string.length + "," + max_width + "," + max_height;
  if (key in text_size_cache) {
    return text_size_cache[key];
  } else {
    const result = get_text_size_no_cache(string, max_width, max_height);
    text_size_cache[key] = result;
    return result;
  }
}

function get_text_size_no_cache(string, max_width, max_height) {
  for (let s = 1; s < max_height; s ++) {
    textSize(s);
    if (textWidth(string) > max_width) {
      return s - 1;
    }
  }
  return max_height - 1;
}
