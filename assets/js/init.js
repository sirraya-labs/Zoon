<!-- Initialize App -->
<script>
// Wait for everything to load
window.addEventListener('load', function() {
    // Create global app instance
    window.app = new ZoonApp();
    
    // Set up header CTA button
    const headerCta = document.getElementById('header-cta');
    if (headerCta) {
        headerCta.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.app && window.app.loadPage) {
                window.app.loadPage('contact');
                window.app.scrollToTop();
            }
        });
    }
    
    // Check if there's a hash in the URL and load that page
    const hash = window.location.hash.replace('#', '');
    if (hash && window.app && window.app.loadPage) {
        window.app.loadPage(hash);
    }
    
    // Initialize logo click
    const logo = document.querySelector('.logo-main');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.app && window.app.loadPage) {
                window.app.loadPage('home');
                window.app.scrollToTop();
            }
        });
    }
});

// Fallback for DOMContentLoaded in case load event doesn't fire
document.addEventListener('DOMContentLoaded', function() {
    // If app is already initialized, do nothing
    if (window.app) return;
    
    // Otherwise initialize after a short delay
    setTimeout(function() {
        if (!window.app) {
            window.app = new ZoonApp();
        }
    }, 100);
});
</script>