"use strict";

const note_width = component_width;
const note_height = component_height;
const note_font = "monospace";

class Note extends Component {
  constructor(pos) {
    super(pos);
    this.size = createVector(note_width, note_width);
    this.connect_points = [];
    this.note_text = "Click on me and click the \nedit note text to change!";
  }

  update() {
    super.update();
  }

  findLongestWord(str) {
    const longestWord = str.split(/\n/).sort((a, b) => {
      return b.length - a.length;
    });
    return longestWord[0];
  }

  update_length(graphics) {
    graphics.push();
    graphics.textFont(note_font);
    this.size.x =
      graphics.textWidth(this.findLongestWord(this.note_text)) * 1.3;
    this.size.y = this.note_text.split(/\n/).length * graphics.textSize() * 1.3;
    graphics.pop();
  }

  draw(graphics, outline) {
    super.draw(graphics, outline);

    graphics.push();

    let mild_mult = 0.7;

    graphics.translate(
      this.pos.x + this.size.x / 2,
      this.pos.y + this.size.y / 2
    );
    graphics.rotate(this.angle);
    const note_x = -this.size.x / 2;
    const note_y = -this.size.y / 2;
    graphics.stroke(outline == undefined ? light_stroke : outline);
    graphics.rect(note_x, note_y, this.size.x, this.size.y);

    graphics.stroke(0);
    graphics.strokeWeight(0);
    // graphics.textWrap(WORD);
    graphics.textFont(note_font);
    graphics.textLeading(graphics.textSize());
    graphics.text(
      this.note_text,
      (-this.size.x / 2) * 0.9,
      (-this.size.y / 2) * mild_mult,
      this.size.x * 0.9,
      this.size.y
    );
    graphics.pop();
  }
}
