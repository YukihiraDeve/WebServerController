// Fichier: GlowParticle.js
const PI2 = Math.PI * 2;
export class GlowParticle {
    constructor(x, y, radius, rgb) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.rgb = rgb;

        this.vx = Math.random() * 0.2;
        this.vy = Math.random() * 0.2;

        this.sinValue = Math.random();
    }

    animate(ctx, stageWidth, stageHeight) {
        this.sinValue += 0.001;
        // Ensure the radius is always positive and not too small
        this.radius += Math.sin(this.sinValue);

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) {
            this.vx *= -1;
            this.x += 1;
        } else if (this.x > stageWidth) {
            this.vx *= -1;
            this.x -= 1;
        }

        if (this.y < 0) {
            this.vy *= -1;
            this.y += 1;
        } else if (this.y > stageHeight) {
            this.vy *= -1;
            this.y -= 1;
        }

        ctx.beginPath();
        // Use `baseRadius` for the outer radius in `createRadialGradient`
        const g = ctx.createRadialGradient(
            this.x, 
            this.y,
            this.radius * 0.1, 
            this.x,
            this.y,
            this.radius
        );
        g.addColorStop(0, `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 1)`);
        g.addColorStop(1, `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, 0)`);
        ctx.fillStyle = g;
        ctx.arc(this.x, this.y, this.radius, 0, PI2, false);
        ctx.fill();
    }
}