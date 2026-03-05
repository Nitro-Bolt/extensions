// Name: Template
// ID: cubesterTemplate
// Description: Template Extension.
// By: CubesterYT <https://scratch.mit.edu/users/CubesterYT/>

// Version V.1.0.0

(function (Scratch) {
  "use strict";

  const icon = ""

  class Template {
    getInfo() {
      return {
        id: "cubesterTemplate",
        name: "Template",
        color1: "#000000",
        menuIconURI: icon,
        docsURI: "https://extensions.nitrobolt.org/CubesterYT/Template",

        blocks: [
          {
            opcode: "block",
            text: "block: [ARGUMENT]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              ARGUMENT: {
                type: Scratch.ArgumentType.STRING
              }
            }
          }
        ],
        menus: {
          MENU: {
            acceptReporters: true,
            items: ["item1","item2"]
          }
        }
      };
    }

    block (args) {
      alert(args.ARGUMENT);
    }
  }

  Scratch.extensions.register(new Template());
})(Scratch);