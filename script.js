/**
 * PROMPTING.IN — Interactive JavaScript Engine
 * Handles:
 * 1. AI Chat Demo Simulation with Realistic Typing Effects
 * 2. Scenario Switching (Sales, Support, Leads)
 * 3. Sticky Navbar Blur on Scroll
 * 4. Mobile Menu Navigation
 * 5. Lead Form Submission & Toast Notifications
 * 6. Smooth Scroll & Intersection Observers
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. DOM Elements Selection
  // -------------------------------------------------------------------------
  const navbarWrapper = document.querySelector('.navbar-wrapper');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  // Chat Demo Elements
  const chatBody = document.getElementById('chat-body');
  const btnSimulateAI = document.getElementById('btn-simulate-ai');
  const btnResetChat = document.getElementById('btn-reset-chat');
  const simulateBtnText = document.getElementById('simulate-btn-text');
  const promptPreviewText = document.getElementById('prompt-preview-text');
  const scenarioChips = document.querySelectorAll('.quick-chip');

  // Contact Form & Toast Elements
  const consultationForm = document.getElementById('consultation-form');
  const toastNotification = document.getElementById('toast-notification');
  const toastTitle = document.getElementById('toast-title');
  const toastMessage = document.getElementById('toast-message');

  // -------------------------------------------------------------------------
  // 2. Demo Simulation Data & State
  // -------------------------------------------------------------------------
  let isSimulating = false;
  let currentScenario = 'sales';

  const scenarios = {
    sales: {
      userPrompt: 'Tolong buatkan laporan penjualan minggu ini',
      aiReply: 'Laporan penjualan telah diotomatisasi dan dikirim ke email Anda dalam 3 detik.',
      payload: {
        title: 'Weekly_Revenue_Report_Q4.pdf',
        stats: [
          { label: 'Total Revenue', value: 'Rp 148.500.000' },
          { label: 'Transaksi Berhasil', value: '1.428 Pesanan' },
          { label: 'Growth WoW', value: '+24.6% ↗' },
          { label: 'Status Eksekusi', value: 'Email & ERP Synced' }
        ],
        footerText: '✓ Otomatis dikirim ke direksi@perusahaan.com'
      }
    },
    support: {
      userPrompt: 'Ada eskalasi komplain pelanggan VIP mengenai API timeout',
      aiReply: 'Masalah berhasil diidentifikasi. Tiket prioritas P0 telah dibuat di Jira, server logs dianalisis, dan balasan personal telah dikirim ke klien VIP.',
      payload: {
        title: 'Incident_Resolution_Ticket #VIP-892',
        stats: [
          { label: 'Waktu Analisis', value: '1.4 detik' },
          { label: 'Severity Level', value: 'P0 Critical' },
          { label: 'Jira Status', value: 'Assigned to DevOps' },
          { label: 'Client Notification', value: 'Sent via WhatsApp' }
        ],
        footerText: '✓ SLA respon tercapai dalam 45 detik'
      }
    },
    leads: {
      userPrompt: 'Kualifikasi 50 lead baru dari formulir website hari ini',
      aiReply: '50 lead telah diskor dan dikualifikasi berdasarkan revenue & industri. 18 hot leads langsung dijadwalkan ke Google Calendar sales executive.',
      payload: {
        title: 'Lead_Qualification_Batch_Today.csv',
        stats: [
          { label: 'Total Leads Diproses', value: '50 Prospek' },
          { label: 'SQL (Sales Qualified)', value: '18 Hot Leads' },
          { label: 'Hubspot Sync', value: '100% Updated' },
          { label: 'Calendar Invites', value: '18 Terkirim' }
        ],
        footerText: '✓ Notifikasi instan dikirim ke Slack #sales-wins'
      }
    }
  };

  // -------------------------------------------------------------------------
  // 3. Navbar Scroll Blur & Shadow
  // -------------------------------------------------------------------------
  const handleScroll = () => {
    if (window.scrollY > 25) {
      navbarWrapper.classList.add('scrolled');
    } else {
      navbarWrapper.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // -------------------------------------------------------------------------
  // 4. Mobile Menu Toggle
  // -------------------------------------------------------------------------
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbarWrapper.contains(e.target) && navLinks.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 5. Typing Animation Engine
  // -------------------------------------------------------------------------
  function typeText(targetElement, text, speed = 28) {
    return new Promise((resolve) => {
      let index = 0;
      targetElement.textContent = '';
      
      const interval = setInterval(() => {
        if (index < text.length) {
          targetElement.textContent += text.charAt(index);
          index++;
          chatBody.scrollTop = chatBody.scrollHeight;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, speed);
    });
  }

  function getTimeString() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // -------------------------------------------------------------------------
  // 6. Run AI Simulation
  // -------------------------------------------------------------------------
  async function runSimulation() {
    if (isSimulating) return;
    isSimulating = true;

    const data = scenarios[currentScenario];

    // UI state updates
    btnSimulateAI.disabled = true;
    simulateBtnText.textContent = 'Menjalankan AI...';
    promptPreviewText.classList.add('typing-active');
    promptPreviewText.textContent = '';

    // Step A: Type text in the bottom preview bar first
    await typeText(promptPreviewText, data.userPrompt, 24);
    await new Promise(r => setTimeout(r, 250));

    // Step B: Create and Append User Message in Chat
    const userRow = document.createElement('div');
    userRow.className = 'chat-bubble-row user-row';
    userRow.innerHTML = `
      <div class="bubble-avatar user-avatar">
        <span>Anda</span>
      </div>
      <div class="bubble-content user-bubble">
        <p class="user-text"></p>
        <div class="bubble-time">${getTimeString()} • Terkirim</div>
      </div>
    `;
    chatBody.appendChild(userRow);
    chatBody.scrollTop = chatBody.scrollHeight;

    const userTextElement = userRow.querySelector('.user-text');
    userTextElement.textContent = data.userPrompt;

    // Reset prompt bar text placeholder
    promptPreviewText.classList.remove('typing-active');
    promptPreviewText.textContent = 'AI sedang memproses instruksi otomatis...';

    // Step C: Append AI Thinking Indicator
    const thinkingRow = document.createElement('div');
    thinkingRow.className = 'chat-bubble-row bot-row thinking-row';
    thinkingRow.innerHTML = `
      <div class="bubble-avatar bot-avatar">
        <span>AI</span>
      </div>
      <div class="bubble-content bot-bubble">
        <div class="bubble-sender">Prompting.in Agent</div>
        <div class="typing-dots">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    `;
    chatBody.appendChild(thinkingRow);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Wait realistic processing duration (900ms)
    await new Promise(r => setTimeout(r, 900));

    // Step D: Replace Thinking Indicator with Real AI Answer
    thinkingRow.remove();

    const botRow = document.createElement('div');
    botRow.className = 'chat-bubble-row bot-row';
    botRow.innerHTML = `
      <div class="bubble-avatar bot-avatar">
        <span>AI</span>
      </div>
      <div class="bubble-content bot-bubble">
        <div class="bubble-sender">Prompting.in Agent</div>
        <p class="ai-text"></p>
        <div class="bubble-time">${getTimeString()} • Eksekusi Selesai (3s)</div>
      </div>
    `;
    chatBody.appendChild(botRow);
    chatBody.scrollTop = chatBody.scrollHeight;

    const aiTextElement = botRow.querySelector('.ai-text');
    await typeText(aiTextElement, data.aiReply, 22);

    // Step E: Render Interactive Payload Card (e.g. Sales report preview)
    const reportCard = document.createElement('div');
    reportCard.className = 'report-preview-box';
    reportCard.innerHTML = `
      <div class="report-header">
        <span>📄 ${data.payload.title}</span>
        <span class="badge-pulse"></span>
      </div>
      <div class="report-grid">
        ${data.payload.stats.map(s => `
          <div class="report-stat-pill">
            <span class="label">${s.label}</span>
            <span class="val">${s.value}</span>
          </div>
        `).join('')}
      </div>
      <div class="report-footer-tag">
        ${data.payload.footerText}
      </div>
    `;
    
    botRow.querySelector('.bubble-content').appendChild(reportCard);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Finish simulation state
    promptPreviewText.textContent = 'Klik tombol untuk menjalankan simulasi kembali atau ganti skenario.';
    simulateBtnText.textContent = 'Simulasikan Lagi';
    btnSimulateAI.disabled = false;
    isSimulating = false;
  }

  // -------------------------------------------------------------------------
  // 7. Reset Chat Functionality
  // -------------------------------------------------------------------------
  function resetChat() {
    if (isSimulating) return;
    chatBody.innerHTML = `
      <div class="chat-bubble-row bot-row">
        <div class="bubble-avatar bot-avatar">
          <span>AI</span>
        </div>
        <div class="bubble-content bot-bubble">
          <div class="bubble-sender">Prompting.in Agent</div>
          <p>Halo! Saya siap mengotomatisasi alur kerja Anda hari ini. Klik tombol <strong>"Simulasikan AI"</strong> di bawah untuk menguji integrasi otomatisasi laporan dan tugas bisnis.</p>
          <div class="bubble-time">${getTimeString()} • Terverifikasi</div>
        </div>
      </div>
    `;
    promptPreviewText.textContent = 'Klik tombol "Simulasikan AI" untuk memulai eksekusi otomatis...';
    simulateBtnText.textContent = 'Simulasikan AI';
  }

  // -------------------------------------------------------------------------
  // 8. Scenario Selector Chips
  // -------------------------------------------------------------------------
  scenarioChips.forEach(chip => {
    chip.addEventListener('click', () => {
      if (isSimulating) return;
      scenarioChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentScenario = chip.dataset.scenario;
      promptPreviewText.textContent = `Skenario dipilih: "${scenarios[currentScenario].userPrompt}". Klik "Simulasikan AI"`;
    });
  });

  if (btnSimulateAI) {
    btnSimulateAI.addEventListener('click', runSimulation);
  }

  if (btnResetChat) {
    btnResetChat.addEventListener('click', resetChat);
  }

  // -------------------------------------------------------------------------
  // 9. Toast Notification Handler
  // -------------------------------------------------------------------------
  function showToast(title, message, duration = 4500) {
    if (!toastNotification) return;
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toastNotification.classList.add('show');

    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, duration);
  }

  // -------------------------------------------------------------------------
  // 10. Consultation Form Submission
  // -------------------------------------------------------------------------
  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('client-name');
      const emailInput = document.getElementById('client-email');
      const needSelect = document.getElementById('automation-need');

      const clientName = nameInput ? nameInput.value.trim() : 'Rekan Bisnis';

      // Visual feedback on button
      const submitBtn = document.getElementById('btn-submit-consultation');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <svg class="btn-icon-spin" style="animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>Mengirim Permintaan...</span>
      `;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        consultationForm.reset();

        showToast(
          'Permintaan Demo Terkirim!',
          `Terima kasih ${clientName}. AI Solution Architect kami akan menghubungi Anda via email dalam < 1 jam.`
        );
      }, 900);
    });
  }

  // -------------------------------------------------------------------------
  // 11. Subtle Hover Glow Effect on Feature Cards
  // -------------------------------------------------------------------------
  const cards = document.querySelectorAll('.feature-card, .service-box');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
});
