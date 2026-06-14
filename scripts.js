/* -------------------------------------------------------------
 * SYNTHESIZED AUDIO MANAGER (WEB AUDIO API)
 * ------------------------------------------------------------- */
class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlayingMusic = false;
    this.melodyTimeout = null;
    this.musicBoxNotes = [
      { note: 'C4', dur: 0.5 }, { note: 'C4', dur: 0.5 }, { note: 'D4', dur: 1.0 }, { note: 'C4', dur: 1.0 }, { note: 'F4', dur: 1.0 }, { note: 'E4', dur: 2.0 },
      { note: 'C4', dur: 0.5 }, { note: 'C4', dur: 0.5 }, { note: 'D4', dur: 1.0 }, { note: 'C4', dur: 1.0 }, { note: 'G4', dur: 1.0 }, { note: 'F4', dur: 2.0 },
      { note: 'C4', dur: 0.5 }, { note: 'C4', dur: 0.5 }, { note: 'C5', dur: 1.0 }, { note: 'A4', dur: 1.0 }, { note: 'F4', dur: 1.0 }, { note: 'E4', dur: 1.0 }, { note: 'D4', dur: 2.0 },
      { note: 'A#4', dur: 0.5 }, { note: 'A#4', dur: 0.5 }, { note: 'A4', dur: 1.0 }, { note: 'F4', dur: 1.0 }, { note: 'G4', dur: 1.0 }, { note: 'F4', dur: 2.5 }
    ];
    this.frequencies = {
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00
    };
    this.noteIndex = 0;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPopSound() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    // Quick frequency sweep down for realistic popping sound
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.12);
    
    gainNode.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playChimeSound() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    // Upward arpeggio for magical sparkle effect
    const now = this.ctx.currentTime;
    const notes = [659.25, 783.99, 880.00, 1046.50]; // E5, G5, A5, C6
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gainNode.gain.setValueAtTime(0.0, now + index * 0.08);
      gainNode.gain.linearRampToValueAtTime(0.12, now + index * 0.08 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.45);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.55);
    });
  }

  playCandleBlowSound() {
    if (this.isMuted || !this.ctx) return;
    this.init();
    
    const bufferSize = this.ctx.sampleRate * 0.4; // 0.4 seconds of blow
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Fill buffer with white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;
    
    // Bandpass filter to sound like a breath/blow
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.4);
    
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
    
    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    noiseNode.start();
    noiseNode.stop(this.ctx.currentTime + 0.4);
  }

  playHappyBirthdayTheme() {
    this.init();
    this.isPlayingMusic = true;
    this.noteIndex = 0;
    this.playNextMusicBoxNote();
  }

  playNextMusicBoxNote() {
    if (!this.isPlayingMusic || this.isMuted) return;
    
    const noteData = this.musicBoxNotes[this.noteIndex];
    const freq = this.frequencies[noteData.note];
    const duration = noteData.dur * 0.55; // Adjust tempo
    
    if (freq) {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      // Plucked chime overlay to mimic a physical music box tine
      const overtone = this.ctx.createOscillator();
      const overtoneGain = this.ctx.createGain();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2, this.ctx.currentTime); // 1st overtone
      
      gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration * 2.5); // long resonance ring
      
      overtoneGain.gain.setValueAtTime(0, this.ctx.currentTime);
      overtoneGain.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 0.015);
      overtoneGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration * 0.6);
      
      osc.connect(gainNode);
      overtone.connect(overtoneGain);
      
      gainNode.connect(this.ctx.destination);
      overtoneGain.connect(this.ctx.destination);
      
      osc.start();
      overtone.start();
      
      osc.stop(this.ctx.currentTime + duration * 3);
      overtone.stop(this.ctx.currentTime + duration * 3);
    }
    
    this.noteIndex = (this.noteIndex + 1) % this.musicBoxNotes.length;
    // Add extra pause on final chord
    const gap = this.noteIndex === 0 ? duration + 1.2 : duration;
    
    this.melodyTimeout = setTimeout(() => {
      this.playNextMusicBoxNote();
    }, gap * 1000);
  }

  stopMusic() {
    this.isPlayingMusic = false;
    clearTimeout(this.melodyTimeout);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopMusic();
    } else {
      this.playHappyBirthdayTheme();
    }
    return this.isMuted;
  }
}

const audio = new AudioManager();

/* -------------------------------------------------------------
 * BALLOON CANVAS SYSTEM (TABS 1)
 * ------------------------------------------------------------- */
class BalloonGame {
  constructor(canvasId, countSpanId, onPopCallback) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.countSpan = document.getElementById(countSpanId);
    this.onPop = onPopCallback;
    this.balloons = [];
    this.particles = [];
    this.animationId = null;
    this.isRunning = false;
    this.allWishes = [
      "There's something about the way you laugh — it's honest, it's loud, and it makes everyone around you feel like everything's going to be okay. 🌿",
      "You have this quiet strength that most people don't even notice, but I do. You handle things with so much grace it's almost unfair. 🍃",
      "I've seen you stay kind even when the world gave you every reason not to be. That takes more courage than people realise. 🌙",
      "You walk into a room and the energy just shifts — not because you try, but because you're genuinely that person. ☁️✨",
      "The way you care about the little things — remembering small details, checking in on people — that's rare, and it matters more than you think. 🌷",
      "I think what I admire most is that you never pretend to be someone you're not. In a world full of filters, you're refreshingly real. 🪴",
      "You have this way of making even ordinary moments feel a little more alive. I don't think you even realise you do it. 🌤️",
      "Some people light up a room. You light up the people in it. There's a difference, and you're the difference. 🕊️",
      "You've grown so much this year and still stayed the same good-hearted person you've always been. That's not easy — and I respect that. 🌾",
      "Happy Birthday to someone who deserves every good thing heading her way — and trust me, a lot of good things are heading your way. 🎂🤍"
    ];
    this.maxPops = this.allWishes.length; // exactly 10
    this.wishQueue = [];  // shuffled queue, assigned one per balloon
    this.poppedCount = 0;
    this.isComplete = false;
    
    // Bind resize
    window.addEventListener('resize', () => this.resizeCanvas());
    this.resizeCanvas();
    
    // Touch/click coordinates helper
    this.canvas.addEventListener('mousedown', (e) => this.handlePress(e.offsetX, e.offsetY));
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      this.handlePress(x, y);
    });
  }

  // Fisher-Yates shuffle
  shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
  }

  start() {
    if (this.isRunning) return;
    // If game was already completed, just keep the animation loop for particles but don't reset
    if (this.isComplete) {
      this.isRunning = true;
      this.loop();
      return;
    }
    this.isRunning = true;
    this.balloons = [];
    // Shuffle and build the wish queue fresh
    this.wishQueue = this.shuffleArray(this.allWishes);
    // Seed initial balloons (up to 5, or however many wishes remain)
    const initialCount = Math.min(5, this.wishQueue.length);
    for (let i = 0; i < initialCount; i++) {
      this.spawnBalloon(true); // spawn at random heights initially
    }
    this.loop();
  }

  stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationId);
  }

  spawnBalloon(randomHeight = false) {
    // Don't spawn if no wishes left in the queue
    if (this.wishQueue.length === 0) return;

    const wish = this.wishQueue.pop(); // take next unique wish

    const radius = 30 + Math.random() * 12;
    const x = radius + Math.random() * (this.canvas.width - radius * 2);
    const y = randomHeight ? (Math.random() * (this.canvas.height - 100) + 100) : (this.canvas.height + radius + 10);
    const speed = 0.8 + Math.random() * 0.9;
    const wobbleSpeed = 0.01 + Math.random() * 0.015;
    const wobbleRange = 15 + Math.random() * 20;
    const angle = Math.random() * Math.PI * 2;
    
    const colors = [
      { fill: '#ff5e97', light: '#ffb3cc', string: '#d83e74' }, // Rose Pink
      { fill: '#f3cf90', light: '#fff4e2', string: '#d8a956' }, // Gold
      { fill: '#d2b3ff', light: '#f2e8ff', string: '#a87bf5' }, // Lavender
      { fill: '#ff7799', light: '#ffd1df', string: '#e54b73' }, // Coral Pink
      { fill: '#a2f5d0', light: '#e4fff4', string: '#52cda0' }  // Mint Pastel
    ];
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    this.balloons.push({
      x, y, radius, speed, wobbleSpeed, wobbleRange, angle, color,
      wish: wish,
      baseX: x
    });
  }

  spawnParticles(x, y, color) {
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1, // slight upward bias
        radius: 2 + Math.random() * 3,
        color: color.fill,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.02
      });
    }
  }

  handlePress(x, y) {
    // Don't allow pops if game is complete
    if (this.isComplete) return;

    for (let i = this.balloons.length - 1; i >= 0; i--) {
      const b = this.balloons[i];
      // Circle distance check
      const dist = Math.hypot(x - b.x, y - b.y);
      if (dist < b.radius + 10) { // slight grace padding for touch
        // Pop!
        this.spawnParticles(b.x, b.y, b.color);
        audio.playPopSound();
        
        // Remove and trigger wish
        const poppedBalloon = this.balloons.splice(i, 1)[0];
        this.poppedCount++;
        this.countSpan.textContent = this.poppedCount;
        
        this.onPop(poppedBalloon.wish);
        
        // Check if all 10 are popped
        if (this.poppedCount >= this.maxPops) {
          this.isComplete = true;
          // Update hint text
          const hint = document.getElementById('balloon-hint');
          if (hint) hint.textContent = '🎉 You popped them all!';
          return;
        }
        
        // Spawn a replacement balloon only if wishes remain in the queue
        setTimeout(() => {
          if (this.isRunning && this.wishQueue.length > 0) {
            this.spawnBalloon(false);
          }
        }, 800);
        
        break;
      }
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 1. Draw and update balloons
    this.balloons.forEach((b, index) => {
      b.y -= b.speed;
      b.angle += b.wobbleSpeed;
      b.x = b.baseX + Math.sin(b.angle) * b.wobbleRange;
      
      // If float out of view, recycle to bottom
      if (b.y < -b.radius * 2) {
        b.y = this.canvas.height + b.radius + 10;
        b.baseX = b.radius + Math.random() * (this.canvas.width - b.radius * 2);
      }
      
      // Draw balloon string
      this.ctx.beginPath();
      this.ctx.moveTo(b.x, b.y + b.radius);
      // curve string slightly based on wobble
      this.ctx.quadraticCurveTo(
        b.x - Math.sin(b.angle) * 10, b.y + b.radius + b.radius * 0.6,
        b.x, b.y + b.radius + b.radius * 1.5
      );
      this.ctx.strokeStyle = b.color.string;
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();
      
      // Draw balloon shape (oval-ish)
      this.ctx.beginPath();
      this.ctx.save();
      this.ctx.translate(b.x, b.y);
      this.ctx.scale(1, 1.15); // slightly vertical oval
      this.ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
      
      // Gradient fill
      const grad = this.ctx.createRadialGradient(
        -b.radius * 0.3, -b.radius * 0.3, b.radius * 0.1,
        0, 0, b.radius
      );
      grad.addColorStop(0, b.color.light);
      grad.addColorStop(0.3, b.color.fill);
      grad.addColorStop(1, b.color.string);
      
      this.ctx.fillStyle = grad;
      this.ctx.fill();
      this.ctx.restore();
      
      // Draw tie triangle at bottom of balloon
      this.ctx.beginPath();
      this.ctx.moveTo(b.x, b.y + b.radius * 1.05);
      this.ctx.lineTo(b.x - 6, b.y + b.radius * 1.05 + 8);
      this.ctx.lineTo(b.x + 6, b.y + b.radius * 1.05 + 8);
      this.ctx.closePath();
      this.ctx.fillStyle = b.color.string;
      this.ctx.fill();
    });
    
    // 2. Draw and update shards particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05; // gravity
      p.alpha -= p.decay;
      
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    }
    
    if (this.isRunning) {
      this.animationId = requestAnimationFrame(() => this.loop());
    }
  }
}

/* -------------------------------------------------------------
 * POLAROID GALLERY SYSTEM (TAB 2)
 * ------------------------------------------------------------- */
class PolaroidGallery {
  constructor(stackId, prevBtnId, nextBtnId, counterId, indexId) {
    this.stack = document.getElementById(stackId);
    this.prevBtn = document.getElementById(prevBtnId);
    this.nextBtn = document.getElementById(nextBtnId);
    this.counter = document.getElementById(counterId);
    this.indexSpan = document.getElementById(indexId);
    this.memories = [
      {
        emoji: "👑",
        title: "The Queen Herself",
        desc: "Sassy, smart, and a little bad-assy. Don't ever let anyone dull your shine!",
        gradient: "linear-gradient(135deg, #ffd3e2 0%, #ff83b5 100%)"
      },
      {
        emoji: "☕✨",
        title: "Late Night Talks",
        desc: "For all the late-night tea, the secrets shared, and the coffee dates yet to come.",
        gradient: "linear-gradient(135deg, #e3c4ff 0%, #a675ff 100%)"
      },
      {
        emoji: "💖🌸",
        title: "Pure Gold Heart",
        desc: "Your laughter is literally contagious, and your kindness makes the world ten times warmer.",
        gradient: "linear-gradient(135deg, #ffeed1 0%, #f6b553 100%)"
      },
      {
        emoji: "🎂🥳",
        title: "Make A Wish",
        desc: "Here's to celebrating you today and making memories that make us smile forever.",
        gradient: "linear-gradient(135deg, #d3f9ff 0%, #5ee2ff 100%)"
      }
    ];
    this.currentIndex = 0;
    this.cards = [];
    
    this.initGallery();
    
    this.nextBtn.addEventListener('click', () => this.slideNext());
    this.prevBtn.addEventListener('click', () => this.slidePrev());
  }

  initGallery() {
    this.stack.innerHTML = "";
    this.counter.textContent = this.memories.length;
    this.indexSpan.textContent = this.currentIndex + 1;
    
    // Inject Polaroid cards backwards so the first one sits on top
    for (let i = this.memories.length - 1; i >= 0; i--) {
      const data = this.memories[i];
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      card.setAttribute('data-idx', i);
      
      card.innerHTML = `
        <div class="polaroid-photo-frame">
          <div class="photo-placeholder-svg" style="background: ${data.gradient}">
            <span style="font-size: 5rem; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.15));">${data.emoji}</span>
          </div>
        </div>
        <div class="polaroid-caption">${data.title}</div>
        <p style="font-size: 0.75rem; text-align: center; color: #666; margin-top: 8px; line-height: 1.4; padding: 0 4px;">${data.desc}</p>
      `;
      
      this.stack.appendChild(card);
      this.cards.push(card);
      
      // Tap card to slide to next
      card.addEventListener('click', () => {
        if (i === this.currentIndex) {
          this.slideNext();
        }
      });
    }
    this.cards.reverse(); // align indices
    this.updateZIndices();
  }

  updateZIndices() {
    this.cards.forEach((card, i) => {
      // Calculate stack position relative to current active index
      let relativeIdx = (i - this.currentIndex + this.memories.length) % this.memories.length;
      
      if (card.classList.contains('swiped')) {
        // If swiped, hide it underneath the stack
        card.style.zIndex = '0';
        return;
      }
      
      // Position cards that are behind the active card
      card.style.zIndex = `${10 - relativeIdx}`;
      card.style.opacity = relativeIdx === 0 ? '1' : relativeIdx === 1 ? '0.9' : relativeIdx === 2 ? '0.8' : '0.6';
      
      // Reapply slight offsets based on relative position
      const offsets = [
        { rot: 4, x: 2, y: 2 },
        { rot: -3, x: -2, y: -2 },
        { rot: 2, x: 0, y: 4 },
        { rot: -5, x: -4, y: 2 }
      ];
      const offset = offsets[relativeIdx % offsets.length];
      card.style.transform = `rotate(${offset.rot}deg) translate(${offset.x}px, ${offset.y}px)`;
    });
  }

  slideNext() {
    audio.playPopSound();
    const activeCard = this.cards[this.currentIndex];
    activeCard.classList.add('swiped');
    
    this.currentIndex = (this.currentIndex + 1) % this.memories.length;
    this.indexSpan.textContent = this.currentIndex + 1;
    
    // Wait for swipe transition to end, then move active card to bottom of z-stack
    setTimeout(() => {
      activeCard.classList.remove('swiped');
      this.updateZIndices();
    }, 600);
    
    this.updateZIndices();
  }

  slidePrev() {
    audio.playPopSound();
    // Move index back
    this.currentIndex = (this.currentIndex - 1 + this.memories.length) % this.memories.length;
    this.indexSpan.textContent = this.currentIndex + 1;
    
    // Instantly swipe out the target card, then slide it in from left
    const targetCard = this.cards[this.currentIndex];
    targetCard.classList.add('swiped');
    this.updateZIndices();
    
    setTimeout(() => {
      targetCard.classList.remove('swiped');
      this.updateZIndices();
    }, 50);
  }
}

/* -------------------------------------------------------------
 * COMPLIMENT MIRROR SYSTEM (TAB 3)
 * ------------------------------------------------------------- */
class ComplimentSpinner {
  constructor(crystalId, boxId, textId, spinBtnId) {
    this.crystal = document.getElementById(crystalId);
    this.box = document.getElementById(boxId);
    this.text = document.getElementById(textId);
    this.spinBtn = document.getElementById(spinBtnId);
    this.compliments = [
      "Your laugh is a total remedy for any bad day. 😊✨",
      "You have an absolutely beautiful heart of gold and a mind of pure fire. 💖🔥",
      "Classy, super smart, and incredibly sassy—a total power pack. 👑💋",
      "If you were a star in the night sky, you'd make all the others look dim. 🌌🌟",
      "Your aesthetic is literally goals, and your energy lights up every single room. 🎀⚡",
      "You are that rare kind of person who makes absolute strangers feel like old friends. 🌸🍰",
      "A perfect blend of sweet sugar and spicy attitude! 🍭🌶️",
      "You inspire people just by being unapologetically yourself. 🦄💎"
    ];
    this.isSpinning = false;
    
    this.spinBtn.addEventListener('click', () => this.spin());
    this.crystal.addEventListener('click', () => this.spin());
  }

  spin() {
    if (this.isSpinning) return;
    this.isSpinning = true;
    
    this.crystal.classList.add('spinning');
    this.spinBtn.disabled = true;
    this.box.querySelector('.compliment-placeholder')?.classList.add('hidden');
    this.text.classList.add('hidden');
    
    let ticker = 0;
    const tickerMax = 12;
    const intervalTime = 120;
    
    // Play quick tick sounds
    const runTicker = () => {
      const tempIndex = Math.floor(Math.random() * this.compliments.length);
      this.text.textContent = this.compliments[tempIndex];
      this.text.classList.remove('hidden');
      audio.playPopSound();
      
      ticker++;
      if (ticker < tickerMax) {
        setTimeout(runTicker, intervalTime);
      } else {
        // Slow down final spin
        setTimeout(() => {
          const finalIndex = Math.floor(Math.random() * this.compliments.length);
          this.text.textContent = this.compliments[finalIndex];
          this.text.classList.remove('hidden');
          
          this.crystal.classList.remove('spinning');
          this.spinBtn.disabled = false;
          this.isSpinning = false;
          
          audio.playChimeSound();
        }, 250);
      }
    };
    
    runTicker();
  }
}

/* -------------------------------------------------------------
 * FIREWORKS CANVAS ENGINE (TAB 4 SPECIAL STATE)
 * ------------------------------------------------------------- */
class FireworksEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.isRunning = false;
    this.animationId = null;
    
    window.addEventListener('resize', () => this.resizeCanvas());
    this.resizeCanvas();
    
    // Tap fireworks screen to create custom sparks
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.createFirework(x, y);
    });
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = this.canvas.parentElement.clientHeight;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.particles = [];
    this.loop();
    
    // Auto-launch rockets at random intervals
    this.launchTimer = setInterval(() => {
      const x = 50 + Math.random() * (this.canvas.width - 100);
      const y = 80 + Math.random() * (this.canvas.height / 2);
      this.createFirework(x, y);
    }, 1200);
  }

  stop() {
    this.isRunning = false;
    clearInterval(this.launchTimer);
    cancelAnimationFrame(this.animationId);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  createFirework(x, y) {
    audio.playPopSound();
    
    const count = 40 + Math.floor(Math.random() * 30);
    const colors = ['#ff5e97', '#f3cf90', '#d2b3ff', '#ff7799', '#ffffff', '#ffd1df'];
    const selectedColor = colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: selectedColor,
        alpha: 1.0,
        decay: 0.015 + Math.random() * 0.02,
        gravity: 0.04
      });
    }
  }

  loop() {
    // Semi-transparent clears create trailing glows
    this.ctx.fillStyle = 'rgba(10, 0, 7, 0.2)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity; // drop gravity
      p.alpha -= p.decay;
      
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 1.8 + Math.random() * 1.2, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    }
    
    if (this.isRunning) {
      this.animationId = requestAnimationFrame(() => this.loop());
    }
  }
}

/* -------------------------------------------------------------
 * MAIN APP SETUP & COORDINATION
 * ------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Screens & Navigation Elements
  const screenEntry = document.getElementById('screen-entry');
  const screenMain = document.getElementById('screen-main');
  const btnOpenGift = document.getElementById('btn-open-gift');
  const giftBox = document.getElementById('gift-box');
  const audioToggle = document.getElementById('audio-toggle');
  
  const tabViews = document.querySelectorAll('.tab-view');
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  
  // 2. Audio Control Bind
  audioToggle.addEventListener('click', () => {
    const isMuted = audio.toggleMute();
    if (isMuted) {
      audioToggle.querySelector('.icon-play').classList.add('hidden');
      audioToggle.querySelector('.icon-mute').classList.remove('hidden');
    } else {
      audioToggle.querySelector('.icon-play').classList.remove('hidden');
      audioToggle.querySelector('.icon-mute').classList.add('hidden');
    }
  });

  // 3. Screen Transition: Gift box click
  const openGiftBoxFlow = () => {
    giftBox.classList.add('opened');
    btnOpenGift.style.opacity = '0';
    audio.init();
    
    // Play initial box opening sparkle sound
    setTimeout(() => {
      audio.playChimeSound();
    }, 250);
    
    // Switch screens
    setTimeout(() => {
      screenEntry.classList.remove('active');
      screenMain.classList.add('active');
      audioToggle.classList.remove('hidden');
      
      // Start background birthday loops
      audio.playHappyBirthdayTheme();
      
      // Auto initialize balloon games
      balloonGame.start();
    }, 800);
  };
  
  btnOpenGift.addEventListener('click', openGiftBoxFlow);
  giftBox.addEventListener('click', openGiftBoxFlow);

  // 4. Reusable Tab Switcher
  const switchToTab = (tabId) => {
    // Update nav styling
    navItems.forEach(n => {
      if (n.getAttribute('data-tab') === tabId) {
        n.classList.add('active');
      } else {
        n.classList.remove('active');
      }
    });

    // Manage game cycles
    if (tabId === 'view-balloons') {
      balloonGame.start();
    } else {
      balloonGame.stop();
    }

    if (tabId === 'view-cake') {
      fireworks.stop();
    }

    // Transition panels
    tabViews.forEach(view => {
      if (view.id === tabId) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    audio.playPopSound();
  };

  // 5. Tab Navigation Router (uses switchToTab)
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      switchToTab(item.getAttribute('data-tab'));
    });
  });

  // 6. Instantiating Balloon pop game
  const wishesRevealCard = document.getElementById('wishes-display-card');
  const wishTextContent = document.getElementById('wish-text-content');
  const closeWishCard = document.getElementById('close-wish-card');
  
  const balloonGame = new BalloonGame('balloon-canvas', 'popped-count', (wishText) => {
    // Pause canvas update and display overlay wish
    balloonGame.stop();
    wishTextContent.textContent = wishText;
    wishesRevealCard.classList.remove('hidden');
  });

  closeWishCard.addEventListener('click', () => {
    wishesRevealCard.classList.add('hidden');
    audio.playPopSound();

    // If all balloons popped, auto-switch to next tab after a short pause
    if (balloonGame.isComplete) {
      setTimeout(() => {
        switchToTab('view-memories');
      }, 600);
    } else {
      // Resume floating balloons
      balloonGame.start();
    }
  });

  // 6. Instantiating Memory gallery
  new PolaroidGallery('polaroid-stack', 'btn-prev-polaroid', 'btn-next-polaroid', 'total-polaroids-count', 'current-polaroid-idx');

  // 7. Instantiating Compliment Mirror
  new ComplimentSpinner('magic-crystal', 'compliment-box', 'compliment-text', 'btn-spin-compliment');

  // 8. Instantiating Birthday Cake Candle
  const candleFlame = document.getElementById('candle-flame');
  const finalLetterOverlay = document.getElementById('final-letter-overlay');
  const btnRestartCelebration = document.getElementById('btn-restart-celebration');
  const cakeStatus = document.getElementById('cake-status');
  
  const fireworks = new FireworksEngine('fireworks-canvas');

  const blowOutCandleFlow = () => {
    if (!candleFlame.classList.contains('active')) return;
    
    candleFlame.classList.remove('active');
    cakeStatus.textContent = "💨 You blew it out! Making a wish...";
    
    // Play blow breath
    audio.playCandleBlowSound();
    
    // Wait and start fireworks
    setTimeout(() => {
      audio.playChimeSound();
      finalLetterOverlay.classList.remove('hidden');
      fireworks.start();
    }, 1200);
  };

  candleFlame.addEventListener('click', blowOutCandleFlow);
  candleFlame.addEventListener('touchstart', (e) => {
    e.preventDefault();
    blowOutCandleFlow();
  });

  btnRestartCelebration.addEventListener('click', () => {
    audio.playPopSound();
    
    // Reset candle state
    finalLetterOverlay.classList.add('hidden');
    fireworks.stop();
    
    candleFlame.classList.add('active');
    cakeStatus.textContent = "🕯️ Tap the flame to blow it out!";
  });

});
