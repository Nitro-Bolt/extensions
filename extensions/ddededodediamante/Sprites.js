// Name: Sprites
// ID: ddeSprites
// Description: Control and modify the project's sprites.
// By: ddededodediamante <https://github.com/ddededodediamante/>
// License: MPL-2.0

// Version V.1.2.0

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    window.alert('The extension "Sprites" must be ran unsandboxed!');
    throw new Error('The extension "Sprites" must be ran unsandboxed!');
  }

  const runtime = Scratch.vm.runtime;
  const Cast = Scratch.Cast;

  const origVisualReport = runtime.visualReport;
  /**
   * @param {VM.RenderedTarget} target
   * @param {string} blockId
   * @param {string | undefined} value
   * @param {boolean | undefined} error
   * @param {string | undefined} html
   */
  runtime.visualReport = function (target, blockId, value, error, html) {
    let customHtml = null;

    if (value) {
      const _target = _findSprite(value, false, true);
      if (_target) {
        const costume = _target
          ?.getCostumes()
          ?.[_target.currentCostume]?.asset?.encodeDataURI();
        customHtml = `<div style="display: flex; flex-direction: column; justify-content: center;">
        <span>${_target?.getName()}${!_target.isOriginal ? " <span><small>(clone)</small></span>" : ""}</span>
        <img src="${costume}" style="padding-top: 8px; padding-right: 15px; padding-left: 15px; max-width: 130px; max-height: 130px;">
        </div>`;
      }
    }

    origVisualReport.call(
      this,
      target,
      blockId,
      value,
      error,
      customHtml || html
    );
  };

  function _allSprites(onlyOriginals = true) {
    const array = [];
    const targets = runtime.targets;
    for (let e = 1; e < targets.length; e++) {
      const sprite = targets[e];
      if (!onlyOriginals || sprite.isOriginal) {
        array.push(sprite);
      }
    }
    return array;
  }

  function _findSprite(idOrName = "", onlyOriginals = false, onlyId = false) {
    if (!idOrName || idOrName === "") return null;
    const sprites = _allSprites(onlyOriginals);

    let sprite = sprites.find(
      (i) => i.id === idOrName || (!onlyId && i.getName() === idOrName)
    );
    return sprite || null;
  }

  class ddeSprites {
    getInfo() {
      return {
        id: "ddeSprites",
        name: Scratch.translate("Sprites"),
        color1: "#737FFF",
        blocks: [
          {
            opcode: "rotationStyleMenu",
            blockType: Scratch.BlockType.REPORTER,
            text: "[MENU]",
            hideFromPalette: true,
            arguments: {
              MENU: {
                type: Scratch.ArgumentType.STRING,
                menu: "SPRITE_ROTATION_STYLES",
              }
            }
          },
          {
            opcode: "sprite",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("current sprite"),
            disableMonitor: true,
            filter: [Scratch.TargetType.SPRITE],
          },
          {
            opcode: "spriteNamed",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("sprite named [NAME]"),
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Sprite1",
              },
            },
          },
          {
            opcode: "spritesList",
            blockType: Scratch.BlockType.ARRAY,
            text: Scratch.translate("list sprites"),
            disableMonitor: true,
          },
          {
            opcode: "listSpriteMenu",
            blockType: Scratch.BlockType.ARRAY,
            text: Scratch.translate("list [MENU] of [ID]"),
            arguments: {
              MENU: {
                type: Scratch.ArgumentType.STRING,
                menu: "SPRITE_LISTS",
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                menu: "SPRITES",
              },
            },
          },
          "---",
          {
            opcode: "spriteInfo",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("[MENU] of [ID]"),
            arguments: {
              MENU: {
                type: Scratch.ArgumentType.STRING,
                menu: "SPRITE_PROPERTIES",
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                menu: "SPRITES",
              },
            },
          },
          {
            opcode: "spriteBool",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("is [ID] [MENU]?"),
            disableMonitor: true,
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                menu: "SPRITES",
              },
              MENU: {
                type: Scratch.ArgumentType.STRING,
                menu: "SPRITE_BOOLS",
              },
            },
          },
          {
            opcode: "spriteTouching",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("[ID] touching [MENU]?"),
            disableMonitor: true,
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                menu: "SPRITES",
              },
              MENU: {
                type: Scratch.ArgumentType.STRING,
                menu: "SPRITES_AND_OBJECTS",
              },
            },
          },
          {
            opcode: "setSpriteProperty",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set [MENU] of [ID] to [VALUE]"),
            arguments: {
              MENU: {
                type: Scratch.ArgumentType.STRING,
                menu: "SPRITE_SETTABLE_PROPERTIES",
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                menu: "SPRITES",
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "0",
              },
            },
          },
          "---",
          {
            opcode: "cloneSprite",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("create clone of [ID]"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                menu: "SPRITES",
              },
            },
          },
          {
            opcode: "runAsSprite",
            blockType: Scratch.BlockType.CONDITIONAL,
            text: Scratch.translate("as [ID] run"),
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                menu: "SPRITES",
              },
            },
          },
        ],
        menus: {
          SPRITES: {
            acceptReporters: true,
            items: "spritesListMenu",
          },
          SPRITES_AND_OBJECTS: {
            acceptReporters: true,
            items: "spritesAndObjectsListMenu",
          },
          SPRITE_PROPERTIES: {
            acceptReporters: true,
            items: [
              { text: Scratch.translate("x position"), value: "x position" },
              { text: Scratch.translate("y position"), value: "y position" },
              { text: Scratch.translate("direction"), value: "direction" },
              { text: Scratch.translate("rotation style"), value: "rotation style" },
              { text: Scratch.translate("costume #"), value: "costume #" },
              { text: Scratch.translate("costume name"), value: "costume name" },
              { text: Scratch.translate("size"), value: "size" },
              { text: Scratch.translate("layer"), value: "layer" },
              { text: Scratch.translate("volume"), value: "volume" },
              { text: Scratch.translate("name"), value: "name" },
              { text: Scratch.translate("origin"), value: "origin" },
            ],
          },
          SPRITE_ROTATION_STYLES: {
            acceptReporters: false,
            items: [
              { text: Scratch.translate("all around"), value: "all around" },
              { text: Scratch.translate("left-right"), value: "left-right" },
              { text: Scratch.translate("don't rotate"), value: "don't rotate" },
            ],
          },
          SPRITE_SETTABLE_PROPERTIES: {
            items: [
              { text: Scratch.translate("x position"), value: "x position" },
              { text: Scratch.translate("y position"), value: "y position" },
              { text: Scratch.translate("direction"), value: "direction" },
              { text: Scratch.translate("rotation style"), value: "rotation style" },
              { text: Scratch.translate("costume #"), value: "costume #" },
              { text: Scratch.translate("costume name"), value: "costume name" },
              { text: Scratch.translate("size"), value: "size" },
              { text: Scratch.translate("layer"), value: "layer" },
              { text: Scratch.translate("volume"), value: "volume" },
              { text: Scratch.translate("name"), value: "name" },
              { text: Scratch.translate("visible"), value: "visible" },
              { text: Scratch.translate("draggable"), value: "draggable" },
            ],
            mutator: {
              "x position": { arguments: { VALUE: { type: Scratch.ArgumentType.NUMBER } } },
              "y position": { arguments: { VALUE: { type: Scratch.ArgumentType.NUMBER } } },
              "direction": { arguments: { VALUE: { type: Scratch.ArgumentType.ANGLE } } },
              "rotation style": {
                arguments: {
                  VALUE: { type: Scratch.ArgumentType.STRING, shadow: "rotationStyleMenu" }
                }
              },
              "costume #": { arguments: { VALUE: { type: Scratch.ArgumentType.NUMBER } } },
              "costume name": { arguments: { VALUE: { type: Scratch.ArgumentType.STRING } } },
              "size": { arguments: { VALUE: { type: Scratch.ArgumentType.NUMBER } } },
              "layer": { arguments: { VALUE: { type: Scratch.ArgumentType.NUMBER } } },
              "volume": { arguments: { VALUE: { type: Scratch.ArgumentType.ANGLE } } },
              "name": { arguments: { VALUE: { type: Scratch.ArgumentType.STRING } } },
              "visible": {
                arguments: {
                  VALUE: { type: Scratch.ArgumentType.BOOLEAN }
                }
              },
              "draggable": {
                arguments: {
                  VALUE: { type: Scratch.ArgumentType.BOOLEAN }
                }
              }
            }
          },
          SPRITE_BOOLS: {
            acceptReporters: true,
            items: [
              { text: Scratch.translate("visible"), value: "visible" },
              { text: Scratch.translate("draggable"), value: "draggable" },
              { text: Scratch.translate("being dragged"), value: "being dragged" },
              { text: Scratch.translate("a clone"), value: "a clone" },
            ],
          },
          SPRITE_LISTS: {
            acceptReporters: true,
            items: [
              { text: Scratch.translate("costumes"), value: "costumes" },
              { text: Scratch.translate("sounds"), value: "sounds" },
              { text: Scratch.translate("clones"), value: "clones" },
            ],
          },
        },
      };
    }

    allSprites(onlyOriginals = true) {
      return _allSprites(onlyOriginals);
    }

    findSprite(id = "", onlyOriginals = false) {
      return _findSprite(id, onlyOriginals, false);
    }

    spritesList() {
      return this.allSprites(true).map((sprite) => sprite.id);
    }

    spritesListMenu() {
      return this.allSprites(true).map((i) => i.getName());
    }

    spritesAndObjectsListMenu() {
      return [
        {
          text: Scratch.translate("mouse-pointer"),
          value: "_mouse_",
        },
        {
          text: Scratch.translate("edge"),
          value: "_edge_",
        },
        ...this.spritesListMenu(),
      ];
    }

    /**
     * @param {any} _args
     * @param {{ target: { id: any; }; }} util
     */
    sprite(_args, util) {
      return util.target.id;
    }

    spriteNamed({ NAME }) {
      const name = Scratch.Cast.toString(NAME);
      const sprite = this.allSprites(true).find((i) => i.getName() === name);
      if (!sprite) return "";
      return sprite.id;
    }

    listSpriteMenu({ ID, MENU }) {
      const sprite = this.findSprite(ID);
      if (!sprite) return [];

      switch (Scratch.Cast.toString(MENU)) {
        case "costumes": {
          const costumes = sprite.getCostumes() || [];
          return costumes.map((c) => c.name);
        }
        case "sounds": {
          const sounds = sprite.getSounds() || [];
          return sounds.map((s) => s.name);
        }
        case "clones": {
          const spriteObj = sprite.sprite;
          if (!spriteObj) return [];
          const clones = [];
          const targets = runtime.targets;
          for (let e = 1; e < targets.length; e++) {
            const target = targets[e];
            if (target.sprite === spriteObj && !target.isOriginal) {
              clones.push(target.id);
            }
          }
          return clones;
        }
        default:
          return [];
      }
    }

    spriteInfo({ ID, MENU }) {
      const sprite = this.findSprite(ID);
      if (!sprite) return "";

      switch (Scratch.Cast.toString(MENU)) {
        case "x position":
          return sprite.x;
        case "y position":
          return sprite.y;
        case "direction":
          return sprite.direction;
        case "rotation style":
          return sprite.rotationStyle;
        case "costume #":
          return sprite.currentCostume + 1;
        case "costume name": {
          const costumes = sprite.getCostumes();
          return costumes[sprite.currentCostume]
            ? costumes[sprite.currentCostume].name
            : "";
        }
        case "size":
          return sprite.size;
        case "layer":
          return runtime.executableTargets.indexOf(sprite);
        case "volume":
          return sprite.volume;
        case "name":
          return sprite.getName();
        case "origin": {
          if (sprite.isOriginal) return sprite.id;
          const name = sprite.getName();
          const found = this.allSprites(true).find((i) => i.getName() === name);
          return found ? found.id : "";
        }
        default:
          return "";
      }
    }

    spriteBool({ ID, MENU }) {
      const sprite = this.findSprite(ID);
      if (!sprite) return false;

      switch (Scratch.Cast.toString(MENU)) {
        case "visible":
          return sprite.visible;
        case "draggable":
          return sprite.draggable;
        case "being dragged":
          return !!sprite.dragging;
        case "a clone":
          return !sprite.isOriginal;
        default:
          return false;
      }
    }

    spriteTouching({ ID, MENU }) {
      const sprite = this.findSprite(ID);
      if (!sprite) return false;

      if (MENU === "_edge_") return sprite.isTouchingEdge();
      else if (MENU === "_mouse_") return sprite.isTouchingObject("_mouse_");

      const sprite2 = this.findSprite(MENU);
      if (!sprite2) return false;

      return sprite.isTouchingTarget(sprite2);
    }

    rotationStyleMenu({ MENU }) {
      return MENU;
    }

    setSpriteProperty({ ID, MENU, VALUE }) {
      const sprite = this.findSprite(ID);
      if (!sprite) return;

      switch (Cast.toString(MENU)) {
        case "x position":
          sprite.setXY(Cast.toNumber(VALUE), sprite.y);
          break;
        case "y position":
          sprite.setXY(sprite.x, Cast.toNumber(VALUE));
          break;
        case "direction":
          sprite.setDirection(Cast.toNumber(VALUE));
          break;
        case "rotation style": {
          sprite.setRotationStyle(Cast.toString(VALUE));
          break;
        }
        case "costume #":
          sprite.setCostume(Cast.toNumber(VALUE) - 1);
          break;
        case "costume name": {
          const index = sprite.getCostumeIndexByName(Cast.toString(VALUE));
          if (index !== -1) sprite.setCostume(index);
          break;
        }
        case "size":
          sprite.setSize(Cast.toNumber(VALUE));
          break;
        case "layer": {
          const order = runtime.executableTargets;
          const current = order.indexOf(sprite);
          if (current < 1) break;
          const wanted = Math.max(
            1,
            Math.min(order.length - 1, Math.round(Cast.toNumber(VALUE)))
          );
          const delta = wanted - current;
          if (delta > 0) sprite.goForwardLayers(delta);
          else if (delta < 0) sprite.goBackwardLayers(-delta);
          break;
        }
        case "volume": {
          sprite.volume = Math.max(0, Math.min(100, Cast.toNumber(VALUE)));
          runtime.ext_scratch3_sound?._syncEffectsForTarget?.(sprite);
          break;
        }
        case "name": {
          const name = Cast.toString(VALUE);
          if (!name || name === sprite.getName()) break;
          try {
            Scratch.vm.renameSprite(sprite.id, name);
          } catch (error) {
            console.warn("Sprites: could not rename sprite", error);
          }
          break;
        }
        case "visible":
          sprite.setVisible(Cast.toBoolean(VALUE));
          break;
        case "draggable":
          sprite.setDraggable(Cast.toBoolean(VALUE));
          break;
      }
    }

    /**
     * @param {{ blockContainer: { getBranch: (arg0: any, arg1: number) => any; }; peekStack: () => any; }} thread
     * @param {VM.RenderedTarget} original
     * @param {VM.RenderedTarget} newTarget
     */
    runThreadInSprite(thread, original, newTarget) {
      const currentBlock = thread.peekStack();
      let sourceContainer = thread.blockContainer;
      let firstBlock = sourceContainer?.getBranch(currentBlock, 1);

      // A global procedure may be executing code stored in another sprite even
      // when the thread still points at the caller's block container. Find the
      // container which actually owns this C block and its nested branch.
      if (!firstBlock) {
        const checked = new Set([sourceContainer]);
        for (const target of runtime.targets) {
          const blocks = target?.blocks;
          if (!blocks || checked.has(blocks)) continue;
          checked.add(blocks);
          const branch = blocks.getBranch(currentBlock, 1);
          if (branch) {
            sourceContainer = blocks;
            firstBlock = branch;
            break;
          }
        }
      }
      if (!firstBlock) return;

      const sourceTarget = runtime.targets.find(
        (target) => target.blocks === sourceContainer
      );

      // _pushThread compiles immediately. Delay that until the independently
      // selected execution target and source blocks have both been assigned.
      const compilerEnabled = runtime.compilerOptions.enabled;
      runtime.compilerOptions.enabled = false;
      let newThread;
      try {
        newThread = runtime._pushThread(firstBlock, sourceTarget || original, {
          stackClick: false,
        });
      } finally {
        runtime.compilerOptions.enabled = compilerEnabled;
      }

      newThread.target = newTarget;
      newThread.blockContainer = sourceContainer;

      if (compilerEnabled) {
        // Do not reuse a target-specific cached result when this block runs for
        // several different sprites.
        newThread.stackClick = true;
        try {
          newThread.tryCompile();
        } finally {
          newThread.stackClick = false;
        }
      }
    }

    /**
     * @param {{ thread: any; target: any; }} util
     */
    runAsSprite({ ID }, util) {
      const sprite = this.findSprite(ID);
      if (!sprite) return;

      this.runThreadInSprite(util.thread, util.target, sprite);
    }

    cloneSprite({ ID }) {
      const sprite = this.findSprite(ID);
      if (!sprite) return;

      const clone = sprite.makeClone();
      if (clone) {
        runtime.addTarget(clone);
        clone.goBehindOther(sprite);
      }

      return clone ? clone.id : "";
    }
  }

  Scratch.extensions.register(new ddeSprites());
})(Scratch);
