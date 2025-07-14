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


  // Draws chunja_demo.png to the page
  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y

      // Keeps the game container stationary
      // this.lowerImage,
      // 0,
      // 0
    )
  }

  // Draws DemoUpper.png to the page
  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraPerson.x,
      utils.withGrid(6) - cameraPerson.y

      // Keeps the game container stationary
      // this.upperImage,
      // 0,
      // 0
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
    lowerSrc: "images/map/chunja_demo.png",
    upperSrc: "images/map/DemoUpper.png",
    gameObjects: {
      me: new Person({ // evelyn
        isPlayerControlled: true,
        x: utils.withGrid(7),
        y: utils.withGrid(3.5),
      }),
      npcA: new Person({ // ibrahim
        x: utils.withGrid(3.2),
        y: utils.withGrid(8.5),
        src: "images/characters/ibrahim.png",
        behaviorLoop: [

          // behavior loop 1
          { type: "stand", direction: "up", time: 1000 },
          { type: "stand", direction: "down", time: 500 },
          { type: "stand", direction: "right", time: 500 },
          { type: "stand", direction: "down", time: 500 },

          { type: "walk", direction: "down" },
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
          { type: "walk", direction: "up" },
          { type: "stand", direction: "up", time: 1000 },

          // // behavior loop 2
          { type: "stand", direction: "up", time: 1000 },
          { type: "stand", direction: "down", time: 500 },
          { type: "stand", direction: "right", time: 500 },
          { type: "stand", direction: "down", time: 500 },

          { type: "walk", direction: "down" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "down", time: 3000 },

          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "up" },
          { type: "stand", direction: "up", time: 1000 },

          // behavior loop 3
          { type: "stand", direction: "down", time: 500 },
          { type: "stand", direction: "right", time: 500 },
          { type: "stand", direction: "down", time: 500 },

          { type: "walk", direction: "down" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
          { type: "stand", direction: "right", time: 3000 },

          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "up" },
          { type: "stand", direction: "up", time: 1000 },

        ],

        //   talking: [
        //     {
        //       events: [
        //         { type: "textMessage", text: "exmaple text: hello hello!", faceMe: "npcA" },
        //       ]
        //     }
        //   ]
      }),
      npcB: new Person({ // clarence
        x: utils.withGrid(2),
        y: utils.withGrid(3.5),
        src: "images/characters/clarence.png",
        behaviorLoop: [

          // behavior loop 1
          { type: "stand", direction: "down", time: 2500 },
          { type: "stand", direction: "right", time: 500 },
          { type: "stand", direction: "down", time: 2500 },
          { type: "stand", direction: "left", time: 2000 },
        ],

        //   talking: [
        //     {
        //       events: [
        //         { type: "textMessage", text: "exmaple text: hello hello!", faceMe: "npcA" },
        //       ]
        //     }
        //   ]
      }),
      npcC: new Person({ // eddie
        x: utils.withGrid(3),
        y: utils.withGrid(3.5),
        src: "images/characters/eddie.png",
        behaviorLoop: [

          // behavior loop 1
          { type: "stand", direction: "down", time: 100 },
          { type: "stand", direction: "right", time: 100 },
          { type: "stand", direction: "down", time: 100 },
          { type: "stand", direction: "up", time: 100 },
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
      //back of doorway
      createVerticalWall(walls, 7, 1.5, 1.5);
      createVerticalWall(walls, 6, 2.5, 2.5);
      createVerticalWall(walls, 8, 2.5, 2.5);

      //left side of doorway
      createVerticalWall(walls, 6, 3.5, 3.5);
      createVerticalWall(walls, 5, 2.5, 2.5);
      createVerticalWall(walls, 4, 2.5, 2.5);
      createVerticalWall(walls, 3, 2.5, 2.5);
      createVerticalWall(walls, 2, 2.5, 2.5);
      createVerticalWall(walls, 1, 2.5, 2.5);

      //far left wall
      createVerticalWall(walls, 0, 1.5, 3.5);
      createVerticalWall(walls, 0, 3.5, 2.5);
      createVerticalWall(walls, 0, 3.5, 3.5);
      createVerticalWall(walls, 0, 4.5, 4.5);
      createVerticalWall(walls, 0, 5.5, 5.5);
      createVerticalWall(walls, 0, 6.5, 6.5);
      createVerticalWall(walls, 0, 7.5, 7.5);
      createVerticalWall(walls, 0, 8.5, 8.5);
      createVerticalWall(walls, 0, 9.5, 9.5);

      //right side of doorway
      createVerticalWall(walls, 8, 3.5, 3.5);
      createVerticalWall(walls, 9, 2.5, 2.5);
      createVerticalWall(walls, 10, 2.5, 2.5);
      createVerticalWall(walls, 11, 9.5, 9.5);

      //doorway on right
      createVerticalWall(walls, 10, 1.5, 1.5);
      createVerticalWall(walls, 11, 0.5, 0.5);

      //far right wall 
      createVerticalWall(walls, 12, 1.5, 3.5);
      createVerticalWall(walls, 12, 3.5, 2.5);
      createVerticalWall(walls, 12, 3.5, 3.5);
      createVerticalWall(walls, 12, 4.5, 4.5);
      createVerticalWall(walls, 11, 5.5, 5.5);

      //bottom wall
      createVerticalWall(walls, 1, 10.5, 10.5);
      createVerticalWall(walls, 2, 10.5, 10.5);
      createVerticalWall(walls, 3, 10.5, 10.5);
      createVerticalWall(walls, 4, 10.5, 10.5);
      createVerticalWall(walls, 4, 11.5, 11.5);
      createVerticalWall(walls, 5, 11.5, 11.5);
      createVerticalWall(walls, 6, 11.5, 11.5);
      createVerticalWall(walls, 7, 11.5, 11.5);
      createVerticalWall(walls, 7, 10.5, 10.5);
      createVerticalWall(walls, 8, 10.5, 10.5);
      createVerticalWall(walls, 9, 10.5, 10.5);
      createVerticalWall(walls, 10, 10.5, 10.5);
      createVerticalWall(walls, 11, 10.5, 10.5);
      createVerticalWall(walls, 12, 10.5, 10.5);

      //middles tables
      createVerticalWall(walls, 7, 5.5, 5.5);
      createVerticalWall(walls, 7, 6.5, 6.5);
      createVerticalWall(walls, 7, 7.5, 7.5);
      createVerticalWall(walls, 7, 8.5, 8.5);

      //right tables
      createVerticalWall(walls, 10, 5.5, 5.5);
      createVerticalWall(walls, 10, 6.5, 6.5);
      createVerticalWall(walls, 10, 7.5, 7.5);
      createVerticalWall(walls, 10, 8.5, 8.5);

      //grid x 4
      createVerticalWall(walls, 4, 4.5, 4.5);
      createVerticalWall(walls, 4, 6.5, 6.5);
      createVerticalWall(walls, 4, 8.5, 8.5);

      //grid x 3
      createVerticalWall(walls, 3, 4.5, 4.5);
      createVerticalWall(walls, 3, 6.5, 6.5);
      createVerticalWall(walls, 3, 8.5, 8.5);

      //grid x 2
      createVerticalWall(walls, 2, 4.5, 4.5);
      createVerticalWall(walls, 2, 6.5, 6.5);
      createVerticalWall(walls, 2, 8.5, 8.5);
      return walls
    })(),
  },
}
