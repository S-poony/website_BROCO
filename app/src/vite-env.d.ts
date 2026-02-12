/// <reference types="vite/client" />

declare global {
  interface Window {
    gsap: typeof import('gsap');
    ScrollTrigger: typeof import('gsap/ScrollTrigger');
  }
}

export {};
