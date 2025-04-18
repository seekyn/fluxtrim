document.addEventListener('DOMContentLoaded', function() {
    // 检测是否为移动设备
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // 如果是移动设备，重定向到移动版页面
    if (isMobile()) {
        window.location.href = 'mobile.html';
    }
}); 