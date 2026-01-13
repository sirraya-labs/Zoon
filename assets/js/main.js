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
        
        if (loader && progressBar) {
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
    }

    hideLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 800);
        }
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
        const defaultNav = {
            desktop: [
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
            ]
        };
        
        this.renderNavigation(defaultNav);
        
        // Render default footer
        const footer = document.getElementById('main-footer');
        if (footer) {
            footer.innerHTML = `
                <div class="footer-content">
                    <div class="footer-brand">
                        <div class="footer-logo">Zoon.ai</div>
                        <p class="footer-tagline">Engineering the Intelligent Future with AI-first solutions</p>
                        <div class="social-links">
                            <a href="https://twitter.com" class="social-link" target="_blank">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="https://linkedin.com" class="social-link" target="_blank">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                            <a href="https://github.com" class="social-link" target="_blank">
                                <i class="fab fa-github"></i>
                            </a>
                            <a href="https://dribbble.com" class="social-link" target="_blank">
                                <i class="fab fa-dribbble"></i>
                            </a>
                        </div>
                    </div>
                    
                    <div class="footer-links">
                        <div class="footer-column">
                            <h4>Services</h4>
                            <ul>
                                <li><a href="#" data-page="ai-ml">AI & Machine Learning</a></li>
                                <li><a href="#" data-page="web-mobile">Web Development</a></li>
                                <li><a href="#" data-page="enterprise">Enterprise Solutions</a></li>
                                <li><a href="#" data-page="design">UX/UI Design</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-column">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="#" data-page="about">About Us</a></li>
                                <li><a href="#" data-page="case-studies">Case Studies</a></li>
                                <li><a href="#" data-page="contact">Contact</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-column">
                            <h4>Resources</h4>
                            <ul>
                                <li><a href="#" data-page="ai-stack">Tech Stack</a></li>
                                <li><a href="#" data-page="privacy">Privacy Policy</a></li>
                                <li><a href="#" data-page="terms">Terms of Service</a></li>
                                <li><a href="#" data-page="cookies">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <div class="copyright">
                    <p>&copy; ${new Date().getFullYear()} Zoon.ai. All rights reserved.</p>
                    <p style="margin-top: 10px; font-size: 13px;">
                        <a href="#" data-page="privacy" style="color: var(--text-muted); margin-right: 20px;">Privacy Policy</a>
                        <a href="#" data-page="terms" style="color: var(--text-muted); margin-right: 20px;">Terms of Service</a>
                        <a href="#" data-page="cookies" style="color: var(--text-muted); margin-right: 20px;">Cookie Policy</a>
                    </p>
                    <p style="margin-top: 10px; font-size: 12px;">Engineered with ❤️ and advanced AI</p>
                </div>
            `;
        }
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
                    if (mobileToggle) mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
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
            const elements = mainContent.querySelectorAll('.service-card, .process-step, .ai-visual, .contact-container, .service-hero');
            elements.forEach(el => {
                el.classList.add('fade-in');
            });
        }, 100);
    }

    renderHomePage(data) {
        return `
            <!-- Hero Section -->
            <section class="hero" id="home">
                <div class="page-container">
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
                </div>
            </section>
            
            <!-- Stats Section -->
            <section class="stats">
                <div class="page-container">
                    <div class="stats-container">
                        ${(data.stats || []).map(stat => `
                            <div class="stat-item">
                                <div class="stat-number">${stat.value || '0'}</div>
                                <div class="stat-label">${stat.label || 'Statistic'}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
            
            <!-- Services Section -->
            <section class="services" id="services">
                <div class="page-container">
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
                </div>
            </section>
            
            <!-- AI Showcase Section -->
            <section class="ai-showcase" id="technologies">
                <div class="page-container">
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
                </div>
            </section>
            
            <!-- Process Section -->
            <section class="process" id="process">
                <div class="page-container">
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
                </div>
            </section>
            
            <!-- Contact Section -->
            <section class="contact" id="contact">
                <div class="page-container">
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
                </div>
            </section>
        `;
    }

    renderServicePage(data) {
        return `
            <section class="service-hero">
                <div class="page-container">
                    <div class="service-hero-content">
                        <div class="service-hero-badge" style="${data.badgeStyle || ''}">
                            <i class="${data.icon || 'fas fa-cube'}"></i> ${data.category || 'Service'}
                        </div>
                        <h1 class="service-hero-title" style="${data.titleStyle || ''}">${data.title || 'Service Title'}</h1>
                        <p class="service-hero-subtitle">${data.subtitle || 'Service description'}</p>
                    </div>
                </div>
            </section>
            
            <section class="capabilities">
                <div class="page-container">
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
                </div>
            </section>
            
            <section class="workflow">
                <div class="page-container">
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
                </div>
            </section>
            
            <section style="padding: 100px 0; text-align: center;">
                <div class="page-container">
                    <h2 style="font-size: 2.5rem; margin-bottom: 30px;">Ready to Get Started?</h2>
                    <button class="cta-button" data-page="contact">
                        <i class="fas fa-calendar"></i> Schedule Consultation
                    </button>
                </div>
            </section>
        `;
    }

    renderTechPage(data) {
        return `
            <section class="service-hero">
                <div class="page-container">
                    <div class="service-hero-content">
                        <div class="service-hero-badge">
                            <i class="fas fa-microchip"></i> ${data.category || 'Technology'}
                        </div>
                        <h1 class="service-hero-title">${data.title || 'Technology Stack'}</h1>
                        <p class="service-hero-subtitle">${data.subtitle || 'Our technology expertise'}</p>
                    </div>
                </div>
            </section>
            
            <section class="capabilities">
                <div class="page-container">
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
                </div>
            </section>
        `;
    }

    renderCaseStudiesPage(data) {
        return `
            <section class="service-hero">
                <div class="page-container">
                    <div class="service-hero-content">
                        <div class="service-hero-badge">
                            <i class="fas fa-chart-line"></i> Case Studies
                        </div>
                        <h1 class="service-hero-title">${data.title || 'Case Studies'}</h1>
                        <p class="service-hero-subtitle">${data.subtitle || 'Real-world results'}</p>
                    </div>
                </div>
            </section>
            
            <div class="page-container">
                <div class="services-grid" style="padding: 80px 0;">
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
            </div>
        `;
    }

    renderAboutPage(data) {
        return `
            <section class="service-hero">
                <div class="page-container">
                    <div class="service-hero-content">
                        <div class="service-hero-badge">
                            <i class="fas fa-users"></i> About Us
                        </div>
                        <h1 class="service-hero-title">${data.title || 'About Zoon.ai'}</h1>
                        <p class="service-hero-subtitle">${data.subtitle || 'Our story and mission'}</p>
                    </div>
                </div>
            </section>
            
            <section style="padding: 100px 0;">
                <div class="page-container">
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
                </div>
            </section>
            
            <section style="padding: 100px 0; background: rgba(0, 0, 0, 0.3);">
                <div class="page-container">
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
                <div class="page-container">
                    <div class="service-hero-content">
                        <div class="service-hero-badge">
                            <i class="${data.icon || 'fas fa-file'}"></i> ${data.category || 'Page'}
                        </div>
                        <h1 class="service-hero-title">${data.title || 'Page Title'}</h1>
                        <p class="service-hero-subtitle">${data.subtitle || 'Page description'}</p>
                    </div>
                </div>
            </section>
            
            <section class="page-content" style="padding: 80px 0;">
                <div class="page-container">
                    ${(data.content || []).map(section => `
                        <div class="content-section" style="margin-bottom: 60px;">
                            ${section.title ? `<h2 style="color: var(--accent-cyan); margin-bottom: 20px; font-size: 1.8rem;">${section.title}</h2>` : ''}
                            ${section.text ? `<p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 20px; font-size: 1.1rem;">${section.text}</p>` : ''}
                            
                            ${section.features ? `
                                <ul style="color: var(--text-secondary); margin: 20px 0; padding-left: 20px;">
                                    ${section.features.map(feature => `<li style="margin-bottom: 10px;">${feature}</li>`).join('')}
                                </ul>
                            ` : ''}
                            
                            ${section.cta ? `
                                <div style="margin-top: 30px;">
                                    <button class="cta-button" data-page="${section.cta.page || 'contact'}">
                                        <i class="${section.cta.icon || 'fas fa-rocket'}"></i> ${section.cta.text || 'Learn More'}
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    showErrorPage(pageName) {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;
        
        mainContent.innerHTML = `
            <section class="error-page" style="min-height: 70vh; display: flex; align-items: center; justify-content: center;">
                <div class="page-container" style="text-align: center;">
                    <div class="error-icon" style="font-size: 4rem; color: var(--accent-red); margin-bottom: 30px;">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h1 style="font-size: 3rem; margin-bottom: 20px; color: var(--text-primary);">Page Not Found</h1>
                    <p style="color: var(--text-secondary); font-size: 1.2rem; margin-bottom: 40px;">
                        Sorry, we couldn't load the "${pageName}" page. It may be temporarily unavailable.
                    </p>
                    <div style="display: flex; gap: 20px; justify-content: center;">
                        <button class="cta-button" onclick="app.loadPage('home')">
                            <i class="fas fa-home"></i> Return Home
                        </button>
                        <button class="secondary-button" onclick="app.loadPage('contact')">
                            <i class="fas fa-headset"></i> Contact Support
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    initPageScripts(pageName) {
        // Initialize page-specific functionality
        switch(pageName) {
            case 'home':
                this.initHomePage();
                break;
            case 'contact':
                this.initContactPage();
                break;
            case 'ai-ml':
            case 'web-mobile':
            case 'enterprise':
            case 'design':
                this.initServicePage(pageName);
                break;
            default:
                this.initGenericPage();
        }
    }

    initHomePage() {
        // Initialize neural network animation
        this.initNeuralNetwork();
        
        // Initialize form submission
        const form = document.getElementById('project-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        }
        
        // Initialize stats counter animation
        this.animateStats();
        
        // Initialize particle animation
        this.startParticles();
    }

    initContactPage() {
        const form = document.getElementById('project-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        }
    }

    initServicePage(serviceName) {
        // Service page specific initialization
        console.log(`Initializing ${serviceName} page`);
        
        // Add service-specific animations or interactions
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

    initGenericPage() {
        // Generic page initialization
        console.log('Initializing generic page');
    }

    handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // In a real application, you would send this to your backend
            console.log('Form submitted:', data);
            
            // Show success message
            this.showNotification('Form submitted successfully! We will contact you soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
        
        // Close button handler
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }

    initBackground() {
        // Initialize the animated background
        const background = document.querySelector('.animated-background');
        if (!background) return;
        
        // Create gradient animation
        background.style.background = `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 119, 119, 0.3) 0%, transparent 50%)
        `;
        
        // Add animation
        background.style.animation = 'gradientMove 15s ease infinite';
        
        // Add CSS for animation
        if (!document.querySelector('#background-animation')) {
            const style = document.createElement('style');
            style.id = 'background-animation';
            style.textContent = `
                @keyframes gradientMove {
                    0% {
                        background-position: 0% 0%;
                    }
                    50% {
                        background-position: 100% 100%;
                    }
                    100% {
                        background-position: 0% 0%;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position and size
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random color
            const colors = ['rgba(255, 119, 119, 0.5)', 'rgba(120, 119, 198, 0.5)', 'rgba(100, 220, 255, 0.5)'];
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random animation
            particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            particlesContainer.appendChild(particle);
        }
    }

    startParticles() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
    }

    initNeuralNetwork() {
        const canvas = document.getElementById('neuralCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        let nodes = [];
        let connections = [];
        
        // Create nodes
        for (let i = 0; i < 15; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 2,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
        
        // Create connections
        nodes.forEach((node, i) => {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = Math.sqrt(
                    Math.pow(node.x - nodes[j].x, 2) + 
                    Math.pow(node.y - nodes[j].y, 2)
                );
                if (distance < 150) {
                    connections.push({
                        node1: i,
                        node2: j,
                        opacity: 0.3
                    });
                }
            }
        });
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw nodes
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                
                // Bounce off walls
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
                
                // Draw node
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(100, 220, 255, 0.8)';
                ctx.fill();
            });
            
            // Draw connections
            connections.forEach(conn => {
                const node1 = nodes[conn.node1];
                const node2 = nodes[conn.node2];
                
                const distance = Math.sqrt(
                    Math.pow(node1.x - node2.x, 2) + 
                    Math.pow(node1.y - node2.y, 2)
                );
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(node1.x, node1.y);
                    ctx.lineTo(node2.x, node2.y);
                    ctx.strokeStyle = `rgba(100, 220, 255, ${0.3 * (1 - distance/150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        });
    }

    animateStats() {
        const statElements = document.querySelectorAll('.stat-number');
        statElements.forEach(element => {
            const target = parseInt(element.textContent);
            let current = 0;
            const increment = target / 100;
            const interval = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                element.textContent = Math.round(current);
            }, 20);
        });
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ZoonApp();
});

// Add CSS for notifications
const notificationCSS = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-card);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 15px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        transform: translateX(100%);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        z-index: 1000;
        backdrop-filter: blur(10px);
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-success {
        border-left: 4px solid var(--accent-cyan);
    }
    
    .notification-error {
        border-left: 4px solid var(--accent-red);
    }
    
    .notification-info {
        border-left: 4px solid var(--accent-purple);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--text-primary);
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 1rem;
        padding: 0;
        margin-left: 10px;
    }
    
    .notification-close:hover {
        color: var(--text-primary);
    }
    
    /* Particles animation */
    .particle {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        animation: float linear infinite;
        animation-play-state: paused;
    }
    
    @keyframes float {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(100px);
            opacity: 0;
        }
    }
`;

// Add styles to document
if (!document.querySelector('#notification-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'notification-styles';
    styleSheet.textContent = notificationCSS;
    document.head.appendChild(styleSheet);
}