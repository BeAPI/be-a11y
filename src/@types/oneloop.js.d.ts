// src/@types/oneloop.js.d.ts
declare module 'oneloop.js' {
  export class ThrottledEvent {
    constructor(target: EventTarget, event: string);
    add(event: string, handler: (event: Event) => void): void;
  }
}
