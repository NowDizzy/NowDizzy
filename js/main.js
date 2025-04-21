/**
 * Asistan System - Ana Javascript Dosyası
 * Sürüm: 1.0.0
 * Tarih: 20.04.2025
 * 
 * Bu dosya tüm etkileşimli özellikleri yönetir ve manuel olarak
 * kodlanmıştır. Framework ya da transpiler kullanılmamıştır.
 */

// Sayfa yüklendiğinde çalışacak kod
document.addEventListener('DOMContentLoaded', function() {
  // Header kaydırma efekti
  initHeaderScroll();
  
  // Mobil menü
  initMobileMenu();
  
  // Sayaç animasyonu
  initCounters();
  
  // Scroll animasyonları
  initScrollAnimations();
  
  // Komut sekmeleri
  initCommandTabs();
  
  // SSS Akordeon
  initFaqAccordion();
  
  // Emoji yağmuru efekti
  initEmojiRain();

  // Form doğrulama
  initFormValidation();
  
  // Otomatik yazı efekti
  initTypingEffect();
});

/**
 * Header kaydırma efekti 
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/**
 * Mobil menü açma/kapama fonksiyonu
 */
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.header-inner');
  
  if (!mobileToggle || !nav) return;
  
  mobileToggle.addEventListener('click', function() {
    nav.classList.toggle('nav-active');
  });
  
  // Menü linklerine tıklayınca mobil menüyü kapat
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      nav.classList.remove('nav-active');
    });
  });
}

/**
 * Sayaç animasyonu
 */
function initCounters() {
  const stats = document.querySelectorAll('.stat-count');
  
  if (stats.length === 0) return;
  
  let counted = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        stats.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'));
          const countSpeed = target / 30; // Yaklaşık 2 saniyede tamamlanır
          
          const updateCount = () => {
            const currentCount = parseInt(stat.innerText);
            if(currentCount < target) {
              stat.innerText = Math.ceil(currentCount + countSpeed);
              setTimeout(updateCount, 50);
            } else {
              stat.innerText = target.toLocaleString();
            }
          };
          
          updateCount();
        });
        
        // Sayaç tamamlandığında observer'ı kapat
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });
  
  // Stats konteynerini izle
  const statsContainer = document.querySelector('.stats');
  if (statsContainer) {
    observer.observe(statsContainer);
  }
}

/**
 * Scroll animasyonları için Intersection Observer
 */
function initScrollAnimations() {
  const fadeElems = document.querySelectorAll('.fade-in');
  
  if (fadeElems.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        // Animasyon tamamlandığında elementi gözlemlemeyi bırak
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  fadeElems.forEach(elem => {
    observer.observe(elem);
  });
}

/**
 * Komut sekmeleri
 */
function initCommandTabs() {
  const tabs = document.querySelectorAll('.command-tab');
  const contents = document.querySelectorAll('.command-list');
  
  if (tabs.length === 0 || contents.length === 0) return;
  
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      // Aktif sekmeyi kaldır
      tabs.forEach(t => t.classList.remove('active'));
      // İçerikleri gizle
      contents.forEach(c => c.style.display = 'none');
      
      // Tıklanan sekmeyi ve ilgili içeriği aktifleştir
      tab.classList.add('active');
      contents[index].style.display = 'block';
    });
  });
  
  // İlk sekmeyi varsayılan olarak aktifleştir
  if (tabs.length > 0 && contents.length > 0) {
    tabs[0].classList.add('active');
    contents[0].style.display = 'block';
  }
}

/**
 * SSS akordeonu
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqItems.length === 0) return;
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Diğer tüm aktif öğeleri kapat
      faqItems.forEach(i => i.classList.remove('active'));
      
      // Tıklanan öğe zaten aktifse kapat, değilse aç
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * Emoji yağmuru efekti
 */
function initEmojiRain() {
  const emojiButton = document.querySelector('.emoji-button');
  if (!emojiButton) return;
  
  const emojiContainer = document.querySelector('.emoji-rain');
  if (!emojiContainer) return;
  
  const emojis = ['🤖', '💬', '🎮', '✨', '🔥', '🎯', '🎲', '🎵', '💯', '⚡'];
  
  emojiButton.addEventListener('click', () => {
    emojiContainer.style.display = 'block';
    
    // 50 adet emoji oluştur
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const emoji = document.createElement('div');
        emoji.classList.add('emoji');
        emoji.style.left = `${Math.random() * 100}%`;
        emoji.style.fontSize = `${Math.random() * 20 + 10}px`;
        emoji.style.animationDuration = `${Math.random() * 3 + 2}s`;
        emoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        
        emojiContainer.appendChild(emoji);
        
        // Animasyon bitince DOM'dan kaldır
        setTimeout(() => {
          emoji.remove();
        }, 5000);
      }, i * 100);
    }
    
    // Yağmur bittikten sonra container'ı gizle
    setTimeout(() => {
      emojiContainer.style.display = 'none';
    }, 6000);
  });
}

/**
 * Form doğrulama
 */
function initFormValidation() {
  const contactForm = document.querySelector('#contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    
    // İsim doğrulama
    const nameInput = contactForm.querySelector('input[name="name"]');
    if (nameInput && nameInput.value.trim() === '') {
      showError(nameInput, 'Lütfen adınızı girin');
      isValid = false;
    } else if (nameInput) {
      removeError(nameInput);
    }
    
    // Email doğrulama
    const emailInput = contactForm.querySelector('input[name="email"]');
    if (emailInput) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput.value.trim() === '') {
        showError(emailInput, 'Lütfen e-posta adresinizi girin');
        isValid = false;
      } else if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'Lütfen geçerli bir e-posta adresi girin');
        isValid = false;
      } else {
        removeError(emailInput);
      }
    }
    
    // Mesaj doğrulama
    const messageInput = contactForm.querySelector('textarea[name="message"]');
    if (messageInput && messageInput.value.trim() === '') {
      showError(messageInput, 'Lütfen mesajınızı girin');
      isValid = false;
    } else if (messageInput) {
      removeError(messageInput);
    }
    
    // Form geçerliyse
    if (isValid) {
      const submitButton = contactForm.querySelector('button[type="submit"]');
      if (submitButton) {
        // Butonu devre dışı bırak ve "Gönderiliyor..." metnini göster
        submitButton.disabled = true;
        submitButton.innerHTML = 'Gönderiliyor...';
        
        // Form gönderimi simüle et
        setTimeout(() => {
          // Form içeriğini temizle
          contactForm.reset();
          
          // Başarı mesajı göster
          const successMessage = document.createElement('div');
          successMessage.classList.add('success-message');
          successMessage.innerHTML = 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.';
          
          contactForm.appendChild(successMessage);
          
          // Butonu eski haline getir
          submitButton.disabled = false;
          submitButton.innerHTML = 'Gönder';
          
          // Başarı mesajını belirli bir süre sonra kaldır
          setTimeout(() => {
            successMessage.remove();
          }, 5000);
        }, 1500);
      }
    }
  });
  
  function showError(input, message) {
    // Var olan hata mesajını kaldır
    removeError(input);
    
    // Hata mesajı oluştur
    const error = document.createElement('div');
    error.classList.add('error-message');
    error.innerHTML = message;
    
    // Hata mesajını input'tan sonra ekle
    input.parentNode.insertBefore(error, input.nextSibling);
    
    // Input'a hata sınıfı ekle
    input.classList.add('error');
  }
  
  function removeError(input) {
    // Input'tan hata sınıfını kaldır
    input.classList.remove('error');
    
    // Var olan hata mesajını bul ve kaldır
    const error = input.parentNode.querySelector('.error-message');
    if (error) {
      error.remove();
    }
  }
}

/**
 * Otomatik yazı efekti
 */
function initTypingEffect() {
  const element = document.querySelector('.typing-effect');
  if (!element) return;
  
  const text = element.getAttribute('data-text');
  if (!text) return;
  
  let index = 0;
  
  function typeText() {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeText, Math.random() * 80 + 50);
    } else {
      // Yazım tamamlandıktan sonra biraz bekle ve silmeye başla
      setTimeout(eraseText, 2000);
    }
  }
  
  function eraseText() {
    const currentText = element.innerHTML;
    if (currentText.length > 0) {
      element.innerHTML = currentText.substring(0, currentText.length - 1);
      setTimeout(eraseText, Math.random() * 40 + 30);
    } else {
      // Silme tamamlandıktan sonra yeniden yazmaya başla
      index = 0;
      setTimeout(typeText, 1000);
    }
  }
  
  // Yazım efektini başlat
  typeText();
}

/**
 * Dil değiştirme fonksiyonu
 */
function switchLanguage(lang) {
  // Dil değiştirme butonlarını bul
  const langButtons = document.querySelectorAll('.lang-switcher button');
  
  // Tüm butonlardan aktif sınıfını kaldır
  langButtons.forEach(btn => btn.classList.remove('active'));
  
  // Seçilen dile ait butona aktif sınıfı ekle
  document.querySelector(`.lang-switcher button[data-lang="${lang}"]`).classList.add('active');
  
  // Web sitesi için dil kodunu localStorage'da sakla
  localStorage.setItem('preferredLanguage', lang);
  
  // Sayfa yeniden yükleniyor hissi ver
  const body = document.querySelector('body');
  body.style.opacity = '0.5';
  
  setTimeout(() => {
    body.style.opacity = '1';
    
    // Burada normalde dil dosyalarından çeviri yapılır
    // Bu örnekte simüle ediyoruz
    translatePage(lang);
  }, 500);
}

/**
 * Sayfa çevirisini simüle eden fonksiyon
 */
function translatePage(lang) {
  // Bu gerçek bir çeviri değil, sadece belirli öğelerin içeriğini değiştirerek simüle ediyoruz
  const translations = {
    'tr': {
      'navHome': 'Ana Sayfa',
      'navFeatures': 'Özellikler',
      'navCommands': 'Komutlar',
      'navContact': 'İletişim',
      'heroTitle': 'Discord Sunucunuzu Güçlendirin',
      'heroDesc': 'Asistan Discord botu ile sunucunuzu yönetin, moderasyon yapın ve eğlenceli komutlarla topluluğunuzu geliştirin.',
      'btnAddBot': 'Botu Ekle',
      'btnSupport': 'Destek Sunucusu'
    },
    'en': {
      'navHome': 'Home',
      'navFeatures': 'Features',
      'navCommands': 'Commands',
      'navContact': 'Contact',
      'heroTitle': 'Enhance Your Discord Server',
      'heroDesc': 'Manage your server, moderate and improve your community with fun commands using Asistan Discord bot.',
      'btnAddBot': 'Add Bot',
      'btnSupport': 'Support Server'
    }
  };
  
  // Dil desteği kontrolü
  if (!translations[lang]) return;
  
  // Çeviri uygulanabilecek elementleri seç ve içeriklerini değiştir
  document.querySelectorAll('[data-translate]').forEach(element => {
    const key = element.getAttribute('data-translate');
    if (translations[lang][key]) {
      element.innerHTML = translations[lang][key];
    }
  });
}

/**
 * Tema değiştirme fonksiyonu (açık/koyu tema)
 */
function toggleTheme() {
  const body = document.body;
  const isDarkMode = body.classList.contains('dark-theme');
  
  // Temayı değiştir
  if (isDarkMode) {
    body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  }
  
  // Tema değiştirme butonunu güncelle
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');
    
    if (isDarkMode) {
      icon.classList.replace('fa-sun', 'fa-moon');
      text.textContent = 'Koyu Tema';
    } else {
      icon.classList.replace('fa-moon', 'fa-sun');
      text.textContent = 'Açık Tema';
    }
  }
}