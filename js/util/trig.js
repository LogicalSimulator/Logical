//Takes in a point and an offset
// and returns the point
function rotate_to_real(pos, off, angle) {
  const x = pos.x + off.x;
  const y = pos.y + off.y;

  const new_x = pos.x + (x - pos.x) * cos(angle) - (y - pos.y) * sin(angle);
  const new_y = pos.y + (x - pos.x) * sin(angle) + (y - pos.y) * cos(angle);
  return createVector(new_x, new_y);
}
