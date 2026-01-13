// Main Application Class
class ZoonApp {
    constructor() {
        this.currentPage = 'home';
        this.pages = {};
        this.isMobile = window.innerWidth < 992;
        this.init();
    }

    async init() {
        // Show loading animation
        this.showLoader();
        
        // Load navigation data
        await this.loadNavigation();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize visual effects
        this.initBackground();
        this.createParticles();
        
        // Load home page
        await this.loadPage('home');
        
        // Hide loader
        this.hideLoader();
    }

    showLoader() {
        const loader = document.getElementById('page-loader');
        const progressBar = document.getElementById('loader-progress');
        
        loader.classList.remove('hidden');
        loader.style.display = 'flex';
        
        // Simulate loading progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress > 100) progress = 100;
            progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 100);
    }

    hideLoader() {
        const loader = document.getElementById('page-loader');
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 800);
    }

    async loadNavigation() {
        try {
            const response = await fetch('data/pages.json');
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
        
        // Clear existing
        desktopNav.innerHTML = '';
        mobileNav.innerHTML = '';
        
        // Render desktop navigation
        navData.desktop.forEach(item => {
            if (item.type === 'link') {
                const link = this.createNavLink(item);
                desktopNav.innerHTML += link;
                mobileNav.innerHTML += this.createMobileNavLink(item);
            } else if (item.type === 'dropdown') {
                desktopNav.innerHTML += this.createDropdown(item);
                mobileNav.innerHTML += this.createMobileDropdown(item);
            }
        });
        
        // Add CTA to mobile nav
        mobileNav.innerHTML += `
            <button class="cta-button" style="margin-top: 30px; width: 100%;" data-page="contact">
                <i class="fas fa-rocket"></i> Start Project
            </button>
        `;
    }

    createNavLink(item) {
        return `
            <a href="#" class="nav-link" data-page="${item.page}">
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
                        <a href="#" data-page="${subItem.page}">
                            <i class="${subItem.icon}"></i> ${subItem.text}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    createMobileNavLink(item) {
        return this.createNavLink(item);
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
                        <a href="#" data-page="${subItem.page}">
                            <i class="${subItem.icon}"></i> ${subItem.text}
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderFooter(footerData) {
        const footer = document.getElementById('main-footer');
        if (!footer || !footerData) return;
        
        footer.innerHTML = `
            <div class="footer-content">
                <div class="footer-brand">
                    <div class="footer-logo">Zoon.ai</div>
                    <p class="footer-tagline">${footerData.tagline || 'Engineering Intelligent Solutions'}</p>
                    <div class="social-links">
                        ${(footerData.social || []).map(social => `
                            <a href="${social.url}" class="social-link" target="_blank">
                                <i class="${social.icon}"></i>
                            </a>
                        `).join('')}
                    </div>
                </div>
                
                <div class="footer-links">
                    ${(footerData.columns || []).map(column => `
                        <div class="footer-column">
                            <h4>${column.title}</h4>
                            <ul>
                                ${(column.links || []).map(link => `
                                    <li><a href="#" data-page="${link.page}">${link.text}</a></li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="copyright">
                <p>&copy; ${new Date().getFullYear()} ${footerData.copyright || 'Zoon.ai. All rights reserved.'}</p>
                ${footerData.legal ? `
                <p style="margin-top: 10px; font-size: 13px;">
                    ${footerData.legal.map(link => `
                        <a href="#" data-page="${link.page}" style="color: var(--text-muted); margin-right: 20px;">${link.text}</a>
                    `).join('')}
                </p>
                ` : ''}
                <p style="margin-top: 10px; font-size: 12px;">${footerData.footerNote || 'Engineered with advanced AI'}</p>
            </div>
        `;
    }

    renderDefaultNavigation() {
        const defaultNav = [
            {
                type: 'link',
                text: 'Home',
                icon: 'fas fa-home',
                page: 'home'
            },
            {
                type: 'dropdown',
                text: 'Services',
                icon: 'fas fa-cube',
                items: [
                    {
                        text: 'AI & Machine Learning',
                        icon: 'fas fa-brain',
                        page: 'ai-ml'
                    },
                    {
                        text: 'Modern Web & Mobile',
                        icon: 'fas fa-code',
                        page: 'web-mobile'
                    },
                    {
                        text: 'Enterprise Solutions',
                        icon: 'fas fa-server',
                        page: 'enterprise'
                    },
                    {
                        text: 'Creative & UX Design',
                        icon: 'fas fa-paint-brush',
                        page: 'design'
                    }
                ]
            },
            {
                type: 'dropdown',
                text: 'Technologies',
                icon: 'fas fa-microchip',
                items: [
                    {
                        text: 'AI/ML Stack',
                        icon: 'fas fa-robot',
                        page: 'ai-stack'
                    },
                    {
                        text: 'Web Stack',
                        icon: 'fas fa-globe',
                        page: 'web-stack'
                    },
                    {
                        text: 'Cloud & Data',
                        icon: 'fas fa-cloud',
                        page: 'cloud-stack'
                    }
                ]
            },
            {
                type: 'link',
                text: 'Case Studies',
                icon: 'fas fa-chart-line',
                page: 'case-studies'
            },
            {
                type: 'link',
                text: 'About',
                icon: 'fas fa-users',
                page: 'about'
            },
            {
                type: 'link',
                text: 'Contact',
                icon: 'fas fa-envelope',
                page: 'contact'
            }
        ];
        
        this.renderNavigation({ desktop: defaultNav });
        this.renderFooter({
            tagline: 'Engineering the Intelligent Future with AI-first solutions',
            social: [
                { icon: 'fab fa-twitter', url: 'https://twitter.com' },
                { icon: 'fab fa-linkedin-in', url: 'https://linkedin.com' },
                { icon: 'fab fa-github', url: 'https://github.com' },
                { icon: 'fab fa-dribbble', url: 'https://dribbble.com' }
            ],
            columns: [
                {
                    title: 'Services',
                    links: [
                        { text: 'AI & Machine Learning', page: 'ai-ml' },
                        { text: 'Web Development', page: 'web-mobile' },
                        { text: 'Enterprise Solutions', page: 'enterprise' },
                        { text: 'UX/UI Design', page: 'design' }
                    ]
                },
                {
                    title: 'Company',
                    links: [
                        { text: 'About Us', page: 'about' },
                        { text: 'Case Studies', page: 'case-studies' },
                        { text: 'Contact', page: 'contact' }
                    ]
                },
                {
                    title: 'Resources',
                    links: [
                        { text: 'AI Glossary', page: 'glossary' },
                        { text: 'Tech Stack', page: 'ai-stack' },
                        { text: 'Support', page: 'support' }
                    ]
                }
            ],
            copyright: 'Zoon.ai. All rights reserved.',
            legal: [
                { text: 'Privacy Policy', page: 'privacy' },
                { text: 'Terms of Service', page: 'terms' },
                { text: 'Cookie Policy', page: 'cookies' }
            ],
            footerNote: 'Engineered with ❤️ and advanced AI'
        });
    }

    setupEventListeners() {
        // Mobile navigation toggle
        const mobileToggle = document.getElementById('mobile-toggle');
        const mobileNav = document.getElementById('mobile-nav');
        
        if (mobileToggle && mobileNav) {
            mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileNav.classList.toggle('active');
                mobileToggle.innerHTML = mobileNav.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
        }
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (mobileNav && mobileToggle && 
                !mobileNav.contains(e.target) && 
                !mobileToggle.contains(e.target) && 
                mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Navigation click handler
        document.addEventListener('click', (e) => {
            // Handle nav links
            const navLink = e.target.closest('a[data-page], button[data-page]');
            if (navLink && navLink.dataset.page) {
                e.preventDefault();
                const page = navLink.dataset.page;
                this.loadPage(page);
                this.scrollToTop();
                
                // Close mobile nav if open
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
            
            // Handle logo click
            if (e.target.closest('.logo-main')) {
                e.preventDefault();
                this.loadPage('home');
                this.scrollToTop();
            }
        });
        
        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.getElementById('main-header');
            if (header) {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 992;
        });
        
        // Handle browser back/forward
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.page) {
                this.loadPage(event.state.page);
            }
        });
    }

    async loadPage(pageName) {
        this.currentPage = pageName;
        
        // Update active nav link
        this.updateActiveNav(pageName);
        
        // Show loading state
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div style="text-align: center; padding: 100px 20px;">
                    <div class="loader-logo" style="font-size: 2rem; margin-bottom: 20px;">Loading...</div>
                    <div class="loader-bar" style="width: 200px;">
                        <div class="loader-progress"></div>
                    </div>
                </div>
            `;
        }
        
        try {
            // Load page content from JSON
            const response = await fetch(`data/${pageName}.json`);
            const pageData = await response.json();
            
            // Render the page
            this.renderPage(pageData, pageName);
            
            // Update browser history
            history.pushState({ page: pageName }, '', `#${pageName}`);
            
            // Initialize page-specific functionality
            this.initPageScripts(pageName);
            
        } catch (error) {
            console.error(`Error loading page ${pageName}:`, error);
            this.showErrorPage(pageName);
        }
    }

    updateActiveNav(pageName) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page link
        document.querySelectorAll(`[data-page="${pageName}"]`).forEach(link => {
            link.classList.add('active');
        });
    }

    renderPage(pageData, pageName) {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;
        
        let html = '';
        
        // Determine which template to use based on page type
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
        
        // Add fade-in animation
        setTimeout(() => {
            const elements = mainContent.querySelectorAll('.service-card, .process-step, .ai-visual, .contact-container');
            elements.forEach(el => {
                el.classList.add('fade-in');
            });
        }, 100);
    }

    renderHomePage(data) {
        return `
            <!-- Hero Section -->
            <section class="hero" id="home">
                <div class="hero-content">
                    <div class="hero-badge">
                        <i class="fas fa-bolt"></i> ${data.hero.badge || 'AI-First Software Engineering'}
                    </div>
                    <h1 class="hero-title">${data.hero.title || 'Intelligent Systems for the Next Era of Business'}</h1>
                    <p class="hero-subtitle">${data.hero.subtitle || 'Transforming businesses with cutting-edge AI solutions'}</p>
                    
                    <div class="hero-cta-container">
                        <button class="cta-button" data-page="contact">
                            <i class="fas fa-rocket"></i> Start AI Project
                        </button>
                        <button class="secondary-button" data-page="case-studies">
                            <i class="fas fa-eye"></i> View Case Studies
                        </button>
                        <button class="secondary-button" data-page="about">
                            <i class="fas fa-play-circle"></i> Watch Demo
                        </button>
                    </div>
                </div>
            </section>
            
            <!-- Stats Section -->
            <section class="stats">
                ${(data.stats || []).map(stat => `
                    <div class="stat-item">
                        <div class="stat-number">${stat.value || '0'}</div>
                        <div class="stat-label">${stat.label || 'Statistic'}</div>
                    </div>
                `).join('')}
            </section>
            
            <!-- Services Section -->
            <section class="services" id="services">
                <div class="section-header">
                    <h2 class="section-title">${data.services?.title || 'Our Core Service Pillars'}</h2>
                    <p class="section-subtitle">${data.services?.subtitle || 'Specialized expertise across multiple domains'}</p>
                </div>
                
                <div class="services-grid">
                    ${(data.services?.items || []).map(service => `
                        <div class="service-card" id="${service.id || ''}">
                            <div class="service-icon ${service.iconClass || ''}">
                                <i class="${service.icon || 'fas fa-cube'}"></i>
                            </div>
                            <h3 class="service-title">${service.title || 'Service'}</h3>
                            <p class="service-description">${service.description || 'Description'}</p>
                            <ul class="service-features">
                                ${(service.features || []).map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                            <a href="#" class="service-link" data-page="${service.page || 'home'}">
                                ${service.linkText || 'Learn More'} <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <!-- AI Showcase Section -->
            <section class="ai-showcase" id="technologies">
                <div class="section-header">
                    <h2 class="section-title">${data.showcase?.title || 'The Zoon.ai Advantage'}</h2>
                    <p class="section-subtitle">${data.showcase?.subtitle || 'Cutting-edge AI solutions'}</p>
                </div>
                
                <div class="ai-showcase-content">
                    <div class="ai-visual">
                        <canvas id="neuralCanvas" class="neural-network"></canvas>
                    </div>
                    
                    <div class="ai-details">
                        <h3>${data.showcase?.details?.title || 'Specialized AI Development'}</h3>
                        ${(data.showcase?.details?.paragraphs || []).map(p => `<p>${p}</p>`).join('')}
                        
                        <h4 style="margin-top: 40px; color: var(--accent-cyan);">Core AI Technologies</h4>
                        <div class="tech-stack">
                            ${(data.showcase?.technologies || []).map(tech => `
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
                    <h2 class="section-title">${data.process?.title || 'Our Process'}</h2>
                    <p class="section-subtitle">${data.process?.subtitle || 'How we deliver results'}</p>
                </div>
                
                <div class="process-steps">
                    ${(data.process?.steps || []).map(step => `
                        <div class="process-step">
                            <div class="step-number">${step.number || '01'}</div>
                            <h3 class="step-title">${step.title || 'Step'}</h3>
                            <p class="step-description">${step.description || 'Description'}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <!-- Contact Section -->
            <section class="contact" id="contact">
                <div class="section-header">
                    <h2 class="section-title">${data.contact?.title || 'Ready to Build Intelligence?'}</h2>
                    <p class="section-subtitle">${data.contact?.subtitle || 'Start your AI journey today'}</p>
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
                        
                        ${(data.contact?.methods || []).map(method => `
                            <div class="contact-method">
                                <div class="contact-icon">
                                    <i class="${method.icon || 'fas fa-envelope'}"></i>
                                </div>
                                <div class="contact-details">
                                    <h4>${method.title || 'Contact Method'}</h4>
                                    ${(method.details || []).map(detail => `<p>${detail}</p>`).join('')}
                                    ${method.button ? `
                                        <button class="secondary-button" style="margin-top: 15px;">
                                            <i class="${method.button.icon || 'fas fa-calendar'}"></i> ${method.button.text || 'Learn More'}
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
                    <div class="service-hero-badge" style="${data.badgeStyle || ''}">
                        <i class="${data.icon || 'fas fa-cube'}"></i> ${data.category || 'Service'}
                    </div>
                    <h1 class="service-hero-title" style="${data.titleStyle || ''}">${data.title || 'Service Title'}</h1>
                    <p class="service-hero-subtitle">${data.subtitle || 'Service description'}</p>
                </div>
            </section>
            
            <section class="capabilities">
                <h2 class="section-title">${data.capabilities?.title || 'Capabilities'}</h2>
                
                <div class="services-grid">
                    ${(data.capabilities?.items || []).map(capability => `
                        <div class="service-card">
                            <div class="service-icon" style="${capability.iconStyle || ''}">
                                <i class="${capability.icon || 'fas fa-cog'}"></i>
                            </div>
                            <h3 class="service-title">${capability.title || 'Capability'}</h3>
                            <p class="service-description">${capability.description || 'Description'}</p>
                            <ul class="service-features">
                                ${(capability.features || []).map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <section class="workflow">
                <h2 class="section-title">${data.workflow?.title || 'Our Process'}</h2>
                
                <div class="process-steps">
                    ${(data.workflow?.steps || []).map(step => `
                        <div class="process-step">
                            <div class="step-number">${step.number || '1'}</div>
                            <h3 class="step-title">${step.title || 'Step'}</h3>
                            <p class="step-description">${step.description || 'Description'}</p>
                        </div>
                    `).join('')}
                </div>
            </section>
            
            <section style="padding: 100px 5%; text-align: center;">
                <h2 style="font-size: 2.5rem; margin-bottom: 30px;">Ready to Get Started?</h2>
                <button class="cta-button" data-page="contact">
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
                        <i class="fas fa-microchip"></i> ${data.category || 'Technology'}
                    </div>
                    <h1 class="service-hero-title">${data.title || 'Technology Stack'}</h1>
                    <p class="service-hero-subtitle">${data.subtitle || 'Our technology expertise'}</p>
                </div>
            </section>
            
            <section class="capabilities">
                <h2 class="section-title">${data.sections?.title || 'Technologies'}</h2>
                
                <div class="services-grid">
                    ${(data.sections?.items || []).map(section => `
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="${section.icon || 'fas fa-cog'}"></i>
                            </div>
                            <h3 class="service-title">${section.title || 'Category'}</h3>
                            <ul class="service-features">
                                ${(section.items || []).map(item => `
                                    <li><strong>${item.name || 'Tool'}</strong> - ${item.description || 'Description'}</li>
                                `).join('')}
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
                    <h1 class="service-hero-title">${data.title || 'Case Studies'}</h1>
                    <p class="service-hero-subtitle">${data.subtitle || 'Real-world results'}</p>
                </div>
            </section>
            
            <div class="services-grid" style="padding: 80px 5%; max-width: 1400px; margin: 0 auto;">
                ${(data.cases || []).map(caseStudy => `
                    <div class="service-card">
                        <div class="service-icon" style="background: ${caseStudy.color || 'var(--gradient-card)'}">
                            <i class="${caseStudy.icon || 'fas fa-chart-bar'}"></i>
                        </div>
                        <span class="service-hero-badge" style="display: inline-block; margin-bottom: 20px;">
                            ${caseStudy.industry || 'Industry'}
                        </span>
                        <h3 class="service-title">${caseStudy.title || 'Case Study'}</h3>
                        <p class="service-description">${caseStudy.description || 'Description'}</p>
                        
                        <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px; margin-top: 20px;">
                            ${(caseStudy.results || []).map(result => `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                                    <span style="color: var(--text-secondary);">${result.label || 'Metric'}</span>
                                    <span style="color: var(--accent-cyan); font-weight: 600;">${result.value || 'Value'}</span>
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
                    <h1 class="service-hero-title">${data.title || 'About Zoon.ai'}</h1>
                    <p class="service-hero-subtitle">${data.subtitle || 'Our story and mission'}</p>
                </div>
            </section>
            
            <section style="padding: 100px 5%; max-width: 1200px; margin: 0 auto;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center;">
                    <div>
                        <h2 style="font-size: 2.5rem; margin-bottom: 30px; color: var(--accent-cyan);">Our Mission</h2>
                        ${(data.mission || []).map(p => `
                            <p style="color: var(--text-secondary); font-size: 1.2rem; line-height: 1.8; margin-bottom: 30px;">${p}</p>
                        `).join('')}
                    </div>
                    <div style="background: var(--gradient-card); padding: 50px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1);">
                        <h3 style="font-size: 1.8rem; margin-bottom: 30px; color: var(--text-primary);">Our Values</h3>
                        ${(data.values || []).map(value => `
                            <div style="margin-bottom: 25px;">
                                <h4 style="color: var(--accent-cyan); margin-bottom: 10px;">${value.title || 'Value'}</h4>
                                <p style="color: var(--text-secondary);">${value.description || 'Description'}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
            
            <section style="padding: 100px 5%; background: rgba(0, 0, 0, 0.3);">
                <div style="max-width: 1200px; margin: 0 auto;">
                    <h2 style="font-size: 2.5rem; text-align: center; margin-bottom: 60px;">Our Team</h2>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px;">
                        ${(data.team || []).map(member => `
                            <div style="text-align: center;">
                                <div style="width: 150px; height: 150px; background: var(--gradient-cyber); border-radius: 50%; margin: 0 auto 20px;"></div>
                                <h3 style="color: var(--text-primary); margin-bottom: 10px;">${member.name || 'Team Member'}</h3>
                                <p style="color: var(--accent-cyan); margin-bottom: 15px;">${member.role || 'Role'}</p>
                                <p style="color: var(--text-secondary);">${member.bio || 'Bio'}</p>
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
                        <i class="${data.icon || 'fas fa-file'}"></i> ${data.category || 'Page'}
                    </div>
                    <h1 class="service-hero-title">${data.title || 'Page Title'}</h1>
                    <p class="service-hero-subtitle">${data.subtitle || 'Page subtitle'}</p>
                </div>
            </section>
            
            <section style="padding: 100px 5%; max-width: 800px; margin: 0 auto;">
                ${(data.content || []).map(section => `
                    <div style="margin-bottom: 60px;">
                        <h2 style="font-size: 2rem; margin-bottom: 20px; color: var(--accent-cyan);">${section.title || 'Section'}</h2>
                        ${(section.paragraphs || []).map(p => `
                            <p style="color: var(--text-secondary); margin-bottom: 20px; line-height: 1.7;">${p}</p>
                        `).join('')}
                    </div>
                `).join('')}
            </section>
        `;
    }

    showErrorPage(pageName) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <section class="service-hero">
                    <div class="service-hero-content">
                        <div class="service-hero-badge">
                            <i class="fas fa-exclamation-triangle"></i> Error
                        </div>
                        <h1 class="service-hero-title">Page Not Found</h1>
                        <p class="service-hero-subtitle">The page "${pageName}" could not be loaded.</p>
                    </div>
                </section>
                
                <section style="padding: 100px 5%; text-align: center;">
                    <p style="color: var(--text-secondary); margin-bottom: 30px; font-size: 1.2rem;">
                        Please try again or return to the home page.
                    </p>
                    <button class="cta-button" data-page="home">
                        <i class="fas fa-home"></i> Return Home
                    </button>
                </section>
            `;
        }
    }

    initPageScripts(pageName) {
        // Initialize form submission
        const form = document.getElementById('project-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
        
        // Initialize neural network for home page
        if (pageName === 'home') {
            this.initNeuralNetwork();
            this.animateStats();
        }
        
        // Initialize service page animations
        if (['ai-ml', 'web-mobile', 'enterprise', 'design'].includes(pageName)) {
            this.initServiceAnimations();
        }
    }

    initNeuralNetwork() {
        const canvas = document.getElementById('neuralCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        function setCanvasDimensions() {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            }
        }
        
        setCanvasDimensions();
        window.addEventListener('resize', setCanvasDimensions);
        
        // Simple neural network animation
        let time = 0;
        function animate() {
            if (!ctx) return;
            
            // Clear with fade effect
            ctx.fillStyle = 'rgba(10, 10, 25, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            time += 0.01;
            
            // Draw connections
            ctx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
            ctx.lineWidth = 1;
            
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    const x1 = (i + 1) * canvas.width / 6;
                    const y1 = (Math.sin(time + i) * 0.5 + 0.5) * canvas.height;
                    const x2 = (j + 1) * canvas.width / 6;
                    const y2 = (Math.sin(time + j + 1) * 0.5 + 0.5) * canvas.height;
                    
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                    
                    // Draw nodes
                    ctx.fillStyle = 'rgba(0, 243, 255, 0.6)';
                    ctx.beginPath();
                    ctx.arc(x1, y1, 5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = 'rgba(157, 78, 221, 0.6)';
                    ctx.beginPath();
                    ctx.arc(x2, y2, 5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (!statNumbers.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const text = stat.textContent;
                    const targetValue = parseFloat(text);
                    const isPercentage = text.includes('%');
                    const hasPlus = text.includes('+');
                    
                    let current = 0;
                    const increment = targetValue / 50;
                    
                    const update = () => {
                        if (current < targetValue) {
                            current += increment;
                            stat.textContent = 
                                (isPercentage ? current.toFixed(1) : Math.ceil(current)) +
                                (isPercentage ? '%' : '') +
                                (hasPlus && !isPercentage ? '+' : '');
                            setTimeout(update, 20);
                        } else {
                            stat.textContent = 
                                targetValue +
                                (isPercentage ? '%' : '') +
                                (hasPlus && !isPercentage ? '+' : '');
                        }
                    };
                    
                    update();
                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }

    initServiceAnimations() {
        // Add hover effects to service cards
        const cards = document.querySelectorAll('.service-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('name')?.value || 'Guest';
        const service = document.getElementById('service')?.value;
        
        // Show success message
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
            <p style="color: var(--text-secondary); margin-bottom: 30px;">
                Thank you ${name}! Your ${service ? service + ' ' : ''}project request has been submitted. 
                Our AI specialists will contact you within 24 hours.
            </p>
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

    initBackground() {
        // Initialize Vanta.js background
        if (typeof VANTA !== 'undefined') {
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
                points: 15.00,
                maxDistance: 25.00,
                spacing: 18.00
            });
        }
    }

    createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 3 + 1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}%;
                top: ${y}%;
                background: ${Math.random() > 0.5 ? 'var(--accent-cyan)' : 'var(--accent-magenta)'};
                opacity: ${Math.random() * 0.3 + 0.1};
                animation: float ${duration}s infinite ${delay}s ease-in-out;
            `;
            
            container.appendChild(particle);
        }
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}