// Main JavaScript File
class ZoonApp {
    constructor() {
        this.currentPage = 'home';
        this.pages = {};
        this.isMobile = window.innerWidth < 992;
        
        this.init();
    }

    async init() {
        // Initialize loading screen
        this.initLoader();
        
        // Load navigation
        await this.loadNavigation();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize background effects
        this.initBackground();
        this.createParticles();
        
        // Hide loader
        setTimeout(() => {
            this.hideLoader();
        }, 1000);
    }

    initLoader() {
        const loader = document.getElementById('page-loader');
        const progressBar = document.getElementById('loader-progress');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 150);
    }

    hideLoader() {
        const loader = document.getElementById('page-loader');
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 500);
    }

    async loadNavigation() {
        try {
            const response = await fetch('/data/pages.json');
            const data = await response.json();
            this.pages = data;
            
            this.renderNavigation(data.navigation);
            this.renderFooter(data.footer);
        } catch (error) {
            console.error('Error loading navigation:', error);
            this.renderDefaultNavigation();
        }
    }

    renderNavigation(navData) {
        const desktopNav = document.getElementById('nav-links');
        const mobileNav = document.getElementById('mobile-nav');
        
        if (!desktopNav || !mobileNav) return;
        
        // Clear existing navigation
        desktopNav.innerHTML = '';
        mobileNav.innerHTML = '';
        
        // Render desktop navigation
        navData.desktop.forEach(item => {
            if (item.type === 'link') {
                desktopNav.innerHTML += this.createNavLink(item);
                mobileNav.innerHTML += this.createMobileNavLink(item);
            } else if (item.type === 'dropdown') {
                desktopNav.innerHTML += this.createDropdown(item);
                mobileNav.innerHTML += this.createMobileDropdown(item);
            }
        });
        
        // Add CTA button to mobile nav
        mobileNav.innerHTML += `
            <button class="cta-button" style="margin-top: 30px; width: 100%;" onclick="scrollToContact()">
                <i class="fas fa-rocket"></i> Start Project
            </button>
        `;
    }

    createNavLink(item) {
        return `
            <a href="${item.href}" class="nav-link" data-page="${item.page || ''}">
                ${item.icon ? `<i class="${item.icon}"></i>` : ''}
                ${item.text}
            </a>
        `;
    }

    createDropdown(item) {
        return `
            <div class="dropdown">
                <a href="#" class="nav-link">
                    ${item.icon ? `<i class="${item.icon}"></i>` : ''}
                    ${item.text} <i class="fas fa-chevron-down"></i>
                </a>
                <div class="dropdown-content">
                    ${item.items.map(subItem => `
                        <a href="${subItem.href}" data-page="${subItem.page || ''}">
                            <i class="${subItem.icon}"></i> ${subItem.text}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    createMobileNavLink(item) {
        return `
            <a href="${item.href}" class="nav-link" data-page="${item.page || ''}">
                ${item.icon ? `<i class="${item.icon}"></i>` : ''}
                ${item.text}
            </a>
        `;
    }

    createMobileDropdown(item) {
        return `
            <div class="dropdown">
                <a href="#" class="nav-link">
                    ${item.icon ? `<i class="${item.icon}"></i>` : ''}
                    ${item.text} <i class="fas fa-chevron-down"></i>
                </a>
                <div class="dropdown-content">
                    ${item.items.map(subItem => `
                        <a href="${subItem.href}" data-page="${subItem.page || ''}">
                            <i class="${subItem.icon}"></i> ${subItem.text}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderFooter(footerData) {
        const footer = document.getElementById('main-footer');
        if (!footer) return;
        
        footer.innerHTML = `
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="footer-logo">Zoon.ai</div>
                    <p class="footer-tagline">${footerData.tagline}</p>
                    <div class="social-links">
                        ${footerData.social.map(social => `
                            <a href="${social.url}" class="social-link" target="_blank">
                                <i class="${social.icon}"></i>
                            </a>
                        `).join('')}
                    </div>
                </div>
                
                <div class="footer-links">
                    ${footerData.columns.map(column => `
                        <div class="footer-column">
                            <h4>${column.title}</h4>
                            <ul>
                                ${column.links.map(link => `
                                    <li><a href="${link.href}" data-page="${link.page || ''}">${link.text}</a></li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="copyright">
                <p>&copy; ${new Date().getFullYear()} ${footerData.copyright}</p>
                <p style="margin-top: 10px; font-size: 13px;">
                    ${footerData.legal.map(link => `
                        <a href="${link.href}" style="color: var(--text-muted); margin-right: 20px;">${link.text}</a>
                    `).join('')}
                </p>
                <p style="margin-top: 10px; font-size: 12px;">${footerData.footerNote}</p>
            </div>
        `;
    }

    renderDefaultNavigation() {
        const desktopNav = document.getElementById('nav-links');
        const mobileNav = document.getElementById('mobile-nav');
        
        const defaultNav = `
            <a href="#home" class="nav-link" data-page="home">
                <i class="fas fa-home"></i> Home
            </a>
            <div class="dropdown">
                <a href="#services" class="nav-link">
                    <i class="fas fa-cube"></i> Services
                </a>
                <div class="dropdown-content">
                    <a href="#ai-ml" data-page="ai-ml">
                        <i class="fas fa-brain"></i> AI & Machine Learning
                    </a>
                    <a href="#web-mobile" data-page="web-mobile">
                        <i class="fas fa-code"></i> Modern Web & Mobile
                    </a>
                    <a href="#enterprise" data-page="enterprise">
                        <i class="fas fa-server"></i> Enterprise Solutions
                    </a>
                    <a href="#design" data-page="design">
                        <i class="fas fa-paint-brush"></i> Creative & UX Design
                    </a>
                </div>
            </div>
            <div class="dropdown">
                <a href="#technologies" class="nav-link">
                    <i class="fas fa-microchip"></i> Technologies
                </a>
                <div class="dropdown-content">
                    <a href="#ai-stack" data-page="ai-stack">
                        <i class="fas fa-robot"></i> AI/ML Stack
                    </a>
                    <a href="#web-stack" data-page="web-stack">
                        <i class="fas fa-globe"></i> Web Stack
                    </a>
                    <a href="#cloud-stack" data-page="cloud-stack">
                        <i class="fas fa-cloud"></i> Cloud & Data
                    </a>
                </div>
            </div>
            <a href="#case-studies" class="nav-link" data-page="case-studies">
                <i class="fas fa-chart-line"></i> Case Studies
            </a>
            <a href="#process" class="nav-link" data-page="process">
                <i class="fas fa-cogs"></i> Process
            </a>
            <a href="#contact" class="nav-link" data-page="contact">
                <i class="fas fa-envelope"></i> Contact
            </a>
        `;
        
        desktopNav.innerHTML = defaultNav;
        mobileNav.innerHTML = defaultNav + `
            <button class="cta-button" style="margin-top: 30px; width: 100%;" onclick="scrollToContact()">
                <i class="fas fa-rocket"></i> Start Project
            </button>
        `;
    }

    setupEventListeners() {
        // Mobile navigation toggle
        const mobileToggle = document.getElementById('mobile-toggle');
        const mobileNav = document.getElementById('mobile-nav');
        
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileNav.classList.toggle('active');
            mobileToggle.innerHTML = mobileNav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileNav.contains(e.target) && !mobileToggle.contains(e.target) && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Close mobile nav when clicking a link
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mobile-nav .nav-link')) {
                mobileNav.classList.remove('active');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('main-header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Navigation click handler
        document.addEventListener('click', (e) => {
            const navLink = e.target.closest('a[data-page]');
            if (navLink) {
                e.preventDefault();
                const page = navLink.dataset.page;
                if (page) {
                    this.loadPage(page);
                    this.scrollToTop();
                }
            }
        });
        
        // Form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        // Window resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 992;
        });
    }

    async loadPage(pageName) {
        this.currentPage = pageName;
        
        // Show loading state
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = '<div class="loading">Loading...</div>';
        
        try {
            // Load page content
            const response = await fetch(`/data/${pageName}.json`);
            const pageData = await response.json();
            
            // Render page
            this.renderPage(pageData);
            
            // Update URL
            history.pushState({ page: pageName }, '', `#${pageName}`);
            
            // Initialize page-specific scripts
            this.initPageScripts(pageName);
            
        } catch (error) {
            console.error('Error loading page:', error);
            mainContent.innerHTML = `
                <div style="text-align: center; padding: 100px 5%;">
                    <h2>Error Loading Page</h2>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }

    renderPage(pageData) {
        const mainContent = document.getElementById('main-content');
        
        let html = '';
        
        switch (pageData.type) {
            case 'home':
                html = this.renderHomePage(pageData);
                break;
            case 'service':
                html = this.renderServicePage(pageData);
                break;
            case 'tech':
                html = this.renderTechPage(pageData);
                break;
            case 'case-study':
                html = this.renderCaseStudiesPage(pageData);
                break;
            case 'about':
                html = this.renderAboutPage(pageData);
                break;
            default:
                html = this.renderGenericPage(pageData);
        }
        
        mainContent.innerHTML = html;
        
        // Initialize animations
        setTimeout(() => {
            this.initAnimations();
        }, 100);
    }

    renderHomePage(data) {
        return `
            <!-- Hero Section -->
            <section class="hero" id="home">
                <div class="hero-content">
                    <div class="hero-badge">
                        <i class="fas fa-bolt"></i> ${data.hero.badge}
                    </div>
                    <h1 class="hero-title">${data.hero.title}</h1>
                    <p class="hero-subtitle">${data.hero.subtitle}</p>
                    
                    <div class="hero-cta-container">
                        <button class="cta-button" onclick="scrollToContact()">
                            <i class="fas fa-rocket"></i> Start AI Project
                        </button>
                        <button class="secondary-button" onclick="app.loadPage('case-studies')">
                            <i class="fas fa-eye"></i> View Case Studies
                        </button>
                        <button class="secondary-button" onclick="app.loadPage('about')">
                            <i class="fas fa-play-circle"></i> Watch Demo
                        </button>
                    </div>
                </div>
            </section>
            
            <!-- Stats Section -->
            <section class="stats">
                ${data.stats.map(stat => `
                    <div class="stat-item">
                        <div class="stat-number">${stat.value}</div>
                        <div class="stat-label">${stat.label}</div>
                    </div>
                `).join('')}
            </section>
            
            <!-- Services Section -->
            <section class="services" id="services">
                <div class="section-header">
                    <h2 class="section-title">${data.services.title}</h2>
                    <p class="section-subtitle">${data.services.subtitle}</p>
                </div>
                
                <div class="services-grid">
                    ${data.services.items.map(service => `
                        <div class="service-card" id="${service.id}">
                            <div class="service-icon ${service.iconClass || ''}">
                                <i class="${service.icon}"></i>
                            </div>
                            <h3 class="service-title">${service.title}</h3>
                            <p class="service-description">${service.description}</p>
                            <ul class="service-features">
                                ${service.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                            <a href="#" class="service-link" data-page="${service.page}">
                                ${service.linkText} <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <!-- AI Showcase Section -->
            <section class="ai-showcase" id="technologies">
                <div class="section-header">
                    <h2 class="section-title">${data.showcase.title}</h2>
                    <p class="section-subtitle">${data.showcase.subtitle}</p>
                </div>
                
                <div class="ai-showcase-content">
                    <div class="ai-visual">
                        <canvas id="neuralCanvas" class="neural-network"></canvas>
                    </div>
                    
                    <div class="ai-details">
                        <h3>${data.showcase.details.title}</h3>
                        ${data.showcase.details.paragraphs.map(p => `<p>${p}</p>`).join('')}
                        
                        <h4 style="margin-top: 40px; color: var(--accent-cyan);">Core AI Technologies</h4>
                        <div class="tech-stack">
                            ${data.showcase.technologies.map(tech => `
                                <div class="tech-item">${tech}</div>
                            `).join('')}
                        </div>
                        
                        <button class="cta-button" style="margin-top: 50px;" data-page="ai-stack">
                            <i class="fas fa-robot"></i> Explore AI Technologies
                        </button>
                    </div>
                </div>
            </section>
            
            <!-- Process Section -->
            <section class="process" id="process">
                <div class="section-header">
                    <h2 class="section-title">${data.process.title}</h2>
                    <p class="section-subtitle">${data.process.subtitle}</p>
                </div>
                
                <div class="process-steps">
                    ${data.process.steps.map(step => `
                        <div class="process-step">
                            <div class="step-number">${step.number}</div>
                            <h3 class="step-title">${step.title}</h3>
                            <p class="step-description">${step.description}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <!-- Contact Section -->
            <section class="contact" id="contact">
                <div class="section-header">
                    <h2 class="section-title">${data.contact.title}</h2>
                    <p class="section-subtitle">${data.contact.subtitle}</p>
                </div>
                
                <div class="contact-container">
                    <div class="contact-form">
                        <h3>Start Your Project</h3>
                        <form id="project-form">
                            <div class="form-group">
                                <label class="form-label" for="name">Full Name</label>
                                <input type="text" id="name" class="form-input" placeholder="Enter your name" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="email">Email Address</label>
                                <input type="email" id="email" class="form-input" placeholder="Enter your email" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="company">Company</label>
                                <input type="text" id="company" class="form-input" placeholder="Your company name">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="service">Primary Service Interest</label>
                                <select id="service" class="form-select">
                                    <option value="">Select a service</option>
                                    <option value="ai-ml">AI & Machine Learning</option>
                                    <option value="web">Modern Web & Mobile</option>
                                    <option value="enterprise">Enterprise Solutions</option>
                                    <option value="design">Creative & UX Design</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="budget">Project Budget Range</label>
                                <select id="budget" class="form-select">
                                    <option value="">Select budget range</option>
                                    <option value="25-50">$25,000 - $50,000</option>
                                    <option value="50-100">$50,000 - $100,000</option>
                                    <option value="100-250">$100,000 - $250,000</option>
                                    <option value="250+">$250,000+</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="message">Project Details</label>
                                <textarea id="message" class="form-textarea" placeholder="Describe your project, goals, and timeline..."></textarea>
                            </div>
                            
                            <button type="submit" class="cta-button" style="width: 100%;">
                                <i class="fas fa-paper-plane"></i> Submit Project Request
                            </button>
                        </form>
                    </div>
                    
                    <div class="contact-info">
                        <h3>Get In Touch</h3>
                        
                        ${data.contact.methods.map(method => `
                            <div class="contact-method">
                                <div class="contact-icon">
                                    <i class="${method.icon}"></i>
                                </div>
                                <div class="contact-details">
                                    <h4>${method.title}</h4>
                                    ${method.details.map(detail => `<p>${detail}</p>`).join('')}
                                    ${method.button ? `
                                        <button class="secondary-button" style="margin-top: 15px;">
                                            <i class="${method.button.icon}"></i> ${method.button.text}
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    }

    renderServicePage(data) {
        return `
            <section class="service-hero">
                <div class="service-hero-content">
                    <div class="service-hero-badge" style="${data.badgeStyle}">
                        <i class="${data.icon}"></i> ${data.category}
                    </div>
                    <h1 class="service-hero-title" style="${data.titleStyle}">${data.title}</h1>
                    <p class="service-hero-subtitle">${data.subtitle}</p>
                </div>
            </section>
            
            <section class="capabilities">
                <h2 class="section-title">${data.capabilities.title}</h2>
                
                <div class="services-grid">
                    ${data.capabilities.items.map(capability => `
                        <div class="service-card">
                            <div class="service-icon" style="${capability.iconStyle}">
                                <i class="${capability.icon}"></i>
                            </div>
                            <h3 class="service-title">${capability.title}</h3>
                            <p class="service-description">${capability.description}</p>
                            <ul class="service-features">
                                ${capability.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <section class="workflow">
                <h2 class="section-title">${data.workflow.title}</h2>
                
                <div class="process-steps">
                    ${data.workflow.steps.map(step => `
                        <div class="process-step">
                            <div class="step-number">${step.number}</div>
                            <h3 class="step-title">${step.title}</h3>
                            <p class="step-description">${step.description}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <section style="padding: 100px 5%; text-align: center;">
                <h2 style="font-size: 2.5rem; margin-bottom: 30px;">Ready to Get Started?</h2>
                <button class="cta-button" onclick="scrollToContact()">
                    <i class="fas fa-calendar"></i> Schedule Consultation
                </button>
            </section>
        `;
    }

    renderTechPage(data) {
        return `
            <section class="service-hero">
                <div class="service-hero-content">
                    <div class="service-hero-badge">
                        <i class="fas fa-microchip"></i> ${data.category}
                    </div>
                    <h1 class="service-hero-title">${data.title}</h1>
                    <p class="service-hero-subtitle">${data.subtitle}</p>
                </div>
            </section>
            
            <section class="capabilities">
                <h2 class="section-title">${data.sections.title}</h2>
                
                <div class="services-grid">
                    ${data.sections.items.map(section => `
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="${section.icon}"></i>
                            </div>
                            <h3 class="service-title">${section.title}</h3>
                            <ul class="service-features">
                                ${section.items.map(item => `<li><strong>${item.name}</strong> - ${item.description}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    renderCaseStudiesPage(data) {
        return `
            <section class="service-hero">
                <div class="service-hero-content">
                    <div class="service-hero-badge">
                        <i class="fas fa-chart-line"></i> Case Studies
                    </div>
                    <h1 class="service-hero-title">${data.title}</h1>
                    <p class="service-hero-subtitle">${data.subtitle}</p>
                </div>
            </section>
            
            <div class="services-grid" style="padding: 80px 5%; max-width: 1400px; margin: 0 auto;">
                ${data.cases.map(caseStudy => `
                    <div class="service-card">
                        <div class="service-icon" style="background: ${caseStudy.color}">
                            <i class="${caseStudy.icon}"></i>
                        </div>
                        <span class="service-hero-badge" style="display: inline-block; margin-bottom: 20px;">
                            ${caseStudy.industry}
                        </span>
                        <h3 class="service-title">${caseStudy.title}</h3>
                        <p class="service-description">${caseStudy.description}</p>
                        
                        <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px; margin-top: 20px;">
                            ${caseStudy.results.map(result => `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                    <span style="color: var(--text-secondary);">${result.label}</span>
                                    <span style="color: var(--accent-cyan); font-weight: 600;">${result.value}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderAboutPage(data) {
        return `
            <section class="service-hero">
                <div class="service-hero-content">
                    <div class="service-hero-badge">
                        <i class="fas fa-users"></i> About Us
                    </div>
                    <h1 class="service-hero-title">${data.title}</h1>
                    <p class="service-hero-subtitle">${data.subtitle}</p>
                </div>
            </section>
            
            <section style="padding: 100px 5%; max-width: 1200px; margin: 0 auto;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;">
                    <div>
                        <h2 style="font-size: 2.5rem; margin-bottom: 30px; color: var(--accent-cyan);">Our Mission</h2>
                        ${data.mission.map(p => `<p style="color: var(--text-secondary); font-size: 1.2rem; line-height: 1.8; margin-bottom: 30px;">${p}</p>`).join('')}
                    </div>
                    <div style="background: var(--gradient-card); padding: 50px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <h3 style="font-size: 1.8rem; margin-bottom: 30px; color: var(--text-primary);">Our Values</h3>
                        ${data.values.map(value => `
                            <div style="margin-bottom: 25px;">
                                <h4 style="color: var(--accent-cyan); margin-bottom: 10px;">${value.title}</h4>
                                <p style="color: var(--text-secondary);">${value.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
            
            <section style="padding: 100px 5%; background: rgba(0, 0, 0, 0.3);">
                <div style="max-width: 1200px; margin: 0 auto;">
                    <h2 style="font-size: 2.5rem; text-align: center; margin-bottom: 60px;">Our Team</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px;">
                        ${data.team.map(member => `
                            <div style="text-align: center;">
                                <div style="width: 150px; height: 150px; background: var(--gradient-cyber); border-radius: 50%; margin: 0 auto 20px;"></div>
                                <h3 style="color: var(--text-primary); margin-bottom: 10px;">${member.name}</h3>
                                <p style="color: var(--accent-cyan); margin-bottom: 15px;">${member.role}</p>
                                <p style="color: var(--text-secondary);">${member.bio}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    }

    renderGenericPage(data) {
        return `
            <section class="service-hero">
                <div class="service-hero-content">
                    <div class="service-hero-badge">
                        <i class="${data.icon || 'fas fa-file'}"></i> ${data.category}
                    </div>
                    <h1 class="service-hero-title">${data.title}</h1>
                    <p class="service-hero-subtitle">${data.subtitle}</p>
                </div>
            </section>
            
            <section style="padding: 100px 5%; max-width: 800px; margin: 0 auto;">
                ${data.content.map(section => `
                    <div style="margin-bottom: 60px;">
                        <h2 style="font-size: 2rem; margin-bottom: 20px; color: var(--accent-cyan);">${section.title}</h2>
                        ${section.paragraphs.map(p => `<p style="color: var(--text-secondary); margin-bottom: 20px; line-height: 1.7;">${p}</p>`).join('')}
                    </div>
                `).join('')}
            </section>
        `;
    }

    initPageScripts(pageName) {
        switch (pageName) {
            case 'home':
                this.initHomePageScripts();
                break;
            case 'ai-ml':
            case 'web-mobile':
            case 'enterprise':
            case 'design':
                this.initServicePageScripts();
                break;
            case 'ai-stack':
            case 'web-stack':
            case 'cloud-stack':
                this.initTechPageScripts();
                break;
            case 'case-studies':
                this.initCaseStudiesScripts();
                break;
        }
        
        // Initialize form submission for all pages
        const form = document.getElementById('project-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }

    initHomePageScripts() {
        // Animate stats
        this.animateStats();
        
        // Initialize neural network
        this.initNeuralNetwork();
        
        // Initialize floating elements
        this.createFloatingElements();
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const originalText = stat.textContent;
                    const targetValue = parseFloat(originalText);
                    const isPercentage = originalText.includes('%');
                    const hasPlus = originalText.includes('+');
                    let currentValue = 0;
                    
                    const increment = targetValue / 60;
                    
                    const updateCounter = () => {
                        if (currentValue < targetValue) {
                            currentValue += increment;
                            const displayValue = isPercentage 
                                ? currentValue.toFixed(1)
                                : Math.ceil(currentValue);
                            
                            stat.textContent = displayValue + 
                                (isPercentage ? '%' : '') + 
                                (hasPlus && !isPercentage ? '+' : '');
                            
                            setTimeout(updateCounter, 20);
                        } else {
                            stat.textContent = targetValue + 
                                (isPercentage ? '%' : '') + 
                                (hasPlus && !isPercentage ? '+' : '');
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }

    initNeuralNetwork() {
        const canvas = document.getElementById('neuralCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        function setCanvasDimensions() {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = canvas.parentElement.clientHeight;
        }
        
        setCanvasDimensions();
        window.addEventListener('resize', setCanvasDimensions);
        
        // Neural network implementation
        let nodes = [];
        let connections = [];
        
        function initNeuralNetwork() {
            nodes = [];
            connections = [];
            
            const layers = 6;
            const nodesPerLayer = [4, 6, 8, 10, 8, 4];
            const layerSpacing = canvas.width / (layers + 1);
            
            for (let l = 0; l < layers; l++) {
                const ySpacing = canvas.height / (nodesPerLayer[l] + 1);
                
                for (let n = 0; n < nodesPerLayer[l]; n++) {
                    nodes.push({
                        x: (l + 1) * layerSpacing,
                        y: (n + 1) * ySpacing,
                        vx: (Math.random() - 0.5) * 0.3,
                        vy: (Math.random() - 0.5) * 0.3,
                        radius: 4 + Math.random() * 4,
                        pulse: Math.random() * Math.PI * 2,
                        layer: l
                    });
                }
            }
        }
        
        function animate() {
            ctx.fillStyle = 'rgba(10, 10, 20, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            requestAnimationFrame(animate);
        }
        
        initNeuralNetwork();
        animate();
    }

    createFloatingElements() {
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-elements';
        floatingContainer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
            z-index: 1;
        `;
        
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.appendChild(floatingContainer);
            
            const elements = ['fa-brain', 'fa-robot', 'fa-code', 'fa-cloud'];
            elements.forEach((icon, index) => {
                const element = document.createElement('div');
                element.className = 'floating-element';
                element.innerHTML = `<i class="fas ${icon}"></i>`;
                element.style.cssText = `
                    position: absolute;
                    font-size: 24px;
                    opacity: 0.3;
                    animation: floatAround 20s infinite linear;
                    top: ${20 + index * 20}%;
                    left: ${10 + index * 20}%;
                `;
                floatingContainer.appendChild(element);
            });
        }
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 3 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const opacity = Math.random() * 0.3 + 0.1;
            const color = Math.random() > 0.5 ? 'var(--accent-cyan)' : 'var(--accent-magenta)';
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.opacity = opacity;
            particle.style.background = color;
            particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
            
            const duration = Math.random() * 20 + 20;
            particle.style.animation = `float ${duration}s infinite ease-in-out`;
            
            particlesContainer.appendChild(particle);
        }
    }

    initBackground() {
        VANTA.NET({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x9d4edd,
            backgroundColor: 0x0a0a0f,
            points: 20.00,
            maxDistance: 25.00,
            spacing: 15.00
        });
    }

    initAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .process-step, .ai-visual, .contact-container');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(el => observer.observe(el));
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('name')?.value;
        const service = document.getElementById('service')?.value;
        
        const successMessage = `Thank you ${name}! Your ${service ? service + ' ' : ''}project request has been submitted. Our AI specialists will contact you within 24 hours.`;
        
        // Create modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: var(--gradient-card);
            padding: 40px;
            border-radius: 20px;
            border: 1px solid var(--accent-cyan);
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            z-index: 9999;
            max-width: 500px;
            text-align: center;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="font-size: 48px; color: var(--accent-cyan); margin-bottom: 20px;">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3 style="margin-bottom: 20px; color: var(--text-primary);">Request Submitted!</h3>
            <p style="color: var(--text-secondary); margin-bottom: 30px;">${successMessage}</p>
            <button class="cta-button" onclick="this.parentElement.remove()">
                <i class="fas fa-check"></i> Continue Browsing
            </button>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
            modal.style.opacity = '1';
        }, 10);
        
        // Reset form
        e.target.reset();
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    scrollToContact() {
        this.loadPage('contact');
        this.scrollToTop();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ZoonApp();
});

// Global function for scroll to contact
window.scrollToContact = function() {
    if (window.app) {
        window.app.scrollToContact();
    }
};