document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optional: stop observing once it has become visible
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Targets for scroll animations
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach(el => observer.observe(el));

  // Ambient Background Particle Animation
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: true });
    let particles = [];
    const particleCount = 60; // Minimalist count so it's not distracting

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; // Randomize initial y to fill screen immediately
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100; // Start slightly below screen
        this.size = Math.random() * 1.5 + 0.5; // Very small, subtle dots
        this.speedY = -(Math.random() * 0.3 + 0.1); // Slow upward float
        this.speedX = (Math.random() - 0.5) * 0.2; // Slight horizontal drift
        this.opacity = Math.random() * 0.5 + 0.1; // Max 60% opacity
        this.life = 0;
        this.maxLife = Math.random() * 1000 + 500; // Random lifetime
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.life++;

        // Fade out as it reaches end of life or top of screen
        if (this.life >= this.maxLife || this.y < -10) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Use the accent color but very dimly
        const fadeRatio = Math.max(0, 1 - (this.life / this.maxLife));
        ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity * fadeRatio})`;
        ctx.fill();
        ctx.closePath();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Mouse interaction variables
    let mouseX = -1000;
    let mouseY = -1000;
    
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        // Subtle mouse repulsion effect
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          p.x += dx * 0.01;
          p.y += dy * 0.01;
        }

        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }
});
