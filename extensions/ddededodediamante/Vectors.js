// Name: Vectors
// ID: ddeVectors
// Description: Manipulate vectors with common math operations.
// By: ddededodediamante <https://github.com/ddededodediamante/>
// License: MPL-2.0

// Version V.1.2.0

(function (Scratch) {
  "use strict";

  const runtime = Scratch.vm.runtime;

  class Vectors {
    getInfo() {
      return {
        id: "ddeVectors",
        name: Scratch.translate("Vectors"),
        color1: "#5BB998",
        blocks: [
          {
            opcode: "vector2D",
            text: Scratch.translate("vector x [X] y [Y]"),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
            hideFromPalette: true,
          },
          {
            opcode: "vector3D",
            text: Scratch.translate("vector x [X] y [Y] z [Z]"),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
            hideFromPalette: true,
          },
          {
            opcode: "vectorNew",
            text: Scratch.translate("vector [INPUTS]"),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              INPUTS: {
                type: Scratch.ArgumentType.EXTENDABLE,
                text: Scratch.translate("[NUM]"),
                arguments: {
                  NUM: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: 0,
                  },
                },
                defaultInputs: 2,
                minInputs: 1,
              },
            },
          },
          {
            opcode: "vectorFromAngle",
            text: Scratch.translate("vector from angle [A]"),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              A: { type: Scratch.ArgumentType.ANGLE, defaultValue: 0 },
            },
          },
          {
            opcode: "dimensionsVector",
            text: Scratch.translate("vector with [N] dimensions set to [V]"),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
              V: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
            },
          },
          "---",
          {
            opcode: "getComponent",
            text: Scratch.translate("component [I] of [VEC]"),
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              I: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              VEC: { type: Scratch.ArgumentType.ARRAY },
            },
          },
          {
            opcode: "setComponent",
            text: Scratch.translate("set component [I] of [VEC] to [V]"),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              I: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              VEC: { type: Scratch.ArgumentType.ARRAY },
              V: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
          },
          "---",
          {
            opcode: "add",
            text: Scratch.translate("[A] + [B]"),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              A: { type: Scratch.ArgumentType.ARRAY },
              B: { type: Scratch.ArgumentType.ARRAY },
            },
            switches: ["subtract"]
          },
          {
            opcode: "subtract",
            text: Scratch.translate("[A] - [B]"),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              A: { type: Scratch.ArgumentType.ARRAY },
              B: { type: Scratch.ArgumentType.ARRAY },
            },
            switches: ["add"]
          },
          {
            opcode: "scale",
            text: Scratch.translate("[VEC] * [S]"),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              VEC: { type: Scratch.ArgumentType.ARRAY },
              S: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 },
            },
            switches: ["divide"]
          },
          {
            opcode: "divide",
            text: Scratch.translate("[VEC] / [S]"),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              VEC: { type: Scratch.ArgumentType.ARRAY },
              S: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 },
            },
            switches: ["scale"]
          },
          {
            opcode: "lerp",
            text: Scratch.translate("lerp [A] to [B] by [T]"),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              A: { type: Scratch.ArgumentType.ARRAY },
              B: { type: Scratch.ArgumentType.ARRAY },
              T: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.5 },
            },
          },
          {
            opcode: "vectorCompare",
            text: Scratch.translate("[A]\u200b[OP]\u200b[B]"),
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {
              A: { type: Scratch.ArgumentType.ARRAY },
              OP: { type: Scratch.ArgumentType.STRING, menu: "vectorCompare" },
              B: { type: Scratch.ArgumentType.ARRAY },
            },
          },
          "---",
          {
            opcode: "magnitude",
            text: Scratch.translate("magnitude of [VEC]"),
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              VEC: { type: Scratch.ArgumentType.ARRAY },
            },
          },
          {
            opcode: "angle2D",
            text: Scratch.translate("angle 2D of [VEC]"),
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              VEC: { type: Scratch.ArgumentType.ARRAY },
            },
          },
          {
            opcode: "angle",
            text: Scratch.translate("angle of [VEC] in axes [I] [J]"),
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              VEC: { type: Scratch.ArgumentType.ARRAY },
              I: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              J: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
            },
          },
          {
            opcode: "rotate2D",
            text: Scratch.translate("rotate 2D [VEC] by [A] degrees"),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              VEC: { type: Scratch.ArgumentType.ARRAY },
              A: { type: Scratch.ArgumentType.ANGLE, defaultValue: 90 },
            },
          },
          {
            opcode: "rotate",
            text: Scratch.translate(
              "rotate [VEC] in axes [I] [J] by [A] degrees"
            ),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              VEC: { type: Scratch.ArgumentType.ARRAY },
              I: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              J: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              A: { type: Scratch.ArgumentType.NUMBER, defaultValue: 90 },
            },
          },
          "---",
          {
            opcode: "vectorTransform",
            text: Scratch.translate("[OP]\u200b[VEC]"),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              OP: {
                type: Scratch.ArgumentType.STRING,
                menu: "vectorTransform",
              },
              VEC: { type: Scratch.ArgumentType.ARRAY },
            },
          },
          {
            opcode: "clampMagnitude",
            text: Scratch.translate("clamp magnitude of [VEC] to [MAX]"),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              VEC: { type: Scratch.ArgumentType.ARRAY },
              MAX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
            },
          },
          {
            opcode: "swizzle",
            text: Scratch.translate("swizzle [VEC] with [INDICES]"),
            blockType: Scratch.BlockType.ARRAY,
            arguments: {
              VEC: { type: Scratch.ArgumentType.ARRAY },
              INDICES: { type: Scratch.ArgumentType.ARRAY },
            },
          },
          {
            opcode: "vectorOp",
            text: Scratch.translate("[OP] [A] and [B]"),
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              OP: { type: Scratch.ArgumentType.STRING, menu: "vectorOp" },
              A: { type: Scratch.ArgumentType.ARRAY },
              B: { type: Scratch.ArgumentType.ARRAY },
            },
          },
          "---",
          {
            opcode: "setPosition",
            text: Scratch.translate("set position to [VEC]"),
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              VEC: { type: Scratch.ArgumentType.ARRAY },
            },
            color1: "#4c97ff",
            switches: ["pointTowards"]
          },
          {
            opcode: "pointTowards",
            text: Scratch.translate("point towards [VEC]"),
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              VEC: { type: Scratch.ArgumentType.ARRAY },
            },
            color1: "#4c97ff",
            switches: ["setPosition"]
          },
          {
            opcode: "setStretch",
            text: Scratch.translate("set stretch to [VEC]"),
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              VEC: { type: Scratch.ArgumentType.ARRAY },
            },
            color1: "#4287f5",
            hideFromPalette:
              !runtime.extensionManager?.isExtensionLoaded("stretch"),
          },
        ],
        menus: {
          vectorOp: {
            acceptReporters: false,
            items: [
              {
                text: Scratch.translate("dot product of"),
                value: "dot product of",
              },
              {
                text: Scratch.translate("distance between"),
                value: "distance between",
              },
              {
                text: Scratch.translate("angle between"),
                value: "angle between",
              },
            ],
          },
          vectorCompare: {
            acceptReporters: false,
            items: [
              { text: Scratch.translate("<"), value: "<" },
              { text: Scratch.translate("≤"), value: "<=" },
              { text: Scratch.translate(">"), value: ">" },
              { text: Scratch.translate("≥"), value: ">=" },
              { text: Scratch.translate("="), value: "=" },
              { text: Scratch.translate("≠"), value: "!=" },
            ],
          },
          vectorTransform: {
            acceptReporters: false,
            items: [
              { text: Scratch.translate("normalize"), value: "normalize" },
              { text: Scratch.translate("absolute"), value: "absolute" },
              { text: Scratch.translate("negate"), value: "negate" },
              { text: Scratch.translate("floor"), value: "floor" },
              { text: Scratch.translate("ceil"), value: "ceil" },
              { text: Scratch.translate("round"), value: "round" },
            ],
          },
        },
      };
    }

    _map(a, func) {
      return Scratch.Cast.toFloat32Array(a).slice().map(func);
    }

    _map2(a, b, func) {
      a = Scratch.Cast.toFloat32Array(a);
      b = Scratch.Cast.toFloat32Array(b);
      const length = Math.max(a.length, b.length);
      return Float32Array.from({ length }, (_, i) =>
        func(a[i] ?? 0, b[i] ?? 0)
      );
    }

    vector2D(args) {
      return new Float32Array([
        Scratch.Cast.toNumber(args.X),
        Scratch.Cast.toNumber(args.Y),
      ]);
    }

    vector3D(args) {
      return new Float32Array([
        Scratch.Cast.toNumber(args.X),
        Scratch.Cast.toNumber(args.Y),
        Scratch.Cast.toNumber(args.Z),
      ]);
    }

    vectorNew(args, util) {
      return new Float32Array(
        util
          .extendableToArray(args, "INPUTS", "NUM")
          .map((/** @type {unknown} */ i) => Scratch.Cast.toNumber(i))
      );
    }

    vectorFromAngle(args) {
      const rad = Scratch.Cast.toNumber(args.A) * (Math.PI / 180);
      return new Float32Array([Math.cos(rad), Math.sin(rad)]);
    }

    dimensionsVector(args) {
      const n = Math.max(0, Math.floor(Scratch.Cast.toNumber(args.N)));
      return new Float32Array(n).fill(Scratch.Cast.toNumber(args.V));
    }

    getComponent(args) {
      const v = Scratch.Cast.toFloat32Array(args.VEC);
      const i = Math.floor(Scratch.Cast.toNumber(args.I));
      return v[i] ?? 0;
    }

    setComponent(args) {
      const v = Scratch.Cast.toFloat32Array(args.VEC).slice();
      const i = Math.floor(Scratch.Cast.toNumber(args.I));
      const val = Scratch.Cast.toNumber(args.V);
      if (i < 0) return v;
      if (i < v.length) {
        v[i] = val;
        return v;
      }
      const result = new Float32Array(i + 1);
      result.set(v);
      result[i] = val;
      return result;
    }

    add(args) {
      return this._map2(args.A, args.B, (x, y) => x + y);
    }

    subtract(args) {
      return this._map2(args.A, args.B, (x, y) => x - y);
    }

    scale(args) {
      const s = Scratch.Cast.toNumber(args.S);
      return this._map(args.VEC, (x) => x * s);
    }

    divide(args) {
      const s = Scratch.Cast.toNumber(args.S);
      if (s === 0) return this._map(args.VEC, () => 0);
      return this._map(args.VEC, (x) => x / s);
    }

    lerp(args) {
      const t = Scratch.Cast.toNumber(args.T);
      return this._map2(args.A, args.B, (a, b) => a + (b - a) * t);
    }

    magnitude(args) {
      const v = Scratch.Cast.toFloat32Array(args.VEC);
      let sum = 0;
      for (let i = 0; i < v.length; i++) sum += v[i] * v[i];
      return Math.sqrt(sum);
    }

    angle2D(args) {
      const v = Scratch.Cast.toFloat32Array(args.VEC);
      return Math.atan2(v[1] ?? 0, v[0] ?? 0) * (180 / Math.PI);
    }

    angle(args) {
      const v = Scratch.Cast.toFloat32Array(args.VEC);
      const i = Math.floor(Scratch.Cast.toNumber(args.I));
      const j = Math.floor(Scratch.Cast.toNumber(args.J));
      return Math.atan2(v[j] ?? 0, v[i] ?? 0) * (180 / Math.PI);
    }

    rotate2D(args) {
      const v = Scratch.Cast.toFloat32Array(args.VEC).slice();
      const rad = Scratch.Cast.toNumber(args.A) * (Math.PI / 180);
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const x0 = v[0] ?? 0;
      const x1 = v[1] ?? 0;
      v[0] = x0 * cos - x1 * sin;
      v[1] = x0 * sin + x1 * cos;
      return v;
    }

    rotate(args) {
      const v = Scratch.Cast.toFloat32Array(args.VEC).slice();
      const i = Math.floor(Scratch.Cast.toNumber(args.I));
      const j = Math.floor(Scratch.Cast.toNumber(args.J));
      const rad = Scratch.Cast.toNumber(args.A) * (Math.PI / 180);
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const xi = v[i] ?? 0;
      const xj = v[j] ?? 0;
      v[i] = xi * cos - xj * sin;
      v[j] = xi * sin + xj * cos;
      return v;
    }

    vectorTransform(args) {
      switch (args.OP) {
        case "normalize": {
          const mag = this.magnitude({ VEC: args.VEC });
          if (mag === 0) return this._map(args.VEC, () => 0);
          return this._map(args.VEC, (x) => x / mag);
        }
        case "absolute":
          return this._map(args.VEC, Math.abs);
        case "negate":
          return this._map(args.VEC, (x) => -x);
        case "floor":
          return this._map(args.VEC, Math.floor);
        case "ceil":
          return this._map(args.VEC, Math.ceil);
        case "round":
          return this._map(args.VEC, Math.round);
      }
    }

    clampMagnitude(args) {
      const max = Scratch.Cast.toNumber(args.MAX);
      const v = Scratch.Cast.toFloat32Array(args.VEC).slice();
      let sum = 0;
      for (let i = 0; i < v.length; i++) sum += v[i] * v[i];
      const mag = Math.sqrt(sum);
      if (mag === 0 || mag <= max) return v;
      const s = max / mag;
      for (let i = 0; i < v.length; i++) v[i] *= s;
      return v;
    }

    swizzle(args) {
      const v = Scratch.Cast.toFloat32Array(args.VEC);
      const indices = Scratch.Cast.toFloat32Array(args.INDICES);
      return Float32Array.from(indices, (i) => v[i] ?? 0);
    }

    vectorCompare(args) {
      const magA = this.magnitude({ VEC: args.A });
      const magB = this.magnitude({ VEC: args.B });
      switch (args.OP) {
        case "<":
          return magA < magB;
        case "<=":
          return magA <= magB;
        case ">":
          return magA > magB;
        case ">=":
          return magA >= magB;
        case "=":
          return magA === magB;
        case "!=":
          return magA !== magB;
        default:
          return false;
      }
    }

    vectorOp(args) {
      switch (args.OP) {
        case "dot product of": {
          const a = Scratch.Cast.toFloat32Array(args.A);
          const b = Scratch.Cast.toFloat32Array(args.B);
          let sum = 0;
          for (let i = 0; i < Math.max(a.length, b.length); i++)
            sum += (a[i] ?? 0) * (b[i] ?? 0);
          return sum;
        }
        case "distance between": {
          const diff = this._map2(args.A, args.B, (x, y) => x - y);
          let sum = 0;
          for (let i = 0; i < diff.length; i++) sum += diff[i] * diff[i];
          return Math.sqrt(sum);
        }
        case "angle between": {
          const magA = this.magnitude({ VEC: args.A });
          const magB = this.magnitude({ VEC: args.B });
          if (magA === 0 || magB === 0) return 0;
          const a = Scratch.Cast.toFloat32Array(args.A);
          const b = Scratch.Cast.toFloat32Array(args.B);
          let dot = 0;
          for (let i = 0; i < Math.max(a.length, b.length); i++)
            dot += (a[i] ?? 0) * (b[i] ?? 0);
          return (
            Math.acos(Math.max(-1, Math.min(1, dot / (magA * magB)))) *
            (180 / Math.PI)
          );
        }
        default:
          return 0;
      }
    }

    setPosition({ VEC }, util) {
      const v = Scratch.Cast.toFloat32Array(VEC);
      util.target.setXY(
        Scratch.Cast.toNumber(v[0]),
        Scratch.Cast.toNumber(v[1])
      );
    }

    pointTowards({ VEC }, util) {
      const v = Scratch.Cast.toFloat32Array(VEC);
      const target = util.target;

      const dx = Scratch.Cast.toNumber(v[0]) - target.x;
      const dy = Scratch.Cast.toNumber(v[1]) - target.y;
      target.setDirection((Math.atan2(dx, dy) * 180) / Math.PI);
    }

    setStretch({ VEC }, util) {
      const v = Scratch.Cast.toFloat32Array(VEC);
      const setStretchBlock =
        util.runtime.getOpcodeFunction("stretch_setStretch");
      setStretchBlock?.({ X: v[0], Y: v[1] }, util);
    }
  }

  Scratch.extensions.register(new Vectors());
})(Scratch);
