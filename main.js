document.addEventListener('DOMContentLoaded', function() {
 
    const menuBtn = document.querySelector(".menu__btn");
    const menu = document.querySelector(".menu__list");

    if (menuBtn && menu) {
        menuBtn.addEventListener("click", () => {
            menu.classList.toggle("menu__list--active");
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('menu__list--active')) {
                menu.classList.remove("menu__list--active");
            }
        });
    }

  
    if (document.querySelector('.swiper')) {
        const swiper = new Swiper(".swiper", {
            effect: "fade",
            pagination: {
                el: ".swiper-pagination",
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') swiper.slidePrev();
            else if (e.key === 'ArrowRight') swiper.slideNext();
        });
    }


    const initCardEffects = (cards) => {
        const cardStyles = document.createElement('style');
        cardStyles.textContent = `
            .card {
                position: relative;
                overflow: hidden;
                transform-style: preserve-3d;
                transition: transform 0.5s ease, box-shadow 0.3s ease;
            }
            .card-glow {
                position: absolute;
                width: 100px;
                height: 100px;
                background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1;
            }
            .card:hover .card-glow {
                opacity: 1;
            }
        `;
        document.head.appendChild(cardStyles);

        cards.forEach(card => {
            const glow = document.createElement('div');
            glow.className = 'card-glow';
            card.prepend(glow);
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const xAxis = (centerY - y) / 20;
                const yAxis = (centerX - x) / 20;
                
                card.style.transform = `rotateX(${xAxis}deg) rotateY(${yAxis}deg)`;
                glow.style.left = `${x}px`;
                glow.style.top = `${y}px`;
            });
            
            card.addEventListener('mouseenter', () => {
                card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateX(0) rotateY(0)';
                card.style.boxShadow = 'none';
            });
        });
    };


const tabsContainer = document.querySelector('.tabs__btn');
const tabsContent = document.querySelector('.tabs__content-item');

if (tabsContainer && tabsContent) {
    const allCards = Array.from(tabsContent.querySelectorAll('.card'));
    initCardEffects(allCards); 
    
   
    const tabsStyles = document.createElement('style');
    tabsStyles.textContent = `
        .tabs__content-item {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
        }
        .card {
            transition: all 0.5s ease;
            opacity: 0;
            transform: translateY(20px);
        }
        .card.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(tabsStyles);

    const cardsByCategory = {};
    
    cardsByCategory['ВСЕ'] = [...allCards];
    
    allCards.forEach(card => {
        const category = card.dataset.category || 'Аристократичные породы'; 
        if (!cardsByCategory[category]) cardsByCategory[category] = [];
        cardsByCategory[category].push(card);
        card.classList.add('hidden'); 
    });

    const showCards = (cards) => {
        allCards.forEach(card => {
            card.classList.add('hidden');
            card.classList.remove('visible');
        });
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove('hidden');
                setTimeout(() => card.classList.add('visible'), 10);
            }, index * 150); 
        });
    };

    tabsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.tabs__btn-item');
        if (!btn) return;

   
        tabsContainer.querySelectorAll('.tabs__btn-item').forEach(item => {
            item.classList.remove('tabs__btn-item--active');
        });
        btn.classList.add('tabs__btn-item--active');

        const category = btn.textContent.trim();
        const categoryCards = cardsByCategory[category] || [];
        
        if (category === 'ВСЕ') {
            showCards(allCards);
        } else {
            const shuffledCards = [...categoryCards].sort(() => Math.random() - 0.5);
            showCards(shuffledCards.slice(0, 4)); 
        }
    });


    const firstBtn = tabsContainer.querySelector('.tabs__btn-item');
    if (firstBtn) firstBtn.click();
}


    const form = document.querySelector('form');
    if (form) {
        const formStyles = document.createElement('style');
        formStyles.textContent = `
            .form__btn { transition: all 0.3s ease; }
            .form__btn:disabled { opacity: 0.7; }
            .spinner {
                display: inline-block;
                width: 1rem;
                height: 1rem;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 1s ease-in-out infinite;
                margin-right: 8px;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
        `;
        document.head.appendChild(formStyles);

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('.form__btn') || this.querySelector('[type="submit"]');
            if (!submitBtn) return;

            const originalHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner"></span><span>Отправляется...</span>`;
            
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                submitBtn.innerHTML = '✓ Отправлено!';
                this.reset();
                setTimeout(() => {
                    submitBtn.innerHTML = originalHtml;
                    submitBtn.disabled = false;
                }, 2000);
            } catch (error) {
                submitBtn.innerHTML = '✗ Ошибка!';
                setTimeout(() => {
                    submitBtn.innerHTML = 'Try Again';
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
});