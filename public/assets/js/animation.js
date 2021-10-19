import * as THREE from 'three';

export default class Animation {
  constructor(scene, animations) {
    this.scene = scene;
    this.animations = animations;

    this.mixer = new THREE.AnimationMixer(this.scene);
  }

  playClipByIndex(index) {
    // (mixer.clipAction() will also take a name string if that works better for your setup)
    this.action = this.mixer.clipAction(this.animations[index]);
    this.action.reset();
    this.action.timeScale = 5;
    this.action.setLoop(THREE.LoopOnce);
    this.action.clampWhenFinished = true;
    this.action.play();
  }

  // assumes that the mixer has already played
  playClipReverseByIndex(index) {
    // (mixer.clipAction() will also take a name string if that works better for your setup)
    this.action = this.mixer.clipAction(this.animations[index]);
    this.action.paused = false;
    this.action.timeScale = -5;
    this.action.setLoop(THREE.LoopOnce);      
    this.action.play();
  }

  // will force the mixer to play in reverse no matter what
  playClipReverseByIndex_Forced(index) {
    this.action = this.mixer.clipAction(this.animations[index]);

    if(this.action.time === 0) {
        this.action.time = this.action.getClip().duration;
    }
    
    this.action.paused = false;
    this.action.setLoop(THREE.LoopOnce);      
    this.action.timeScale = -1;
    this.action.play();
  }

  // Call update in loop
  update(delta) {
    if(this.mixer) {
      this.mixer.update(delta);
    }
  }
}