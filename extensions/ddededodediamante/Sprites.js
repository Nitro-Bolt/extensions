// Name: Sprites
// ID: ddeSprites
// Description: Control and modify the project's sprites.
// By: ddededodediamante <https://github.com/ddededodediamante/>
// License: MPL-2.0

// Version V.1.1.0

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    window.alert('The extension "Sprites" must be ran unsandboxed!');
    throw new Error('The extension "Sprites" must be ran unsandboxed!');
  }

  const runtime = Scratch.vm.runtime;

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
              "x position",
              "y position",
              "direction",
              "rotation style",
              "costume #",
              "costume name",
              "size",
              "volume",
              "name",
              "origin",
            ],
          },
          SPRITE_BOOLS: {
            acceptReporters: true,
            items: ["visible", "draggable", "being dragged", "a clone"],
          },
          SPRITE_LISTS: {
            acceptReporters: true,
            items: ["costumes", "sounds", "clones"],
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
