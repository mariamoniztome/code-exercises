class HandCursor {
  constructor() {
    this.handElement = document.getElementById('hand-cursor');
    
    // Debug: Log if hand element is found
    if (!this.handElement) {
      console.error('Hand cursor element not found!');
      return;
    }
    
    this.bubbleElement = this.handElement.querySelector('.speech-bubble');
    
    // Debug: Log if bubble element is found
    if (!this.bubbleElement) {
      console.error('Speech bubble element not found!');
    } else {
      console.log('Speech bubble element found:', this.bubbleElement);
    }
    
    this.visibilityTimeout = null;
    this.hideBubbleTimeout = null;
    this.isVisible = false;
    
    // Debug: Log initialization
    console.log('HandCursor initialized');
    
    this.init();
  }

  init() {
    // Start the show/hide cycle
    this.scheduleNextShow();
    
    // Hide bubble when clicking anywhere
    document.addEventListener('click', () => this.hideBubble());
    
    // Show bubble when hovering over interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => this.hideBubble());
    });
  }

  showBubble() {
    if (this.isVisible) return;
    
    this.isVisible = true;
    this.handElement.classList.add('show-bubble', 'pulse');
    
    // Hide bubble after 2 seconds
    this.hideBubbleTimeout = setTimeout(() => {
      this.hideBubble();
    }, 2000);
  }

  hideBubble() {
    if (!this.isVisible) return;
    
    clearTimeout(this.hideBubbleTimeout);
    this.handElement.classList.remove('show-bubble', 'pulse');
    this.isVisible = false;
    
    // Schedule next show
    this.scheduleNextShow();
  }

  scheduleNextShow() {
    // Show bubble after 2 seconds
    const delay = 10000;
    
    clearTimeout(this.visibilityTimeout);
    this.visibilityTimeout = setTimeout(() => {
      this.showBubble();
    }, delay);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.handCursor = new HandCursor();
});
