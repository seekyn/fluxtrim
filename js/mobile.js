// 功能切换
const switchBtns = document.querySelectorAll('.switch-btn');
const functionPanels = document.querySelectorAll('.function-panel');

switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除所有active类
        switchBtns.forEach(b => b.classList.remove('active'));
        functionPanels.forEach(p => p.classList.remove('active'));
        
        // 添加active类到当前选中的功能
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.function}Panel`).classList.add('active');
    });
});

// 图片压缩功能
const mobileUploadArea = document.getElementById('mobileUploadArea');
const mobileImageInput = document.getElementById('mobileImageInput');
const mobilePreviewSection = document.getElementById('mobilePreviewSection');
const mobileOriginalImage = document.getElementById('mobileOriginalImage');
const mobileCompressedImage = document.getElementById('mobileCompressedImage');
const mobileOriginalSize = document.getElementById('mobileOriginalSize');
const mobileCompressedSize = document.getElementById('mobileCompressedSize');
const mobileQualitySlider = document.getElementById('mobileQualitySlider');
const mobileQualityValue = document.getElementById('mobileQualityValue');
const mobileDownloadBtn = document.getElementById('mobileDownloadBtn');

// 图片上传处理
mobileUploadArea.addEventListener('click', () => mobileImageInput.click());

mobileImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleMobileImage(file);
    }
});

// 处理图片压缩
function handleMobileImage(file) {
    mobileOriginalSize.textContent = formatFileSize(file.size);
    
    const reader = new FileReader();
    reader.onload = (e) => {
        mobileOriginalImage.src = e.target.result;
        compressMobileImage(e.target.result, mobileQualitySlider.value / 100);
    };
    reader.readAsDataURL(file);
    
    mobilePreviewSection.style.display = 'block';
}

function compressMobileImage(base64, quality) {
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        mobileCompressedImage.src = compressedBase64;
        
        const compressedSize = Math.round((compressedBase64.length * 3) / 4);
        mobileCompressedSize.textContent = formatFileSize(compressedSize);
        
        mobileDownloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = 'compressed-image.jpg';
            link.href = compressedBase64;
            link.click();
        };
    };
    img.src = base64;
}

// HEIC转换功能
const mobileHeicUploadArea = document.getElementById('mobileHeicUploadArea');
const mobileHeicInput = document.getElementById('mobileHeicInput');
const mobileHeicPreviewSection = document.getElementById('mobileHeicPreviewSection');
const mobileConvertedImage = document.getElementById('mobileConvertedImage');
const mobileConvertDownloadBtn = document.getElementById('mobileConvertDownloadBtn');

mobileHeicUploadArea.addEventListener('click', () => mobileHeicInput.click());

mobileHeicInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleMobileHeicImage(file);
    }
});

async function handleMobileHeicImage(file) {
    try {
        mobileConvertedImage.src = '';
        mobileHeicPreviewSection.style.display = 'block';
        
        const jpgBlob = await heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8
        });

        const url = URL.createObjectURL(jpgBlob);
        mobileConvertedImage.src = url;
        
        mobileConvertDownloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = file.name.replace('.heic', '.jpg');
            link.href = url;
            link.click();
        };
    } catch (error) {
        alert('转换失败，请确保上传的是有效的HEIC格式图片');
        console.error('HEIC转换错误:', error);
    }
}

// 工具函数
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 质量滑块控制
mobileQualitySlider.addEventListener('input', (e) => {
    const quality = e.target.value;
    mobileQualityValue.textContent = quality + '%';
    if (mobileOriginalImage.src) {
        compressMobileImage(mobileOriginalImage.src, quality / 100);
    }
}); 