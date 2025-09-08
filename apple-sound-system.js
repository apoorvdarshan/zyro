/* =================================================================
   APPLE BRAIN-WAVE SOUND SYSTEM
   Advanced Web Audio API Sound Engine for Glassmorphism UI
   ================================================================= */

class AppleSoundSystem {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.initialized = false;
        this.soundTypes = {
            bubble: 'bubble',
            brainWave: 'brainWave',
            liquid: 'liquid',
            crystalline: 'crystalline',
            ethereal: 'ethereal',
            quantum: 'quantum'
        };
        
        // Initialize on first user interaction
        this.initializeOnUserGesture();
    }

    initializeOnUserGesture() {
        const initHandler = () => {
            if (!this.initialized) {
                this.initialize();
                document.removeEventListener('click', initHandler);
                document.removeEventListener('touchstart', initHandler);
                document.removeEventListener('keydown', initHandler);
            }
        };

        document.addEventListener('click', initHandler);
        document.addEventListener('touchstart', initHandler);
        document.addEventListener('keydown', initHandler);
    }

    initialize() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            this.initialized = true;
            
            console.log('🎵 Apple Sound System initialized');
            this.setupEventListeners();
            this.observeContentChanges();
        } catch (error) {
            console.warn('Audio context not supported:', error);
        }
    }

    setupEventListeners() {
        // Add sound to all Apple liquid UI elements
        this.addSoundToElements('.apple-liquid-btn', this.soundTypes.brainWave);
        this.addSoundToElements('.apple-liquid-nav-item', this.soundTypes.brainWave);
        this.addSoundToElements('.apple-liquid-card', this.soundTypes.brainWave);
        this.addSoundToElements('.apple-prism', this.soundTypes.brainWave);
        this.addSoundToElements('.apple-ethereal', this.soundTypes.brainWave);
        this.addSoundToElements('.apple-quantum', this.soundTypes.brainWave);
        this.addSoundToElements('.apple-iridescent', this.soundTypes.brainWave);
        
        // Add sound to specific UI elements
        this.addSoundToElements('button', this.soundTypes.brainWave);
        this.addSoundToElements('.category-tile', this.soundTypes.brainWave);
        this.addSoundToElements('.news-card', this.soundTypes.brainWave);
        this.addSoundToElements('.card', this.soundTypes.brainWave);
        this.addSoundToElements('.news-item', this.soundTypes.brainWave);
        this.addSoundToElements('a', this.soundTypes.liquid);
        
        // Add sound to footer elements
        this.addSoundToElements('.footer-section a', this.soundTypes.liquid);
        this.addSoundToElements('.footer-legal a', this.soundTypes.liquid);
        this.addSoundToElements('.social-link', this.soundTypes.liquid);
        
        // Add sound to navigation elements
        this.addSoundToElements('nav a', this.soundTypes.liquid);
        this.addSoundToElements('.nav-item', this.soundTypes.liquid);
        
        // Add sound to form elements
        this.addSoundToElements('input[type="submit"]', this.soundTypes.brainWave);
        this.addSoundToElements('input[type="button"]', this.soundTypes.brainWave);
        this.addSoundToElements('.newsletter button', this.soundTypes.brainWave);
        
        // Add sound to any element with sound classes
        this.addSoundToElements('.sound-bubble', this.soundTypes.bubble);
        this.addSoundToElements('.sound-wave', this.soundTypes.brainWave);
        this.addSoundToElements('.apple-sound-btn', this.soundTypes.liquid);
        
        // Universal clickable element detection
        setTimeout(() => this.addUniversalClickSounds(), 1000);
        
        // Add scroll to news functionality for category tiles
        this.setupCategoryScrolling();
    }

    addUniversalClickSounds() {
        // Find all potentially clickable elements that don't have sound yet
        const clickableSelectors = [
            '[onclick]',
            '[data-category]', 
            '[data-action]',
            '.clickable',
            '.interactive',
            '.tile',
            '.item'
        ];
        
        clickableSelectors.forEach(selector => {
            this.addSoundToElements(selector, this.soundTypes.brainWave);
        });
        
        // Add sound to elements with cursor pointer
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.cursor === 'pointer' && !element.hasAttribute('data-sound-added')) {
                this.addSoundToElement(element, this.soundTypes.brainWave);
            }
        });
    }

    setupCategoryScrolling() {
        const categoryTiles = document.querySelectorAll('.category-tile');
        const newsContainer = document.getElementById('newsContainer') || document.querySelector('.news-section') || document.querySelector('.news-grid');
        
        if (!newsContainer) {
            console.warn('News container not found for category scrolling');
            return;
        }

        categoryTiles.forEach(tile => {
            tile.addEventListener('click', (e) => {
                // Small delay to allow for any category switching logic
                setTimeout(() => {
                    newsContainer.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                    });
                }, 300);
                
                console.log('📜 Scrolling to news container');
            });
        });
        
        console.log(`📜 Set up category scrolling for ${categoryTiles.length} tiles`);
    }

    addSoundToElement(element, soundType) {
        if (element.hasAttribute('data-sound-added')) return;
        
        element.addEventListener('click', (event) => {
            this.playSound(soundType);
            this.addVisualFeedback(element, soundType);
        });

        // Hover sounds removed for cleaner experience
        
        element.setAttribute('data-sound-added', 'true');
    }

    addSoundToElements(selector, soundType) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            this.addSoundToElement(element, soundType);
        });
    }

    playSound(type, volume = 0.3, duration = 0.4) {
        if (!this.initialized || !this.audioContext) return;

        const currentTime = this.audioContext.currentTime;

        switch (type) {
            case this.soundTypes.bubble:
                this.createBubbleSound(currentTime, volume, duration);
                break;
            case this.soundTypes.brainWave:
                this.createBrainWaveSound(currentTime, volume, duration);
                break;
            case this.soundTypes.liquid:
                this.createLiquidSound(currentTime, volume, duration);
                break;
            case this.soundTypes.crystalline:
                this.createCrystallineSound(currentTime, volume, duration);
                break;
            case this.soundTypes.ethereal:
                this.createEtherealSound(currentTime, volume, duration);
                break;
            case this.soundTypes.quantum:
                this.createQuantumSound(currentTime, volume, duration);
                break;
        }
    }

    createBubbleSound(startTime, volume = 0.3, duration = 0.4) {
        // Create bubble pop with resonant filter
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        // Bubble-like frequency sweep
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, startTime + duration * 0.7);
        oscillator.frequency.exponentialRampToValueAtTime(100, startTime + duration);

        // Resonant filter for bubble quality
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, startTime);
        filter.Q.setValueAtTime(15, startTime);

        // Bubble pop envelope
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.exponentialRampToValueAtTime(volume, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(volume * 0.3, startTime + duration * 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    createBrainWaveSound(startTime, volume = 0.3, duration = 0.8) {
        // Multi-layered brain wave frequencies (Alpha, Beta, Theta)
        const frequencies = [8, 13, 30, 60]; // Brain wave frequencies
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            const delay = this.audioContext.createDelay();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq * 10, startTime);
            
            // Brain wave modulation
            const lfo = this.audioContext.createOscillator();
            const lfoGain = this.audioContext.createGain();
            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(freq / 4, startTime);
            lfoGain.gain.setValueAtTime(50, startTime);
            
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);

            // Smooth filter sweep
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, startTime);
            filter.frequency.exponentialRampToValueAtTime(500, startTime + duration);

            // Delay for brain-like echo
            delay.delayTime.setValueAtTime(0.1 + index * 0.05, startTime);

            // Layered gain envelope
            const layerVolume = volume / frequencies.length * (1 - index * 0.2);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.exponentialRampToValueAtTime(layerVolume, startTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(layerVolume * 0.7, startTime + duration * 0.6);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            oscillator.connect(filter);
            filter.connect(delay);
            delay.connect(gainNode);
            gainNode.connect(this.masterGain);

            lfo.start(startTime);
            oscillator.start(startTime);
            lfo.stop(startTime + duration);
            oscillator.stop(startTime + duration);
        });
    }

    createLiquidSound(startTime, volume = 0.3, duration = 0.5) {
        // Fluid-like frequency modulation
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, startTime);
        
        // Liquid wave modulation
        const modOsc = this.audioContext.createOscillator();
        const modGain = this.audioContext.createGain();
        modOsc.type = 'sine';
        modOsc.frequency.setValueAtTime(6, startTime);
        modGain.gain.setValueAtTime(100, startTime);
        
        modOsc.connect(modGain);
        modGain.connect(oscillator.frequency);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1500, startTime);
        filter.frequency.exponentialRampToValueAtTime(800, startTime + duration);

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        modOsc.start(startTime);
        oscillator.start(startTime);
        modOsc.stop(startTime + duration);
        oscillator.stop(startTime + duration);
    }

    createCrystallineSound(startTime, volume = 0.3, duration = 0.6) {
        // Crystal-like harmonic series
        const fundamentalFreq = 440;
        const harmonics = [1, 2, 3, 5, 8]; // Crystalline ratios

        harmonics.forEach((harmonic, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();

            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(fundamentalFreq * harmonic, startTime);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(fundamentalFreq * harmonic, startTime);
            filter.Q.setValueAtTime(10, startTime);

            const harmonicVolume = volume / harmonics.length * Math.pow(0.7, index);
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.exponentialRampToValueAtTime(harmonicVolume, startTime + 0.01 + index * 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.masterGain);

            oscillator.start(startTime + index * 0.05);
            oscillator.stop(startTime + duration);
        });
    }

    createEtherealSound(startTime, volume = 0.3, duration = 0.8) {
        // Ethereal pad-like sound with reverb
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        const delay = this.audioContext.createDelay();

        oscillator1.type = 'sine';
        oscillator2.type = 'triangle';
        oscillator1.frequency.setValueAtTime(220, startTime);
        oscillator2.frequency.setValueAtTime(330, startTime);

        // Slow ethereal drift
        oscillator1.frequency.linearRampToValueAtTime(200, startTime + duration);
        oscillator2.frequency.linearRampToValueAtTime(300, startTime + duration);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, startTime);
        filter.frequency.linearRampToValueAtTime(400, startTime + duration);

        delay.delayTime.setValueAtTime(0.3, startTime);

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume * 0.5, startTime + duration * 0.3);
        gainNode.gain.linearRampToValueAtTime(0.001, startTime + duration);

        oscillator1.connect(filter);
        oscillator2.connect(filter);
        filter.connect(delay);
        delay.connect(gainNode);
        gainNode.connect(this.masterGain);

        oscillator1.start(startTime);
        oscillator2.start(startTime);
        oscillator1.stop(startTime + duration);
        oscillator2.stop(startTime + duration);
    }

    createQuantumSound(startTime, volume = 0.3, duration = 0.5) {
        // Quantum interference-like beating frequencies
        const freq1 = 440;
        const freq2 = 442; // Creates 2Hz beating

        [freq1, freq2].forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();

            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(freq, startTime);

            filter.type = 'highpass';
            filter.frequency.setValueAtTime(200, startTime);

            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.exponentialRampToValueAtTime(volume * 0.3, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.masterGain);

            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
        });
    }

    addVisualFeedback(element, soundType) {
        // Add visual feedback class based on sound type
        const feedbackClass = this.getSoundFeedbackClass(soundType);
        element.classList.add(feedbackClass);

        // Remove class after animation
        setTimeout(() => {
            element.classList.remove(feedbackClass);
        }, 800);
    }

    getSoundFeedbackClass(soundType) {
        switch (soundType) {
            case this.soundTypes.bubble:
                return 'sound-bubble';
            case this.soundTypes.brainWave:
                return 'sound-wave';
            case this.soundTypes.liquid:
                return 'sound-ripple';
            default:
                return 'sound-active';
        }
    }

    // Method to add sounds to dynamically loaded content
    addSoundsToNewContent(container = document) {
        // Add sounds to news cards and any new content
        this.addSoundToElements('.news-card', this.soundTypes.brainWave);
        this.addSoundToElements('.card', this.soundTypes.brainWave);
        this.addSoundToElements('.news-item', this.soundTypes.brainWave);
        this.addSoundToElements('.article-link', this.soundTypes.liquid);
        
        // Re-run universal detection
        this.addUniversalClickSounds();
        
        console.log('🎵 Added sounds to new content');
    }

    // Observe DOM changes for dynamically loaded content
    observeContentChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if news content was added
                    const hasNewsContent = Array.from(mutation.addedNodes).some(node => 
                        node.nodeType === 1 && (
                            node.classList?.contains('news-card') ||
                            node.classList?.contains('card') ||
                            node.querySelector?.('.news-card, .card, .news-item')
                        )
                    );
                    
                    if (hasNewsContent) {
                        setTimeout(() => this.addSoundsToNewContent(), 100);
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Public methods for manual sound triggering
    playBubbleSound(volume = 0.3) {
        this.playSound(this.soundTypes.bubble, volume);
    }

    playBrainWaveSound(volume = 0.3) {
        this.playSound(this.soundTypes.brainWave, volume);
    }

    playLiquidSound(volume = 0.3) {
        this.playSound(this.soundTypes.liquid, volume);
    }

    setMasterVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime);
        }
    }

    mute() {
        this.setMasterVolume(0);
    }

    unmute() {
        this.setMasterVolume(0.3);
    }
}

// Initialize the sound system
const appleSoundSystem = new AppleSoundSystem();

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AppleSoundSystem;
}

// Ambient sound system for background glassmorphism effects
class AmbientSoundLayer {
    constructor(appleSoundSystem) {
        this.soundSystem = appleSoundSystem;
        this.isPlaying = false;
        this.ambientNodes = [];
        this.initAmbientLayer();
    }

    initAmbientLayer() {
        // Wait for user interaction before starting ambient sounds
        document.addEventListener('click', () => {
            if (!this.isPlaying && this.soundSystem.initialized) {
                setTimeout(() => this.startAmbientLayer(), 2000);
            }
        }, { once: true });
    }

    startAmbientLayer() {
        this.isPlaying = true;
        
        // Create subtle ambient brain wave frequencies
        this.createAmbientWave(8.5, 0.02, 'alpha');   // Alpha waves
        this.createAmbientWave(4.2, 0.015, 'theta');  // Theta waves  
        this.createAmbientWave(40, 0.008, 'gamma');   // Gamma waves
        
        console.log('🌊 Ambient brain-wave layer activated');
    }

    createAmbientWave(frequency, volume, type) {
        const ctx = this.soundSystem.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const delay = ctx.createDelay();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency * 20, ctx.currentTime);

        // Very subtle volume for ambient layer
        gainNode.gain.setValueAtTime(volume, ctx.currentTime);

        // Gentle filtering
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        // Subtle delay for spaciousness
        delay.delayTime.setValueAtTime(0.8, ctx.currentTime);

        // Slow modulation for organic feel
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
        lfoGain.gain.setValueAtTime(frequency * 2, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);

        oscillator.connect(filter);
        filter.connect(delay);
        delay.connect(gainNode);
        gainNode.connect(this.soundSystem.masterGain);

        lfo.start();
        oscillator.start();

        this.ambientNodes.push({
            oscillator,
            lfo,
            gainNode,
            type
        });
    }

    stopAmbientLayer() {
        this.ambientNodes.forEach(node => {
            node.oscillator.stop();
            node.lfo.stop();
        });
        this.ambientNodes = [];
        this.isPlaying = false;
    }

    setAmbientVolume(volume) {
        this.ambientNodes.forEach(node => {
            node.gainNode.gain.setValueAtTime(volume, this.soundSystem.audioContext.currentTime);
        });
    }
}

// Ambient layer disabled - only click sounds enabled
// appleSoundSystem.ambientLayer = new AmbientSoundLayer(appleSoundSystem);

// Enhanced visual feedback system
class VisualFeedbackEnhancer {
    constructor() {
        this.setupAdvancedFeedback();
    }

    setupAdvancedFeedback() {
        // Add particle effects to sound interactions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('sound-bubble') || 
                e.target.classList.contains('sound-wave') ||
                e.target.classList.contains('apple-liquid-btn')) {
                this.createParticleEffect(e.clientX, e.clientY);
            }
        });
    }

    createParticleEffect(x, y) {
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, rgba(255,255,255,0.8), transparent);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                left: ${x}px;
                top: ${y}px;
            `;

            document.body.appendChild(particle);

            // Animate particle
            const angle = (i * 60) * (Math.PI / 180);
            const distance = 50 + Math.random() * 50;
            const duration = 800 + Math.random() * 400;

            particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 0.8
                },
                {
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                document.body.removeChild(particle);
            };
        }
    }
}

// Initialize enhanced visual feedback
new VisualFeedbackEnhancer();

// Global access
window.AppleSoundSystem = appleSoundSystem;

console.log('🎵 Apple Brain-Wave Sound System with Ambient Layer loaded');