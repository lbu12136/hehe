class OverworldMap {
    constructor(config) {
      this.overworld = null;
      this.gameObjects = config.gameObjects;
      this.cutsceneSpaces = config.cutsceneSpaces || {};
      this.entryEvents = config.entryEvents || {};
      this.walls = config.walls || {};
  
      this.lowerImage = new Image();
      this.lowerImage.src = config.lowerSrc;
  
      this.upperImage = new Image();
      this.upperImage.src = config.upperSrc;
  
      this.isCutscenePlaying = false;
    }
  
    drawLowerImage(ctx, cameraPerson) {
      ctx.drawImage(
        this.lowerImage,
        utils.withGrid(10.5) - cameraPerson.x,
        utils.withGrid(6) - cameraPerson.y
      )
    }
  
    drawUpperImage(ctx, cameraPerson) {
      ctx.drawImage(
        this.upperImage,
        utils.withGrid(10.5) - cameraPerson.x,
        utils.withGrid(6) - cameraPerson.y
      )
    }
  
    isSpaceTaken(currentX, currentY, direction) {
      const { x, y } = utils.nextPosition(currentX, currentY, direction);
      return this.walls[`${x},${y}`] || false;
    }
  
    mountObjects() {
      Object.keys(this.gameObjects).forEach(key => {
  
        let object = this.gameObjects[key];
        object.id = key;
  
        //TODO: determine if this object should actually mount
        object.mount(this);
  
      });
  
      if (this.entryEvents.length) {
        this.startCutscene(this.entryEvents);
      }
    }
  
    async startCutscene(events) {
      this.isCutscenePlaying = true;
  
      for (let i = 0; i < events.length; i++) {
        const eventHandler = new OverworldEvent({
          event: events[i],
          map: this,
        })
        await eventHandler.init();
      }
  
      this.isCutscenePlaying = false;
  
      //Reset NPCs to do their idle behavior
      Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }
  
    checkForActionCutscene() {
      const me = this.gameObjects["me"];
      const nextCoords = utils.nextPosition(me.x, me.y, me.direction);
      const match = Object.values(this.gameObjects).find(object => {
        return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
      });
      // test to detect if program can identify if "me" is near a person to interact with 
      console.log({ match })
  
      if (!this.isCutscenePlaying && match && match.talking.length) {
        this.startCutscene(match.talking[0].events)
      }
    }
  
    checkForFootstepCutscene() {
      const me = this.gameObjects["me"];
      const match = this.cutsceneSpaces[`${me.x},${me.y}`];
      if (!this.isCutscenePlaying && match) {
        // console.log({match})
        this.startCutscene(match[0].events)
      }
    }
  
  
    addWall(x, y) {
      this.walls[`${x},${y}`] = true;
    }
    removeWall(x, y) {
      delete this.walls[`${x},${y}`]
    }
    moveWall(wasX, wasY, direction) {
      this.removeWall(wasX, wasY);
      const { x, y } = utils.nextPosition(wasX, wasY, direction);
      this.addWall(x, y);
    }
  }
  
  function createHorizontalWall(walls, y, startX, endX) {
    for (let x = startX; x <= endX; x++) {
      walls[utils.asGridCoord(x, y)] = true;
    }
  }
  
  function createVerticalWall(walls, x, startY, endY) {
    for (let y = startY; y <= endY; y++) {
      walls[utils.asGridCoord(x, y)] = true;
    }
  }
  
  window.OverworldMaps = {
    chunja: {
      lowerSrc: "/images/map/chunja_demo.png",
      upperSrc: "/images/map/DemoUpper.png",
      gameObjects: {
        me: new Person({ // evelyn
          isPlayerControlled: true,
          x: utils.withGrid(6.5),
          y: utils.withGrid(4.5),
        }),
        npcA: new Person({ // ibrahim
          x: utils.withGrid(2.7),
          y: utils.withGrid(8.5),
          src: "/images/characters/ibrahim.gif",
          behaviorLoop: [
  
            { type: "stand", direction: "up", time: 1000 },
            { type: "stand", direction: "down", time: 1000 },
            { type: "walk", direction: "left" },
            { type: "walk", direction: "left" },
            { type: "walk", direction: "left" },
            { type: "walk", direction: "left" },
            { type: "walk", direction: "down" },
            { type: "walk", direction: "down" },
            { type: "walk", direction: "down" },
            { type: "walk", direction: "left" },
            { type: "walk", direction: "left" },
            { type: "stand", direction: "down", time: 3000 },

            { type: "walk", direction: "right" },
            { type: "walk", direction: "right" },
            { type: "walk", direction: "up" },
            { type: "walk", direction: "up" },
            { type: "walk", direction: "up" },
            { type: "walk", direction: "right" },
            { type: "walk", direction: "right" },
            { type: "walk", direction: "right" },
            { type: "walk", direction: "right" },
            { type: "stand", direction: "up" },

          ],
        //   talking: [
        //     {
        //       events: [
        //         { type: "textMessage", text: "exmaple text: hello hello!", faceMe: "npcA" },
        //       ]
        //     }
        //   ]
        }),
      },
      walls: (() => {
        const walls = {}; 
        createVerticalWall(walls, 1.5, 3.5, 3.5);
        createVerticalWall(walls, 2.5, 3.5, 3.5);
        createVerticalWall(walls, 3.5, 3.5, 3.5);
        createVerticalWall(walls, 4.5, 3.5, 3.5);

        createVerticalWall(walls, 6.5, 4.5, 4.5);
        createVerticalWall(walls, 7.5, 4.5, 4.5);
        createVerticalWall(walls, 8.5, 4.5, 4.5);
        createVerticalWall(walls, 9.5, 4.5, 4.5);

        createHorizontalWall(walls, 5.5, 10.5, 10.5);
        createHorizontalWall(walls, 6.5, 9.0, 9.0);
        createHorizontalWall(walls, 6.5, 9.5, 9.5);
        return walls
      })(),
    },
  }
  