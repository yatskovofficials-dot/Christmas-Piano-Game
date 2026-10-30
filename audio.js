// Simple piano synthesizer using Web Audio API
class PianoSynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.activeNotes = new Map();
    this.volume = 0.3;
  }

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.volume;
    this.masterGain.connect(this.ctx.destination);
  }

  // Note name to frequency (A4 = 440)
  noteToFreq(note) {
    const notes = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
      'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };
    const match = note.match(/^([A-G][#b]?)(\d+)$/);
    if (!match) return 440;
    const [, name, oct] = match;
    const n = notes[name];
    const midi = (parseInt(oct) + 1) * 12 + n;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  play(note, duration = 0.8) {
    this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const freq = this.noteToFreq(note);
    const now = this.ctx.currentTime;

    // Stop previous same note
    if (this.activeNotes.has(note)) {
      this.stop(note);
    }

    // Oscillators for richer sound (fundamental + harmonics)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const osc3 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc3.type = 'sine';

    osc1.frequency.value = freq;
    osc2.frequency.value = freq * 2;
    osc3.frequency.value = freq * 3;

    filter.type = 'lowpass';
    filter.frequency.value = 2500;
    filter.Q.value = 1;

    // Envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.7, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    // Slight detune for realism
    osc2.detune.value = 3;
    osc3.detune.value = -5;

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);

    osc1.stop(now + duration + 0.05);
    osc2.stop(now + duration + 0.05);
    osc3.stop(now + duration + 0.05);

    this.activeNotes.set(note, { osc1, osc2, osc3, gain });

    // Auto cleanup
    setTimeout(() => {
      this.activeNotes.delete(note);
    }, (duration + 0.1) * 1000);
  }

  stop(note) {
    const entry = this.activeNotes.get(note);
    if (!entry) return;
    const now = this.ctx.currentTime;
    entry.gain.gain.cancelScheduledValues(now);
    entry.gain.gain.setValueAtTime(entry.gain.gain.value, now);
    entry.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    setTimeout(() => {
      try {
        entry.osc1.stop();
        entry.osc2.stop();
        entry.osc3.stop();
      } catch (e) {}
      this.activeNotes.delete(note);
    }, 100);
  }

  // Play a short "hit" feedback sound
  playHit() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.value = 1200;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }
}

const piano = new PianoSynth();
