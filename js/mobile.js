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
const mobilePreviewContainer = document.getElementById('mobilePreviewContainer');
const mobileOriginalImage = document.getElementById('mobileOriginalImage');
const mobileOriginalSize = document.getElementById('mobileOriginalSize');
const mobileOriginalDimensions = document.getElementById('mobileOriginalDimensions');
const mobileQualitySlider = document.getElementById('mobileQualitySlider');
const mobileQualityValue = document.getElementById('mobileQualityValue');
const mobileFileType = document.getElementById('mobileFileType');
const mobileProcessBtn = document.getElementById('mobileProcessBtn');
const mobileResultContainer = document.getElementById('mobileResultContainer');
const mobileCompressedImage = document.getElementById('mobileCompressedImage');
const mobileCompressedSize = document.getElementById('mobileCompressedSize');
const mobileCompressedDimensions = document.getElementById('mobileCompressedDimensions');
const mobileSizeReduction = document.getElementById('mobileSizeReduction');
const mobileDownloadBtn = document.getElementById('mobileDownloadBtn');

// 图片上传处理
mobileUploadArea.addEventListener('click', () => mobileImageInput.click());

mobileImageInput.addEventListener('change', handleImageSelect);

// 处理图片压缩
function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        currentOriginalFile = file;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            // Display original image
            mobileOriginalImage.src = event.target.result;
            mobileOriginalSize.textContent = formatFileSize(file.size);
            
            // Load image to get dimensions
            const img = new Image();
            img.onload = function() {
                currentOriginalImage = img;
                mobileOriginalDimensions.textContent = `${img.width} x ${img.height}`;
            };
            img.src = event.target.result;
            
            // Show preview and hide result
            mobilePreviewContainer.style.display = 'block';
            mobileResultContainer.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
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
const mobileHeicPreviewContainer = document.getElementById('mobileHeicPreviewContainer');
const mobileConvertedImage = document.getElementById('mobileConvertedImage');
const mobileHeicDownloadBtn = document.getElementById('mobileHeicDownloadBtn');

mobileHeicUploadArea.addEventListener('click', () => mobileHeicInput.click());

mobileHeicInput.addEventListener('change', handleHeicSelect);

async function handleHeicSelect(e) {
    const file = e.target.files[0];
    if (file && file.name.toLowerCase().endsWith('.heic')) {
        currentHeicFile = file;
        
        // Convert HEIC to JPEG using heic2any library
        heic2any({
            blob: file,
            toType: 'image/jpeg',
            quality: 0.8
        }).then(function(convertedBlob) {
            const reader = new FileReader();
            reader.onload = function(event) {
                mobileConvertedImage.src = event.target.result;
                mobileHeicPreviewContainer.style.display = 'block';
            };
            reader.readAsDataURL(convertedBlob);
        }).catch(function(error) {
            alert('Error converting HEIC: ' + error.message);
        });
    }
}

function downloadConvertedImage() {
    if (mobileConvertedImage.src) {
        const link = document.createElement('a');
        link.download = 'converted_image.jpg';
        link.href = mobileConvertedImage.src;
        link.click();
    }
}

// OCR功能
const mobileOcrUploadArea = document.getElementById('mobileOcrUploadArea');
const mobileOcrInput = document.getElementById('mobileOcrInput');
const mobileOcrPreviewContainer = document.getElementById('mobileOcrPreviewContainer');
const mobileOcrImage = document.getElementById('mobileOcrImage');
const mobileOcrLang = document.getElementById('mobileOcrLang');
const mobileStartOcrBtn = document.getElementById('mobileStartOcrBtn');
const mobileOcrLoading = document.getElementById('mobileOcrLoading');
const mobileOcrResultContainer = document.getElementById('mobileOcrResultContainer');
const mobileOcrResult = document.getElementById('mobileOcrResult');
const mobileCopyOcrBtn = document.getElementById('mobileCopyOcrBtn');

mobileOcrUploadArea.addEventListener('click', () => mobileOcrInput.click());

mobileOcrInput.addEventListener('change', handleOcrSelect);

mobileStartOcrBtn.addEventListener('click', startOcr);

mobileCopyOcrBtn.addEventListener('click', copyOcrText);

function handleOcrSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        currentOcrFile = file;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            mobileOcrImage.src = event.target.result;
            mobileOcrPreviewContainer.style.display = 'block';
            mobileOcrResultContainer.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

function startOcr() {
    if (!currentOcrFile) return;
    
    // Show loading indicator
    mobileOcrLoading.style.display = 'flex';
    mobileOcrResultContainer.style.display = 'none';
    
    // Get selected language
    const lang = mobileOcrLang.value;
    
    // Perform OCR using Tesseract.js
    Tesseract.recognize(
        mobileOcrImage.src,
        lang,
        { logger: message => console.log(message) }
    ).then(({ data: { text } }) => {
        // Hide loading and show result
        mobileOcrLoading.style.display = 'none';
        mobileOcrResultContainer.style.display = 'block';
        
        // Display recognized text
        mobileOcrResult.value = text;
    }).catch(error => {
        mobileOcrLoading.style.display = 'none';
        alert('OCR Error: ' + error.message);
    });
}

function copyOcrText() {
    mobileOcrResult.select();
    document.execCommand('copy');
    
    // Show feedback
    const originalText = mobileCopyOcrBtn.textContent;
    mobileCopyOcrBtn.textContent = 'Copied!';
    setTimeout(() => {
        mobileCopyOcrBtn.textContent = originalText;
    }, 2000);
}

// 工具函数
function formatFileSize(bytes) {
    if (bytes < 1024) {
        return bytes + ' B';
    } else if (bytes < 1048576) {
        return (bytes / 1024).toFixed(1) + ' KB';
    } else {
        return (bytes / 1048576).toFixed(1) + ' MB';
    }
}

// 质量滑块控制
mobileQualitySlider.addEventListener('input', (e) => {
    const quality = e.target.value;
    mobileQualityValue.textContent = quality + '%';
    if (mobileOriginalImage.src) {
        compressMobileImage(mobileOriginalImage.src, quality / 100);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Element references
    const compressBtn = document.getElementById('compressBtn');
    const convertBtn = document.getElementById('convertBtn');
    const ocrBtn = document.getElementById('ocrBtn');
    
    const compressTool = document.getElementById('compressTool');
    const convertTool = document.getElementById('convertTool');
    const ocrTool = document.getElementById('ocrTool');
    
    const backButtons = document.querySelectorAll('.back-btn');
    
    // Variables for image processing
    let currentOriginalFile = null;
    let currentOriginalImage = null;
    let currentHeicFile = null;
    let currentOcrFile = null;
    
    // Navigation between tools
    compressBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showTool(compressTool);
    });
    
    convertBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showTool(convertTool);
    });
    
    ocrBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showTool(ocrTool);
    });
    
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            hideAllTools();
        });
    });
    
    function showTool(tool) {
        hideAllTools();
        tool.style.display = 'block';
    }
    
    function hideAllTools() {
        compressTool.style.display = 'none';
        convertTool.style.display = 'none';
        ocrTool.style.display = 'none';
    }
    
    function processImage() {
        if (!currentOriginalImage) return;
        
        // Create canvas for processing
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions same as original
        canvas.width = currentOriginalImage.width;
        canvas.height = currentOriginalImage.height;
        
        // Draw image on canvas
        ctx.drawImage(currentOriginalImage, 0, 0);
        
        // Get processed image as data URL
        const quality = parseInt(mobileQualitySlider.value) / 100;
        const fileType = mobileFileType.value;
        const processedDataUrl = canvas.toDataURL(fileType, quality);
        
        // Display processed image
        mobileCompressedImage.src = processedDataUrl;
        
        // Calculate processed file size
        const base64String = processedDataUrl.split(',')[1];
        const processedSize = Math.round((base64String.length * 3) / 4);
        mobileCompressedSize.textContent = formatFileSize(processedSize);
        
        // Display dimensions
        mobileCompressedDimensions.textContent = `${canvas.width} x ${canvas.height}`;
        
        // Calculate size reduction
        const reduction = ((currentOriginalFile.size - processedSize) / currentOriginalFile.size * 100).toFixed(1);
        mobileSizeReduction.textContent = reduction + '%';
        
        // Show result container
        mobileResultContainer.style.display = 'block';
    }
    
    function downloadCompressedImage() {
        if (mobileCompressedImage.src) {
            const link = document.createElement('a');
            const fileType = mobileFileType.value.split('/')[1];
            link.download = `optimized_image.${fileType}`;
            link.href = mobileCompressedImage.src;
            link.click();
        }
    }
}); 