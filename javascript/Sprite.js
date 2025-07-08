class Sprite {
    constructor(config) {
      this.image = new Image();
      this.image.src = config.src;
      this.image.onload = () => { this.isLoaded = true; };
  
      this.shadow = new Image();
      this.useShadow = true;
      if (this.useShadow) {
        this.shadow.src = "images/characters/shadow.png";
      }
      this.shadow.onload = () => { this.isShadowLoaded = true; };
  
      this.animations = config.animations || {
        "idle-down":  [[0,0]],
        "idle-right": [[0,1]],
        "idle-up":    [[0,2]],
        "idle-left":  [[0,3]],
        "walk-down":  [[1,0],[0,0],[3,0],[0,0]],
        "walk-right": [[1,1],[0,1],[3,1],[0,1]],
        "walk-up":    [[1,2],[0,2],[3,2],[0,2]],
        "walk-left":  [[1,3],[0,3],[3,3],[0,3]]
      };
      this.currentAnimation = "idle-down";
      this.currentAnimationFrame = 0;
  
      this.animationFrameLimit = config.animationFrameLimit || 16;
      this.animationFrameProgress = this.animationFrameLimit;
  
      this.gameObject = config.gameObject || {};
    }
  
    get frame() {
      const frames = this.animations[this.currentAnimation] || [];
      return frames.length ? frames[this.currentAnimationFrame] : [0,0];
    }
  
    setAnimation(key) {
      if (this.currentAnimation !== key) {
        this.currentAnimation = key;
        this.currentAnimationFrame = 0;
        this.animationFrameProgress = this.animationFrameLimit;
      }
    }
  
    updateAnimationProgress() {
      if (this.animationFrameProgress > 0) {
        this.animationFrameProgress -= 1;
        return;
      }
      this.animationFrameProgress = this.animationFrameLimit;
      this.currentAnimationFrame =
        (this.currentAnimationFrame + 1) %
        this.animations[this.currentAnimation].length;
    }
  
    draw(ctx, cameraPerson) {
      const SPRITE_W = 32;
      const SPRITE_H = 32;
  
      // original sprite top-left
      const x =
        this.gameObject.x - 8
        + utils.withGrid(10.5)
        - cameraPerson.x;
      const y =
        this.gameObject.y - 18
        + utils.withGrid(6)
        - cameraPerson.y;
  
      // draw shadow centered under feet
      if (this.isShadowLoaded) {
        const sw = this.shadow.width;
        const sh = this.shadow.height;
        const shadowX = x + (SPRITE_W - sw) + 1.5;
        const shadowY = y + (SPRITE_H - sh) - 4;
        ctx.drawImage(this.shadow, shadowX, shadowY, sw, sh);
      }
  
      // draw character at original x, y
      if (this.isLoaded) {
        const [frameX, frameY] = this.frame;
        ctx.drawImage(
          this.image,
          frameX * SPRITE_W,
          frameY * SPRITE_H,
          SPRITE_W,
          SPRITE_H,
          x,
          y,
          SPRITE_W,
          SPRITE_H
        );
        this.updateAnimationProgress();
      }
    }
  }
  
  