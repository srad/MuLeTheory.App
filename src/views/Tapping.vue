<template>
  <div>
    <b-row>
      <b-col>
        <h3 class="mb-3">Tapping Exercise
          <font-awesome-icon icon="drum"/>
        </h3>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div ref="sheet"></div>
        <ul class="border beats">
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
          <li>|</li>
          <li>1</li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
        </ul>
        <audio ref="metronome0" src="@/assets/audio/metronome1.wav"/>
        <audio ref="metronome1" src="@/assets/audio/metronome2.wav"/>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div class="alert alert-primary" style="font-size: large" variant="primary">
          <strong>Task:</strong> Count equally long each number from 1 to 4: <span v-html="exampleCount"/>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="2">
        <b-button variant="success" v-if="!playing" @click="start">
          <font-awesome-icon icon="play"/>
          Start
        </b-button>
        <b-button v-else variant="danger" @click="stop">
          <font-awesome-icon icon="stop"/>
          Start
        </b-button>
      </b-col>
      <b-col>
        <div class="text-primary font-weight-bold" style="font-size:x-large">
          {{info}}
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Vex from "vexflow";

const VF = Vex.Flow;

export default {
  name: "Game",
  props: {},
  data() {
    return {
      exampleCount: "",
      exampleCounter: [1, 2, 3, 4],
      speed: 1000,
      started: false,
      playing: false,
      notes: [],
      renderer: undefined,
      voice: undefined,
      context: undefined,
      info: "",
      countInfo: ["...3", "...2", "...1", ""],
      num_beats: 8,
      beat_value: 4,
      noteValues: [1, -1, 4, 4, 4, 4],
      countDurations: [],
      currentCountDurations: [],
      i: 0,
      countLoop: undefined,
    };
  },
  methods: {
    preCount() {
      let i = 0;
      const inter = setInterval(() => {
        this.info = this.countInfo[i++];
        if (i > this.countInfo.length) {
          clearInterval(inter);
          this.started = true;
          this.play();
        }
      }, this.speed);
    },
    done() {
      this.playing = false;
      this.info = "End!";
    },
    start() {
      if (!this.started) {
        this.preCount();
      }
    },
    stop() {
      if (this.playing) {
        this.playing = false;
        clearInterval(this.countLoop);
      }
    },
    play() {
      this.playing = true;

      this.i = 0;

      const draw = () => {
        if (this.i > 0) {
          this.notes[this.i - 1].setStyle({fillStyle: "black", strokeStyle: "black"});
        }
        if (!(this.notes[this.i] instanceof VF.StaveNote)) {
          this.i++;
        }

        this.$refs.metronome0.play();

        this.notes[this.i].setStyle({fillStyle: "blue", strokeStyle: "blue"});
        this.draw();
      };

      const complete = () => {
        if (this.i >= this.notes.length) {
          this.done();
          clearInterval(this.countLoop);
        }
      };

      const step = () => {
        console.log(this.i, this.currentCountDurations[this.i]);
        if (this.currentCountDurations[this.i] === 0) {
          this.i++;
          draw();
          return;
        }
        this.currentCountDurations[this.i] -= 1;
        complete();
      };

      draw();
      this.countLoop = setInterval(step, this.speed);
    },
    draw() {
      this.voice.draw(this.context, this.stave);
    },
  },
  mounted() {
    let exampleCountIndex = 0;
    setInterval(() => {
      const str = this.exampleCounter.map((c, i) => {
        if (i === exampleCountIndex) {
          return `<span class="text-danger mr-2">${c}</span>`;
        }
        return `<span class="mr-2">${c}</span>`;
      })
        .join("");
      this.exampleCount = str;
      exampleCountIndex = (exampleCountIndex + 1) % this.exampleCounter.length;
    }, this.speed);

    this.countDurations = this.noteValues.map(value => 1 / value * this.beat_value);
    // copy
    this.countDurations.forEach(value => {
      if (value > 0) {
        this.currentCountDurations.push(value);
      }
    });

    console.log(this.countDurations);

    // Vex note objects
    this.noteValues.forEach((value, j) => {
      if (value < 0) {
        this.notes.push(new Vex.Flow.BarNote());
      } else {
        this.notes.push(new VF.StaveNote({code: String(j), clef: "treble", keys: ["d/4"], duration: String(value)}));
      }
    });

    this.renderer = new VF.Renderer(this.$refs.sheet, VF.Renderer.Backends.SVG);
    // Create a voice in 4/4 and add the notes from above
    this.voice = new VF.Voice({num_beats: this.num_beats, beat_value: this.beat_value});
    this.voice.addTickables(this.notes);

    // Format and justify the notes to 400 pixels.
    const formatter = new VF.Formatter().joinVoices([this.voice])
      .format([this.voice], 400);

    // Configure the rendering context.
    this.renderer.resize(700, 120);
    this.context = this.renderer.getContext();
    this.context.setFont("Arial", 10, "")
      .setBackgroundFillStyle("#eed");

    // Create a stave of width 400 at position 10, 40 on the canvas.
    this.stave = new VF.Stave(0, 0, 600);

    // Add a clef and time signature.
    this.stave.addClef("treble")
      .addTimeSignature("4/4");

    // Connect it to the rendering context and draw!
    this.stave.setContext(this.context)
      .draw();

    this.draw();
  },
};
</script>

<style>
.beats {
  padding: 0 0 0 25px;
  width: 600px;
  font-weight: bold;
  justify-content: space-evenly;
  margin: 0;
  list-style: none;
  display: flex;
}
.beats li {
  padding: 0;
  margin: 0;
}
</style>