// Name: TurboSynth
// ID: nishiowoTurboSynth
// Description: Synthesizer that uses TurboSynth.
// By: NishiOwO
// License: BSD-3-Clause

// Repository is at https://github.com/NishiOwO/tw-turbosynth

(async function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("TurboSynth must be run unsandboxed");
  }

  let TurboSynthWASM, Module;
  let FileStream_New, FileStream_Destroy;
  let GUSPatSynth_New,
    GUSPatSynth_Note,
    GUSPatSynth_NoteOffAll,
    GUSPatSynth_SetBank,
    GUSPatSynth_SetProgram,
    GUSPatSynth_SetDrum,
    GUSPatSynth_ChangePitchWheel,
    GUSPatSynth_SetVolume,
    GUSPatSynth_RenderFloat,
    GUSPatSynth_Reset,
    GUSPatSynth_Destroy;
  let JZZip, AudioPlayer;
  let florestanZip;

  let synth = {};

  const argSlider =
    Scratch.ArgumentType[Scratch.extensions.isNitroBolt ? "SLIDER" : "NUMBER"];

  TurboSynthWASM = await Scratch.external.evalAndReturn(
    "https://raw.githubusercontent.com/pyrite-dev/pmidi/11430b2f9374cb68c6449d394554b91e2bc71c72/web/turbosynthwasm.js",
    "TurboSynthWASM"
  );
  Module = await TurboSynthWASM();

  FileStream_New = Module.cwrap("FileStream_New", "number", [
    "string",
    "number",
  ]);
  FileStream_Destroy = Module.cwrap("FileStream_Destroy", null, ["number"]);

  GUSPatSynth_New = Module.cwrap("GUSPatSynth_New", "number", [
    "number",
    "number",
  ]);
  GUSPatSynth_Note = Module.cwrap("GUSPatSynth_Note", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  GUSPatSynth_NoteOffAll = Module.cwrap("GUSPatSynth_NoteOffAll", null, [
    "number",
    "number",
  ]);
  GUSPatSynth_SetBank = Module.cwrap("GUSPatSynth_SetBank", null, [
    "number",
    "number",
    "number",
  ]);
  GUSPatSynth_SetProgram = Module.cwrap("GUSPatSynth_SetProgram", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  GUSPatSynth_SetDrum = Module.cwrap("GUSPatSynth_SetDrum", null, [
    "number",
    "number",
    "number",
  ]);
  GUSPatSynth_ChangePitchWheel = Module.cwrap(
    "GUSPatSynth_ChangePitchWheel",
    null,
    ["number", "number", "number"]
  );
  GUSPatSynth_SetVolume = Module.cwrap("GUSPatSynth_SetVolume", null, [
    "number",
    "number",
    "number",
  ]);
  GUSPatSynth_RenderFloat = Module.cwrap("GUSPatSynth_RenderFloat", null, [
    "number",
    "number",
    "number",
  ]);
  GUSPatSynth_Reset = Module.cwrap("GUSPatSynth_Reset", null, ["number"]);
  GUSPatSynth_Destroy = Module.cwrap("GUSPatSynth_Destroy", null, ["number"]);

  JZZip = await Scratch.external.evalAndReturn(
    "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js",
    "JSZip"
  );
  AudioPlayer = await Scratch.external.evalAndReturn(
    "https://raw.githubusercontent.com/pyrite-dev/pmidi/11430b2f9374cb68c6449d394554b91e2bc71c72/web/audioplayer.js",
    "AudioPlayer"
  );

  florestanZip = await Scratch.external.dataURL(
    "https://raw.githubusercontent.com/pyrite-dev/pmidi/11430b2f9374cb68c6449d394554b91e2bc71c72/web/florestan.zip"
  );

  function newSynthId() {
    let id;

    do {
      id = Math.floor(Math.random() * 0x100000000).toString();
    } while (synth[id]);

    synth[id] = { tempo: 60 };

    return id;
  }

  function destroySynthId(id) {
    delete synth[id];
  }

  async function fileOpSynthId(id, callback) {
    return navigator.locks.request("turboSynthFS", async (lock) => {
      Module.FS.mkdir(`/${id}`);
      Module.FS.mount(Module.FS.filesystems.MEMFS, {}, `/${id}`);
      Module.FS.chdir(`/${id}`);

      await callback(lock);

      Module.FS.chdir("/");
      Module.FS.unmount(`/${id}`);
      Module.FS.rmdir(`/${id}`);
    });
  }

  function beatsToMs(synth, beats) {
    return ((beats * 60) / synth.tempo) * 1000;
  }

  function playNote(synth, channel, note, velocity = 127) {
    GUSPatSynth_Note(synth, channel, note, velocity);
  }

  function stopNote(synth, channel, note) {
    playNote(synth, channel, note, 0);
  }

  function after(callback, ms) {
    return new Promise((res, rej) => {
      setTimeout(async () => {
        await callback();
        res();
      }, ms);
    });
  }

  const blockIconURI =
    "data:image/svg+xml;base64,PHN2ZyB4bWxuczp4PSJodHRwOi8vbnMuYWRvYmUuY29tL0V4dGVuc2liaWxpdHkvMS4wLyIgeG1sbnM6aT0iaHR0cDovL25zLmFkb2JlLmNvbS9BZG9iZUlsbHVzdHJhdG9yLzEwLjAvIiB4bWxuczpncmFwaD0iaHR0cDovL25zLmFkb2JlLmNvbS9HcmFwaHMvMS4wLyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDEwMCA5Ny45NDMiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDEwMCA5Ny45NDMiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxtZXRhZGF0YT48c2Z3IHhtbG5zPSJodHRwOi8vbnMuYWRvYmUuY29tL1NhdmVGb3JXZWIvMS4wLyI+PHNsaWNlcz48L3NsaWNlcz48c2xpY2VTb3VyY2VCb3VuZHMgd2lkdGg9IjkwLjA3OSIgaGVpZ2h0PSI4NC40NSIgeD0iMzc1LjQ2MSIgeT0iNTU2LjgzMyIgYm90dG9tTGVmdE9yaWdpbj0idHJ1ZSI+PC9zbGljZVNvdXJjZUJvdW5kcz48L3Nmdz48L21ldGFkYXRhPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNOTUuMDQsNzYuNTU4bC0wLjAwNi0xLjAwNmMtMC4xNzctMjkuMTQyLTExLjc3Ni0zMS4yNTYtMTguNzA3LTMyLjUyYy0xLjE3MS0wLjIxMy0yLjE4My0wLjM5OC0zLjAxNC0wLjY3NSAgYy0xMC4yOTMtMy40MjgtMTQuNzkyLTExLjU1My0xOS4xNDMtMTkuNDFDNDguNzkyLDEzLjIzNCw0My4yMywzLjE4OSwyNi44MzIsMy4xODljLTEuMTk1LDAtMi40NTMsMC4wNTQtMy43MzgsMC4xNiAgQzEyLjkyNiw0LjE4NSw0Ljc5MywxMi43ODMsNC45NjMsMjIuNTE0YzAuMTA3LDYuMDk1LDAuMDAxLDUyLjU3MywwLDUzLjA0MmwtMC4wMDIsMS4wMDJoMC4yMDZ2MTEuMDgxaDg5LjY2NlY3Ni41NThIOTUuMDR6ICAgTTkyLjgzMyw4NS42MzlINy4xNjd2LTguNTQzSDkuMzF2Ni4wMDVoMS44NzF2LTYuMDA1aDEuNDAzdjYuMDA1aDEuODd2LTYuMDA1aDMuNTh2Ni4wMDVoMS44N3YtNi4wMDVoMS40MDN2Ni4wMDVoMS44N3YtNi4wMDUgIGgxLjYxOXY2LjAwNWgxLjg3MXYtNi4wMDVoNC4zNTR2Ni4wMDVoMS44N3YtNi4wMDVoMS40MDF2Ni4wMDVoMS44NzF2LTYuMDA1aDMuNTh2Ni4wMDVoMS44NzF2LTYuMDA1aDEuNDAzdjYuMDA1aDEuODd2LTYuMDA1ICBoMS42MTl2Ni4wMDVoMS44NzF2LTYuMDA1aDMuNjAydjYuMDA1aDEuODd2LTYuMDA1aDEuNDAzdjYuMDA1aDEuODY5di02LjAwNWgzLjU4djYuMDA1aDEuODcxdi02LjAwNWgxLjQwMXY2LjAwNWgxLjg2OXYtNi4wMDUgIGgxLjYydjYuMDA1aDEuODcxdi02LjAwNWgzLjY2NXY2LjAwNWgxLjg3di02LjAwNWgxLjQwM3Y2LjAwNWgxLjg2OXYtNi4wMDVoMy41ODF2Ni4wMDVoMS44N3YtNi4wMDVoMS40MDF2Ni4wMDVoMS44N3YtNi4wMDVoMS42MTggIHY2LjAwNWgxLjg3MnYtNi4wMDVoMi40OFY4NS42Mzl6Ij48L3BhdGg+PC9zdmc+Cg==";

  class TurboSynth {
    getInfo() {
      return {
        id: "nishiowoTurboSynth",
        name: Scratch.translate("TurboSynth"),
        blockIconURI: blockIconURI,
        docsURI: "https://extensions.nitrobolt.org/NishiOwO/turbosynth",
        color1: "#884400",
        blocks: [
          {
            opcode: "resetAll",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("reset all"),
          },
          {
            blockType: "label",
            text: Scratch.translate("Synthesizer"),
          },
          {
            opcode: "newSynth",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate("new synthesizer with patches [PATCHES]"),
            arguments: {
              PATCHES: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "destroySynth",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("destroy synthesizer [SYNTH]"),
            arguments: {
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "resetSynth",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("reset synthesizer [SYNTH]"),
            arguments: {
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "defaultPatches",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate("default patches"),
          },
          {
            blockType: "label",
            text: Scratch.translate("Tempo control"),
          },
          {
            opcode: "synthTempo",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate("tempo of synthesizer [SYNTH]"),
            arguments: {
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "setSynthTempo",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "set tempo to [TEMPO] for synthesizer [SYNTH]"
            ),
            arguments: {
              TEMPO: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 60,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "synthRest",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "rest for [BEATS] beats for synthesizer [SYNTH]"
            ),
            arguments: {
              BEATS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.25,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            blockType: "label",
            text: Scratch.translate("Note control"),
          },
          {
            opcode: "playNote",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "play note [NOTE] for channel [CHANNEL] for [BEATS] beats on synthesizer [SYNTH]"
            ),
            arguments: {
              NOTE: {
                type: Scratch.ArgumentType.NOTE,
                defaultValue: 60,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              BEATS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.25,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "playNoteAsync",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "play note [NOTE] for channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              NOTE: {
                type: Scratch.ArgumentType.NOTE,
                defaultValue: 60,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "stopNote",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "stop note [NOTE] for channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              NOTE: {
                type: Scratch.ArgumentType.NOTE,
                defaultValue: 60,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            blockType: "label",
            text: Scratch.translate("Drum control"),
          },
          {
            opcode: "playDrum",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "play drum [DRUM] for channel [CHANNEL] for [BEATS] beats on synthesizer [SYNTH]"
            ),
            arguments: {
              DRUM: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              BEATS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.25,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "playDrumAsync",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "play drum [DRUM] for channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              DRUM: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "stopDrum",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "stop drum [DRUM] for channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              DRUM: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            blockType: "label",
            text: Scratch.translate("Channel control"),
          },
          {
            opcode: "setBank",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "set bank to [BANK] on channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              BANK: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 16383,
                precision: 1,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "setProgram",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "set program to [PROGRAM] on channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              PROGRAM: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "changePitchWheel",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "change pitchwheel to [SEMITONE] semitones on channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              SEMITONE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "setVolume",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "set volume to [VOLUME]% semitones on channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              VOLUME: {
                type: argSlider,
                defaultValue: 100,
                min: 0,
                max: 100,
                precision: 1,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "stopChannel",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "stop all sounds for channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              NOTE: {
                type: Scratch.ArgumentType.NOTE,
                defaultValue: 60,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
        ],
      };
    }

    resetAll() {
      let p = [];
      for (let i in synth) {
        p.push(this.destroySynth({ SYNTH: i }));
      }
      return Promise.all(p);
    }

    newSynth(args) {
      let zip, cfgs, fs;
      let id = newSynthId();

      synth[id].promise = (async () => {
        try {
          const res = await Scratch.fetch(args.PATCHES);
          zip = await JSZip.loadAsync(await res.arrayBuffer());
          cfgs = Object.keys(zip.files).filter((x) =>
            x.toLowerCase().endsWith(".cfg")
          );

          if (cfgs.length == 0) throw new Error();
        } catch {
          destroySynthId(id);
          return "";
        }

        await fileOpSynthId(id, async () => {
          for (let i in zip.files) {
            if (zip.files[i].dir) {
              Module.FS.mkdir(i);
            } else {
              Module.FS.writeFile(i, await zip.files[i].async("arraybuffer"));
            }
          }

          if ((fs = FileStream_New(cfgs[0], 0)) == 0) {
            destroySynthId(id);

            return "";
          }

          if ((synth[id].synth = GUSPatSynth_New(fs, 44100)) == 0) {
            FileStream_Destroy(fs);
            destroySynthId(id);

            return "";
          }

          FileStream_Destroy(fs);
        });

        synth[id].audioPlayer = new AudioPlayer(
          Scratch.vm.runtime.audioEngine.audioContext,
          44100
        );

        synth[id].bufferPtr = Module._malloc(
          2 * synth[id].audioPlayer.frames * 4
        );
        synth[id].buffer = new Float32Array(
          Module.HEAPF32.buffer,
          synth[id].bufferPtr
        );

        synth[id].audioPlayer.onbuffer = (audioBuffer, frames) => {
          const lChannelData = audioBuffer.getChannelData(0);
          const rChannelData = audioBuffer.getChannelData(1);

          GUSPatSynth_RenderFloat(synth[id].synth, synth[id].bufferPtr, frames);

          for (let i = 0; i < frames; i++) {
            lChannelData[i] = synth[id].buffer[2 * i + 0];
            rChannelData[i] = synth[id].buffer[2 * i + 1];
          }
        };

        synth[id].audioPlayer.resume();

        return id;
      })();

      return synth[id].promise;
    }

    destroySynth(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(async () => {
        await new Promise((res, rej) => {
          synth[args.SYNTH].audioPlayer.onended = () => {
            Module._free(synth[args.SYNTH].bufferPtr);
            GUSPatSynth_Destroy(synth[args.SYNTH].synth);
            destroySynthId(args.SYNTH);

            res();
          };

          synth[args.SYNTH].audioPlayer.shutdown();
        });
      });
    }

    resetSynth(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        GUSPatSynth_Reset(synth[args.SYNTH].synth);
      });
    }

    synthTempo(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        return synth[args.SYNTH].tempo;
      });
    }

    setSynthTempo(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        synth[args.SYNTH].tempo = args.TEMPO;
      });
    }

    synthRest(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(async () => {
        await after(() => {}, beatsToMs(synth[args.SYNTH], args.BEATS));
      });
    }

    defaultPatches() {
      return florestanZip;
    }

    playNote(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(async () => {
        playNote(synth[args.SYNTH].synth, args.CHANNEL, args.NOTE);

        await after(
          () => {
            stopNote(synth[args.SYNTH].synth, args.CHANNEL, args.NOTE);
          },
          beatsToMs(synth[args.SYNTH], args.BEATS)
        );
      });
    }

    playNoteAsync(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        playNote(synth[args.SYNTH].synth, args.CHANNEL, args.NOTE);
      });
    }

    stopNote(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        stopNote(synth[args.SYNTH].synth, args.CHANNEL, args.NOTE);
      });
    }

    setBank(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        GUSPatSynth_SetBank(synth[args.SYNTH].synth, args.CHANNEL, args.BANK);
      });
    }

    setProgram(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        GUSPatSynth_SetProgram(
          synth[args.SYNTH].synth,
          args.CHANNEL,
          args.PROGRAM,
          0
        );
      });
    }

    playDrum(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(async () => {
        GUSPatSynth_SetDrum(synth[args.SYNTH].synth, args.CHANNEL, 1);
        playNote(synth[args.SYNTH].synth, args.CHANNEL, args.DRUM);

        await after(
          () => {
            stopNote(synth[args.SYNTH].synth, args.CHANNEL, args.DRUM);
            GUSPatSynth_SetDrum(synth[args.SYNTH].synth, args.CHANNEL, 0);
          },
          beatsToMs(synth[args.SYNTH], args.BEATS)
        );
      });
    }

    playDrumAsync(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        GUSPatSynth_SetDrum(synth[args.SYNTH].synth, args.CHANNEL, 1);
        playNote(synth[args.SYNTH].synth, args.CHANNEL, args.DRUM);
        GUSPatSynth_SetDrum(synth[args.SYNTH].synth, args.CHANNEL, 0);
      });
    }

    stopDrum(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        stopNote(synth[args.SYNTH].synth, args.CHANNEL, args.DRUM);
      });
    }

    changePitchWheel(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        GUSPatSynth_ChangePitchWheel(
          synth[args.SYNTH].synth,
          args.CHANNEL,
          args.SEMITONE
        );
      });
    }

    setVolume(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        GUSPatSynth_SetVolume(
          synth[args.SYNTH].synth,
          args.CHANNEL,
          args.VOLUME / 100
        );
      });
    }

    stopChannel(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        GUSPatSynth_NoteOffAll(synth[args.SYNTH].synth, args.CHANNEL);
      });
    }
  }

  Scratch.extensions.register(new TurboSynth());
})(Scratch);
