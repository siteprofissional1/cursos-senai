/**
 * Joselito Bet - Módulo de Efeitos Sonoros com Web Audio API
 * 100% nativo do navegador, sem dependências de arquivos de terceiros (zero links quebrados, funciona offline).
 * Comentários didáticos para análise de alunos do SENAI.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  // Inicializa o contexto de áudio após a primeira interação do usuário (exigência dos navegadores modernos)
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Som de moedas / depósito simulado (Dois tons agudos em rápida sucessão)
  playCoin() {
    try {
      this.init();
      if (!this.ctx || !this.enabled) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now); // Nota B5
      osc1.frequency.setValueAtTime(1318.51, now + 0.08); // Nota E6

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.35);
    } catch (e) {
      console.warn('Erro ao reproduzir som de moeda:', e);
    }
  }

  // Som de clique e confirmação de aposta
  playBet() {
    try {
      this.init();
      if (!this.ctx || !this.enabled) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn('Erro ao reproduzir som de aposta:', e);
    }
  }

  // Som de clique / giro (usado na roleta e no tigrinho a cada rotação)
  playTick() {
    try {
      this.init();
      if (!this.ctx || !this.enabled) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }

  // Buzzer cômico de derrota / "A casa sempre ganha" (trompete triste wah-wah)
  playLoss() {
    try {
      this.init();
      if (!this.ctx || !this.enabled) return;

      const now = this.ctx.currentTime;
      const notes = [260, 245, 230, 180]; // Frequências decrescentes
      const duration = 0.22;

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth'; // Timbre áspero proposital para enfatizar a derrota
        osc.frequency.setValueAtTime(freq, now + (idx * duration));

        gain.gain.setValueAtTime(0.2, now + (idx * duration));
        gain.gain.exponentialRampToValueAtTime(0.001, now + ((idx + 1) * duration));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + (idx * duration));
        osc.stop(now + ((idx + 1) * duration));
      });
    } catch (e) {
      console.warn('Erro ao reproduzir som de derrota:', e);
    }
  }

  // Fanfarra alegre para as raras vitórias do jogador
  playWin() {
    try {
      this.init();
      if (!this.ctx || !this.enabled) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // Acorde C maior subindo

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + (idx * 0.1));

        gain.gain.setValueAtTime(0.25, now + (idx * 0.1));
        gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.1) + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + (idx * 0.1));
        osc.stop(now + (idx * 0.1) + 0.25);
      });
    } catch (e) {}
  }

  // Som de explosão/queda do avião no crash
  playCrash() {
    try {
      this.init();
      if (!this.ctx || !this.enabled) return;

      // Gera ruído branco para simular explosão
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {}
  }
}

// Instância global disponível em todos os scripts
window.joselitoAudio = new SoundEngine();

// Ativa o áudio no primeiro clique do usuário em qualquer lugar da tela
document.addEventListener('click', () => {
  window.joselitoAudio.init();
}, { once: true });
