class Overworld {
    constructor(config) {
      this.element = config.element;
      this.canvas = this.element.querySelector(".game-canvas");
      this.ctx = this.canvas.getContext("2d");
      this.map = null;
  
      this.fadeOverlay = document.createElement("div");
      this.fadeOverlay.style.position = "absolute";
      this.fadeOverlay.style.top = 0;
      this.fadeOverlay.style.left = 0;
      this.fadeOverlay.style.width = "100%";
      this.fadeOverlay.style.height = "100%";
      this.fadeOverlay.style.backgroundColor = "black";
      this.fadeOverlay.style.transition = "opacity 5s ease-in-out";
      this.fadeOverlay.style.opacity = "1";  
      this.element.appendChild(this.fadeOverlay);
    }
  
    startGameLoop() {
      const step = () => {
        // Clear off the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
        // Establish the camera person
        const cameraPerson = this.map.gameObjects.me;
  
        // Update all objects
        Object.values(this.map.gameObjects).forEach(object => {
          object.update({
            arrow: this.directionInput.direction,
            map: this.map,
          })
        })
  
        // Draw Lower layer
        this.map.drawLowerImage(this.ctx, cameraPerson);
  
        // Draw Game Objects
        Object.values(this.map.gameObjects).sort((a,b) => {
          return a.y - b.y;
        }).forEach(object => {
          object.sprite.draw(this.ctx, cameraPerson);
        })
  
        // Draw Upper layer
        this.map.drawUpperImage(this.ctx, cameraPerson);
  
        // Request next frame
        requestAnimationFrame(() => {
          step();
        })
      }
  
      // Start the fade-out effect (fade-in the game world)
      setTimeout(() => {
        this.fadeOverlay.style.opacity = "0"; 
      }, 100); // Delay a little to ensure the black screen is visible at the start
  
      step();
    }
  
    bindActionInput() {
      new KeyPressListener("Enter", () => {
        // Is there anyone to talk to?
        this.map.checkForActionCutscene();
      })
    }
  
    bindHeroPositionCheck() {
      document.addEventListener("PersonWalkingComplete", e => {
        if (e.detail.whoId === "me") {
          // Check for cutscenes based on position
          this.map.checkForFootstepCutscene();
        }
      })
    }
  
    startMap(mapConfig) {
      this.map = new OverworldMap(mapConfig);
      this.map.overworld = this;
      this.map.mountObjects();
    }
  
    init() {
      this.startMap(window.OverworldMaps.chunja
      );
      this.bindActionInput();
      this.bindHeroPositionCheck();
  
      this.directionInput = new DirectionInput();
      this.directionInput.init();
  
      this.startGameLoop();
  
      this.map.startCutscene([
        { who: "me", type: "stand", direction: "down", time: 4000 },
        { who: "me", type: "walk", direction: "down"},
        { who: "me", type: "stand", direction: "down", time: 1000 },
        { who: "me", type: "stand", direction: "left", time: 500},
        { who: "me", type: "stand", direction: "down", time: 500},
        { who: "me", type: "stand", direction: "right", time: 500},
        { who: "me", type: "stand", direction: "down", time: 500},
        { type: "textMessage", text: "!!!!!!!!!!!!!!" },
        { who: "me", type: "walk", direction: "left"},
        { who: "me", type: "walk", direction: "left"},
        { who: "me", type: "walk", direction: "down"},
        { who: "me", type: "walk", direction: "down"},
        { who: "me", type: "walk", direction: "down"},
        { who: "me", type: "walk", direction: "left"},
        { who: "me", type: "stand", direction: "left"},

        { type: "textMessage", text: "Evelyn: Ibrahim" },

        { who: "npcA", type: "stand", direction: "right"},
        { type: "textMessage", text: "Ibra: EVELYNN~~~!" },

        { type: "textMessage", text: "Evelyn: You're such an alcoholic..." },
        { type: "textMessage", text: "Evelyn: It's over" },
        { type: "textMessage", text: "Evelyn: Go back to New Zealand. I'm leaving you" },
        { type: "textMessage", text: "Evelyn: Goodbye!" },


        { who: "me", type: "walk", direction: "right"},
        { who: "me", type: "walk", direction: "up"},
        { who: "me", type: "walk", direction: "up"},
        { who: "me", type: "walk", direction: "up"},
        { who: "me", type: "walk", direction: "right"},
        { who: "me", type: "walk", direction: "right"},
        { who: "me", type: "walk", direction: "up"},
        { who: "me", type: "walk", direction: "up"},
        { who: "me", type: "stand", direction: "up"},


        { who: "npcA", type: "walk", direction: "right"},
        { who: "npcA", type: "walk", direction: "right"},
        { who: "npcA", type: "walk", direction: "up"},
        { who: "npcA", type: "walk", direction: "up"},
        { who: "npcA", type: "stand", direction: "down"},


        { type: "textMessage", text: "Ibra: ...." },
        { type: "textMessage", text: "Ibra: wait..."},
        { type: "textMessage", text: "Ibra: but I need to finish my soju bottles..." },

        { who: "npcA", type: "walk", direction: "up"},
        { who: "npcA", type: "walk", direction: "right"},
        { who: "npcA", type: "walk", direction: "right"},
        { who: "npcA", type: "walk", direction: "right"},
        { who: "npcA", type: "walk", direction: "right"},
        { who: "npcA", type: "stand", direction: "up"},

        { type: "textMessage", text: "Ibra: hehehehehehe"},

      ])
    }
  }