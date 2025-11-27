// ========== 导航栏交互 ==========
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// 点击导航链接后关闭菜单
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
    });
});

// ========== 首页轮播图功能 (2秒自动切换) ==========
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

// 显示指定幻灯片
function showSlide(index) {
    if (slides.length === 0) return;
    
    // 移除所有active类
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // 处理索引边界
    if (index >= slides.length) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = slides.length - 1;
    } else {
        currentSlideIndex = index;
    }
    
    // 添加active类
    slides[currentSlideIndex].classList.add('active');
    if (dots[currentSlideIndex]) {
        dots[currentSlideIndex].classList.add('active');
    }
}

// 切换幻灯片
function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
    resetInterval();
}

// 跳转到指定幻灯片
function currentSlide(index) {
    showSlide(index);
    resetInterval();
}

// 自动播放
function startSlideShow() {
    if (slides.length === 0) return;
    
    slideInterval = setInterval(() => {
        showSlide(currentSlideIndex + 1);
    }, 2000); // 2秒间隔
}

// 重置自动播放
function resetInterval() {
    clearInterval(slideInterval);
    startSlideShow();
}

// 初始化轮播图
function initSlider() {
    if (slides.length > 0) {
        // 确保第一张显示
        showSlide(0);
        
        // 启动自动播放
        startSlideShow();
        
        // 鼠标悬停时暂停
        const sliderWrapper = document.querySelector('.slider-wrapper');
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            sliderWrapper.addEventListener('mouseleave', () => {
                startSlideShow();
            });
        }
        
        // 添加键盘导航
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                changeSlide(-1);
            } else if (e.key === 'ArrowRight') {
                changeSlide(1);
            }
        });
    }
}

// ========== 其他页面的通用轮播类 ==========
class Slider {
    constructor(selector) {
        this.slider = document.querySelector(selector);
        if (!this.slider) return;
        
        this.slides = this.slider.querySelectorAll('.slide');
        this.dotsContainer = this.slider.querySelector('.slider-controls');
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.autoPlay();
        this.addEventListeners();
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }
    
    goToSlide(index) {
        this.slides[this.currentIndex].classList.remove('active');
        const dots = this.dotsContainer?.querySelectorAll('.slider-dot');
        if (dots) dots[this.currentIndex].classList.remove('active');
        
        this.currentIndex = index;
        
        this.slides[this.currentIndex].classList.add('active');
        if (dots) dots[this.currentIndex].classList.add('active');
    }
    
    nextSlide() {
        const next = (this.currentIndex + 1) % this.slides.length;
        this.goToSlide(next);
    }
    
    prevSlide() {
        const prev = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prev);
    }
    
    autoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
    
    addEventListeners() {
        const prevBtn = this.slider.querySelector('.slider-btn.prev');
        const nextBtn = this.slider.querySelector('.slider-btn.next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => {
            this.prevSlide();
            this.stopAutoPlay();
            this.autoPlay();
        });
        
        if (nextBtn) nextBtn.addEventListener('click', () => {
            this.nextSlide();
            this.stopAutoPlay();
            this.autoPlay();
        });
    }
}

// ========== 论文筛选 ==========
function filterPublications(year) {
    const publications = document.querySelectorAll('.pub-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // 更新按钮状态
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // 筛选论文
    publications.forEach(pub => {
        if (year === 'all' || pub.dataset.year === year) {
            pub.classList.remove('hidden');
            pub.classList.add('fade-in');
        } else {
            pub.classList.add('hidden');
        }
    });
}

// ========== 表单提交 ==========
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 获取表单数据
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // 简单验证
        if (!name || !email || !message) {
            alert('请填写所有必填项！');
            return;
        }
        
        // 这里可以添加实际的表单提交逻辑
        // 例如：使用 fetch API 发送到后端
        console.log('表单数据:', { name, email, message });
        
        alert('消息已发送！我们会尽快回复您。');
        contactForm.reset();
    });
}

// ========== 滚动动画 ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target); // 只触发一次
        }
    });
}, observerOptions);

// 观察所有需要动画的元素
document.querySelectorAll('.card, .pub-item, .team-card, .research-card, .intro-card').forEach(el => {
    observer.observe(el);
});

// ========== 平滑滚动 ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== 返回顶部按钮 ==========
function createBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '↑';
    btn.className = 'back-to-top';
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(btn);
    
    // 显示/隐藏按钮
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.style.opacity = '1';
            btn.style.transform = 'scale(1)';
        } else {
            btn.style.opacity = '0';
            btn.style.transform = 'scale(0.8)';
        }
    });
    
    // 点击返回顶部
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 悬停效果
    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.1)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
    });
}

// ========== 数据管理 (示例) ==========
const postsData = [
    {
        title: 'ISP智能参数优化最新进展',
        image: 'https://via.placeholder.com/400x250/4A90E2/FFFFFF?text=ISP优化',
        date: '2024-11-20',
        excerpt: '介绍团队在图像信号处理器智能参数优化方向的最新研究成果...'
    },
    {
        title: 'Low-Level视觉大模型研究突破',
        image: 'https://via.placeholder.com/400x250/7B68EE/FFFFFF?text=视觉大模型',
        date: '2024-11-15',
        excerpt: '团队提出的底层视觉大模型在多项任务上取得SOTA性能...'
    },
    {
        title: 'AIM 2022竞赛冠军方案解析',
        image: 'https://via.placeholder.com/400x250/10B981/FFFFFF?text=AIM+2022',
        date: '2024-11-10',
        excerpt: '详细解读团队在Learned Smart ISP赛道夺冠的技术方案...'
    }
];

// 动态加载文章
function loadPosts() {
    const postsGrid = document.getElementById('postsGrid');
    if (!postsGrid) return;
    
    postsGrid.innerHTML = ''; // 清空现有内容
    
    postsData.forEach((post, index) => {
        const postCard = document.createElement('div');
        postCard.className = 'card';
        postCard.style.animationDelay = `${index * 0.1}s`;
        postCard.innerHTML = `
            <img src="${post.image}" alt="${post.title}" class="card-image">
            <div class="card-content">
                <h3 class="card-title">${post.title}</h3>
                <p class="card-meta">📅 ${post.date}</p>
                <p class="card-text">${post.excerpt}</p>
                <a href="#" class="read-more">阅读更多 →</a>
            </div>
        `;
        postsGrid.appendChild(postCard);
    });
}

// ========== 页面加载完成后执行 ==========
document.addEventListener('DOMContentLoaded', () => {
    // 初始化首页轮播图
    initSlider();
    
    // 初始化其他页面的轮播（如果存在）
    new Slider('.slider');
    
    // 加载文章
    loadPosts();
    
    // 创建返回顶部按钮
    createBackToTop();
    
    // 添加加载动画
    document.body.classList.add('loaded');
    
    console.log('✅ 智能成像研究小组网站已加载完成');
});

// ========== 页面可见性 API (性能优化) ==========
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 页面不可见时暂停轮播
        clearInterval(slideInterval);
    } else {
        // 页面可见时恢复轮播
        if (slides.length > 0) {
            startSlideShow();
        }
    }
});
