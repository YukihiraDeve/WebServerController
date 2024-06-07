// Fichier: ParticleBackground.js

import React, { useEffect, useRef } from 'react';
import { GlowParticle } from './GlowParticle';

const color = [
    { r: 55, g: 25, b: 206 }, 
    { r: 44, g: 73, b: 127 },
    { r: 20, g: 104, b: 62 }, 
    { r: 139, g: 136, b: 166 }  
];

const PI2 = Math.PI * 2;

class ParticleApp {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.pixelRatio = (window.devicePixelRatio > 1) ? 2 : 1;

        this.totalParticles = 5;
        this.particles = [];
        this.maxRadius = 900;
        this.minRadius = 400;

        this.resize();
        window.addEventListener('resize', this.resize.bind(this), false);
    }

    resize() {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = document.body.clientHeight;
        this.canvas.width = this.stageWidth * this.pixelRatio;
        this.canvas.height = this.stageHeight * this.pixelRatio;
        this.ctx.scale(this.pixelRatio, this.pixelRatio);

        this.ctx.globalCompositeOperation = 'saturation';

        this.createParticles();
    }

    createParticles() {
        let curColor = 0;
        this.particles = [];

        for (let i = 0; i < this.totalParticles; i++) {
            const item = new GlowParticle(
                Math.random() * this.stageWidth,
                Math.random() * this.stageHeight,
                Math.random() * (this.maxRadius - this.minRadius) + this.minRadius,
                color[curColor]
            );
            this.particles[i] = item;

            curColor++;
            if (curColor >= color.length) {
                curColor = 0;
            }
        }
    }

    animate() {
        window.requestAnimationFrame(this.animate.bind(this));
        this.ctx.clearRect(0, 0, this.stageWidth * this.pixelRatio, this.stageHeight * this.pixelRatio);

        for (let i = 0; i < this.totalParticles; i++) {
            const item = this.particles[i];
            item.animate(this.ctx, this.stageWidth, this.stageHeight);
        }
    }
}

function ParticleBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const particleApp = new ParticleApp(canvas, ctx);
        particleApp.animate();

        return () => {
            window.removeEventListener('resize', particleApp.resize.bind(particleApp));
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-1" style={{background: 'transparent' }} />;
}

export default ParticleBackground;