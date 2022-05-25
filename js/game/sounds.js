const sfx_volume = 0.1;

const sfx = {
  tap_sound: "assets/audio/sfx/tap/tap",
};

class Sounds {
  static tap_sound;

  static play(sound) {
    sound.play();
  }

  static play_tap() {
    Sounds.play(Sounds.tap_sound);
  }
}

function preload_sounds() {
  soundFormats("mp3", "wav");
  for (const name in sfx) {
    const sound = loadSound(sfx[name]);
    sound.setVolume(sfx_volume);
    Sounds[name] = sound;
  }
}
