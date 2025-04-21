/**
 * Asistan Bot Web Sitesi - Ana JavaScript Dosyası
 * Sürüm: 1.0.0
 * 
 * Bu dosya, Asistan Bot web sitesindeki tüm etkileşimli
 * bileşenleri ve API çağrılarını yönetir.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Tüm komponentleri başlat
    initializeNavigation();
    initializeCommandTabs();
    initializeContactForm();
    initializeScrollToTop();
    fetchStatistics();
    fetchCommands();
    updateUptime();
    
    // Her 30 saniyede bir istatistikleri güncelle
    setInterval(fetchStatistics, 30000);
    // Her dakika uptime bilgisini güncelle
    setInterval(updateUptime, 60000);
});

/**
 * Gezinme (Navigation) işlevlerini başlatır
 * - Menü açma/kapama
 * - Kaydırma olayları
 * - Aktif bağlantıları izleme
 */
function initializeNavigation() {
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    
    // Menü açma/kapama
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Kaydırmada header'ın görünümünü değiştir
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Aktif bağlantıları güncelle
        updateActiveNavLinks();
    });
    
    // Bağlantı tıklandığında mobil menüyü kapat
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
    // Sayfa yüklendiğinde aktif bağlantıları güncelle
    updateActiveNavLinks();
}

/**
 * Komut sekmeleri (tabs) için etkileşimleri başlatır
 */
function initializeCommandTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif sekme düğmesini güncelle
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Aktif sekme içeriğini göster
            const tabId = button.getAttribute('data-tab');
            document.querySelectorAll('.tab-pane').forEach(tab => tab.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * İletişim formunu başlatır
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Form verilerini al
        const formData = {
            name: contactForm.name.value,
            email: contactForm.email.value,
            subject: contactForm.subject.value,
            message: contactForm.message.value
        };
        
        try {
            // API'ye form verilerini gönder
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Başarılı durumda
                contactForm.reset();
                formSuccess.style.display = 'flex';
                formError.style.display = 'none';
                
                // 5 saniye sonra başarı mesajını gizle
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                }, 5000);
            } else {
                // Hata durumunda
                throw new Error(data.message || 'Bir hata oluştu');
            }
        } catch (error) {
            // Hata mesajını göster
            formError.innerHTML = `<i class="fas fa-exclamation-circle"></i><p>${error.message || 'Mesajınız gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'}</p>`;
            formError.style.display = 'flex';
            formSuccess.style.display = 'none';
            
            // 5 saniye sonra hata mesajını gizle
            setTimeout(() => {
                formError.style.display = 'none';
            }, 5000);
        }
    });
}

/**
 * Başa dön (back to top) düğmesini başlatır
 */
function initializeScrollToTop() {
    const scrollToTopButton = document.querySelector('.back-to-top');
    
    // Kaydırma durumuna göre düğmeyi göster/gizle
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTopButton.classList.add('show');
        } else {
            scrollToTopButton.classList.remove('show');
        }
    });
    
    // Düğmeye tıklama işlevi
    scrollToTopButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * API'den bot istatistiklerini çeker ve sayfayı günceller
 */
async function fetchStatistics() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        // Hero bölümündeki istatistikleri güncelle
        document.getElementById('server-count').textContent = formatNumber(data.servers) + '+';
        document.getElementById('user-count').textContent = formatNumber(data.users, true) + '+';
        
        // İstatistikler bölümündeki istatistikleri güncelle
        document.getElementById('stats-servers').textContent = formatNumber(data.servers);
        document.getElementById('stats-users').textContent = formatNumber(data.users);
        document.getElementById('stats-shards').textContent = formatNumber(data.shards);
        document.getElementById('stats-commands').textContent = formatNumber(data.commands);
    } catch (error) {
        console.error('İstatistikler çekilirken hata oluştu:', error);
    }
}

/**
 * API'den komutları çeker ve komut sekmelerini günceller
 */
async function fetchCommands() {
    try {
        const response = await fetch('/api/commands');
        const data = await response.json();
        
        // Her komut kategorisi için komutları göster
        Object.keys(data).forEach(category => {
            const commandsList = document.querySelector(`#${category} .commands-list`);
            
            // Yükleniyor göstergesini temizle
            commandsList.innerHTML = '';
            
            // Komutları ekle
            data[category].forEach(command => {
                const commandElement = document.createElement('div');
                commandElement.className = 'command-item';
                commandElement.innerHTML = `
                    <div class="command-name">${command.name}</div>
                    <div class="command-description">${command.description}</div>
                    <div class="command-usage">${command.usage}</div>
                `;
                commandsList.appendChild(commandElement);
            });
        });
    } catch (error) {
        console.error('Komutlar çekilirken hata oluştu:', error);
        
        // Hata durumunda tüm komut listelerini güncelle
        document.querySelectorAll('.commands-list').forEach(list => {
            list.innerHTML = `
                <div class="command-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Komutlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
                </div>
            `;
        });
    }
}

/**
 * Uptime bilgisini alır ve sayfayı günceller
 */
async function updateUptime() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        if (data.uptime) {
            document.getElementById('uptime').textContent = formatUptime(data.uptime);
        } else {
            throw new Error('Uptime bilgisi bulunamadı');
        }
    } catch (error) {
        console.error('Uptime bilgisi alınırken hata oluştu:', error);
        document.getElementById('uptime').textContent = 'Bilgi alınamıyor';
    }
}

/**
 * Sayı formatlamayı sağlar (1000 -> 1,000 veya 1k)
 * @param {number} number - Formatlanacak sayı
 * @param {boolean} useKFormat - Kısaltılmış format kullanılsın mı (1k, 1m gibi)
 * @returns {string} - Formatlanmış sayı
 */
function formatNumber(number, useKFormat = false) {
    if (useKFormat) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
        }
        if (number >= 1000) {
            return (number / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        }
        return number.toString();
    }
    
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Saniyeyi formatlanmış bir uptime metnine dönüştürür
 * @param {number} seconds - Toplam saniye
 * @returns {string} - Formatlanmış uptime metni (1 gün, 2 saat, 3 dakika)
 */
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    let uptimeText = '';
    
    if (days > 0) {
        uptimeText += `${days} gün`;
        if (hours > 0 || minutes > 0) uptimeText += ', ';
    }
    
    if (hours > 0) {
        uptimeText += `${hours} saat`;
        if (minutes > 0) uptimeText += ', ';
    }
    
    if (minutes > 0 || (days === 0 && hours === 0)) {
        uptimeText += `${minutes} dakika`;
    }
    
    return uptimeText;
}

/**
 * Aktif navigasyon bağlantılarını günceller
 */
function updateActiveNavLinks() {
    // Tüm bölümleri al
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Pencere kaydırma pozisyonunu al
    const scrollPosition = window.scrollY + 100;
    
    // Her bölüm için kontrol et
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        // Kaydırma pozisyonu bu bölümün içinde mi?
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Tüm bağlantılardan active sınıfını kaldır
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Eşleşen bağlantıya active sınıfını ekle
            document.querySelector(`.nav-links a[href="#${sectionId}"]`).classList.add('active');
        }
    });
}
