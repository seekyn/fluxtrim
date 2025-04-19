document.addEventListener('DOMContentLoaded', function() {
    // Detect if user is on a mobile device
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // If on a mobile device, redirect to the mobile version
    if (isMobile()) {
        window.location.href = 'mobile.html';
    }
}); 