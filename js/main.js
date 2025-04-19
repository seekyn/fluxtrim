document.addEventListener('DOMContentLoaded', function() {
    // 首先初始化标签页切换功能
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                console.log('切换到标签页:', this.dataset.tab);
                
                // 移除所有active类
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // 添加active类到当前选中的标签和面板
                this.classList.add('active');
                const targetPane = document.getElementById(this.dataset.tab + 'Pane');
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }

    // 初始化标签页
    initTabs();

    // 获取所有需要的DOM元素
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const previewContainer = document.getElementById('previewContainer');
    const controlPanel = document.getElementById('controlPanel');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const originalDimensions = document.getElementById('originalDimensions');
    const compressedDimensions = document.getElementById('compressedDimensions');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    // 调整大小相关元素
    const pixelMode = document.getElementById('pixelMode');
    const percentMode = document.getElementById('percentMode');
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const linkDimensions = document.getElementById('linkDimensions');
    const fileTypeSelect = document.getElementById('fileTypeSelect');

    // HEIC转换功能元素
    const heicUploadArea = document.getElementById('heicUploadArea');
    const heicInput = document.getElementById('heicInput');
    const heicPreviewContainer = document.getElementById('heicPreviewContainer');
    const convertControlPanel = document.getElementById('convertControlPanel');
    const convertedImage = document.getElementById('convertedImage');
    const convertDownloadBtn = document.getElementById('convertDownloadBtn');

    // 批量调整尺寸功能元素
    const resizeUploadArea = document.getElementById('resizeUploadArea');
    const resizeImageInput = document.getElementById('resizeImageInput');
    const resizeControlPanel = document.getElementById('resizeControlPanel');
    const resizeMode = document.getElementById('resizeMode');
    const percentageInput = document.getElementById('percentageInput');
    const dimensionInputs = document.getElementById('dimensionInputs');
    const scalePercentage = document.getElementById('scalePercentage');
    const targetWidth = document.getElementById('targetWidth');
    const targetHeight = document.getElementById('targetHeight');
    const maintainRatio = document.getElementById('maintainRatio');
    const imageList = document.getElementById('imageList');
    const resizeAllBtn = document.getElementById('resizeAllBtn');

    // OCR功能元素
    const ocrUploadArea = document.getElementById('ocrUploadArea');
    const ocrImageInput = document.getElementById('ocrImageInput');
    const ocrContainer = document.getElementById('ocrContainer');
    const ocrImage = document.getElementById('ocrImage');
    const startOcrBtn = document.getElementById('startOcrBtn');
    const ocrLang = document.getElementById('ocrLang');
    const ocrResult = document.getElementById('ocrResult');
    const copyOcrBtn = document.getElementById('copyOcrBtn');
    const loadingIndicator = document.querySelector('.loading-indicator');

    // 图片调整状态相关变量
    let originalWidth = 0;
    let originalHeight = 0;
    let aspectRatio = 1;
    let dimensionsLinked = true;
    let currentMode = 'pixels';  // 'pixels' 或 'percentage'
    let currentFile = null;      // 当前处理的文件
    
    // 压缩功能元素
    function initCompressFeature() {
        uploadArea.addEventListener('click', () => imageInput.click());
        uploadArea.addEventListener('dragover', handleDragOver);
        uploadArea.addEventListener('dragleave', handleDragLeave);
        uploadArea.addEventListener('drop', handleDrop);
        imageInput.addEventListener('change', handleFileSelect);
        
        // 初始化调整大小功能
        pixelMode.addEventListener('change', handleModeChange);
        percentMode.addEventListener('change', handleModeChange);
        widthInput.addEventListener('input', handleWidthChange);
        heightInput.addEventListener('input', handleHeightChange);
        linkDimensions.addEventListener('click', toggleDimensionLink);
        fileTypeSelect.addEventListener('change', handleFileTypeChange);
        
        // 初始化质量滑块
        qualitySlider.addEventListener('input', () => {
            qualityValue.textContent = qualitySlider.value + '%';
            processImage();
        });
    }

    // HEIC转换功能
    function initHeicFeature() {
        heicUploadArea.addEventListener('click', () => heicInput.click());
        heicUploadArea.addEventListener('dragover', handleDragOver);
        heicUploadArea.addEventListener('dragleave', handleDragLeave);
        heicUploadArea.addEventListener('drop', handleHeicDrop);
        heicInput.addEventListener('change', handleHeicSelect);
    }

    // 批量调整尺寸功能
    function initResizeFeature() {
        resizeUploadArea.addEventListener('click', () => resizeImageInput.click());
        resizeUploadArea.addEventListener('dragover', handleDragOver);
        resizeUploadArea.addEventListener('dragleave', handleDragLeave);
        resizeUploadArea.addEventListener('drop', handleResizeDrop);
        resizeImageInput.addEventListener('change', handleResizeSelect);
        resizeMode.addEventListener('change', handleResizeModeChange);
    }

    // OCR功能
    function initOcrFeature() {
        ocrUploadArea.addEventListener('click', () => ocrImageInput.click());
        ocrUploadArea.addEventListener('dragover', handleDragOver);
        ocrUploadArea.addEventListener('dragleave', handleDragLeave);
        ocrUploadArea.addEventListener('drop', handleOcrDrop);
        ocrImageInput.addEventListener('change', handleOcrSelect);
        startOcrBtn.addEventListener('click', handleOcrStart);
        copyOcrBtn.addEventListener('click', handleOcrCopy);
    }

    // 通用拖拽处理函数
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#007BFF';
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#B0E0E6';
    }

    // 处理尺寸链接切换
    function toggleDimensionLink() {
        dimensionsLinked = !dimensionsLinked;
        
        if (dimensionsLinked) {
            linkDimensions.querySelector('.link-icon').textContent = '🔗';
            linkDimensions.classList.add('active');
            // 重新同步高度
            handleWidthChange();
        } else {
            linkDimensions.querySelector('.link-icon').textContent = '⛓️';
            linkDimensions.classList.remove('active');
        }
    }

    // 处理调整模式变化
    function handleModeChange() {
        currentMode = pixelMode.checked ? 'pixels' : 'percentage';
        
        if (currentMode === 'pixels') {
            widthInput.placeholder = '宽度 (px)';
            heightInput.placeholder = '高度 (px)';
            
            if (originalWidth > 0) {
                widthInput.value = Math.round(originalWidth);
                heightInput.value = Math.round(originalHeight);
            }
        } else {
            widthInput.placeholder = '宽度 (%)';
            heightInput.placeholder = '高度 (%)';
            
            if (originalWidth > 0) {
                widthInput.value = 100;
                heightInput.value = 100;
            }
        }
        
        processImage();
    }

    // 处理宽度输入变化
    function handleWidthChange() {
        if (originalWidth === 0) return;
        
        if (dimensionsLinked) {
            if (currentMode === 'pixels') {
                const newWidth = parseInt(widthInput.value) || 0;
                heightInput.value = Math.round(newWidth / aspectRatio);
            } else {
                heightInput.value = widthInput.value;
            }
        }
        
        processImage();
    }

    // 处理高度输入变化
    function handleHeightChange() {
        if (originalHeight === 0) return;
        
        if (dimensionsLinked) {
            if (currentMode === 'pixels') {
                const newHeight = parseInt(heightInput.value) || 0;
                widthInput.value = Math.round(newHeight * aspectRatio);
            } else {
                widthInput.value = heightInput.value;
            }
        }
        
        processImage();
    }
    
    // 处理文件类型变化
    function handleFileTypeChange() {
        processImage();
    }

    // 压缩功能处理函数
    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.borderColor = '#B0E0E6';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImage(file);
        }
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleImage(file);
        }
    }

    // HEIC功能处理函数
    function handleHeicDrop(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.name.toLowerCase().endsWith('.heic')) {
            handleHeicImage(file);
        }
    }

    function handleHeicSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleHeicImage(file);
        }
    }

    // 调整尺寸功能处理函数
    function handleResizeDrop(e) {
        e.preventDefault();
        handleResizeFiles(e.dataTransfer.files);
    }

    function handleResizeSelect(e) {
        handleResizeFiles(e.target.files);
    }

    // OCR功能处理函数
    function handleOcrDrop(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleOcrImage(file);
        }
    }

    function handleOcrSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleOcrImage(file);
        }
    }

    // 图片压缩功能实现
    function handleImage(file) {
        currentFile = file;
        originalSize.textContent = formatFileSize(file.size);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                originalWidth = img.width;
                originalHeight = img.height;
                aspectRatio = originalWidth / originalHeight;
                
                originalDimensions.textContent = `${originalWidth} x ${originalHeight}`;
                
                // 初始化尺寸输入框
                if (currentMode === 'pixels') {
                    widthInput.value = originalWidth;
                    heightInput.value = originalHeight;
                } else {
                    widthInput.value = 100;
                    heightInput.value = 100;
                }
                
                originalImage.src = e.target.result;
                processImage();
                previewContainer.style.display = 'grid';
                controlPanel.style.display = 'block';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function processImage() {
        if (originalWidth === 0 || !originalImage.src) return;
        
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let newWidth, newHeight;
            
            if (currentMode === 'pixels') {
                newWidth = parseInt(widthInput.value) || originalWidth;
                newHeight = parseInt(heightInput.value) || originalHeight;
            } else {
                // 百分比模式
                const widthPercent = (parseInt(widthInput.value) || 100) / 100;
                const heightPercent = (parseInt(heightInput.value) || 100) / 100;
                newWidth = Math.round(originalWidth * widthPercent);
                newHeight = Math.round(originalHeight * heightPercent);
            }
            
            canvas.width = newWidth;
            canvas.height = newHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            // 处理图片
            const quality = parseInt(qualitySlider.value) / 100;
            const format = fileTypeSelect.value;
            const compressedBase64 = canvas.toDataURL(format, quality);
            compressedImage.src = compressedBase64;
            
            // 更新尺寸和大小信息
            compressedDimensions.textContent = `${newWidth} x ${newHeight}`;
            const compressedSize = Math.round((compressedBase64.length * 3) / 4);
            document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
            
            // 设置下载按钮
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                const extension = format.split('/')[1];
                link.download = `processed-image.${extension}`;
                link.href = compressedBase64;
                link.click();
            };
        };
        img.src = originalImage.src;
    }

    // HEIC转换功能实现
    async function handleHeicImage(file) {
        try {
            convertedImage.src = '';
            heicPreviewContainer.style.display = 'grid';
            convertControlPanel.style.display = 'block';
            
            const jpgBlob = await heic2any({
                blob: file,
                toType: 'image/jpeg',
                quality: 0.8
            });

            const url = URL.createObjectURL(jpgBlob);
            convertedImage.src = url;
            
            convertDownloadBtn.onclick = () => {
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

    // 批量调整尺寸功能实现
    function handleResizeFiles(files) {
        if (files.length === 0) return;
        
        resizeControlPanel.style.display = 'block';
        imageList.innerHTML = '';
        
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    addImageToList(file.name, img.width, img.height, file.size, e.target.result);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function handleResizeModeChange() {
        if (resizeMode.value === 'percentage') {
            percentageInput.style.display = 'flex';
            dimensionInputs.style.display = 'none';
        } else {
            percentageInput.style.display = 'none';
            dimensionInputs.style.display = 'flex';
            
            if (resizeMode.value === 'width') {
                targetHeight.parentElement.style.display = 'none';
            } else if (resizeMode.value === 'height') {
                targetWidth.parentElement.style.display = 'none';
            } else {
                targetWidth.parentElement.style.display = 'flex';
                targetHeight.parentElement.style.display = 'flex';
            }
        }
    }

    function addImageToList(name, width, height, size, dataUrl) {
        const item = document.createElement('div');
        item.className = 'image-item';
        item.innerHTML = `
            <img src="${dataUrl}" alt="${name}">
            <div class="image-info">
                <h4>${name}</h4>
                <p>尺寸: ${width}x${height}px</p>
                <p>大小: ${formatFileSize(size)}</p>
            </div>
            <div class="image-status pending">等待处理</div>
        `;
        imageList.appendChild(item);
    }

    async function resizeImage(img) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            let newWidth, newHeight;
            
            if (resizeMode.value === 'percentage') {
                const scale = parseInt(scalePercentage.value) / 100;
                newWidth = img.naturalWidth * scale;
                newHeight = img.naturalHeight * scale;
            } else {
                if (resizeMode.value === 'width' || resizeMode.value === 'both') {
                    newWidth = parseInt(targetWidth.value);
                    if (maintainRatio.checked && resizeMode.value === 'width') {
                        const ratio = img.naturalHeight / img.naturalWidth;
                        newHeight = Math.round(newWidth * ratio);
                    }
                }
                if (resizeMode.value === 'height' || resizeMode.value === 'both') {
                    newHeight = parseInt(targetHeight.value);
                    if (maintainRatio.checked && resizeMode.value === 'height') {
                        const ratio = img.naturalWidth / img.naturalHeight;
                        newWidth = Math.round(newHeight * ratio);
                    }
                }
            }
            
            canvas.width = newWidth;
            canvas.height = newHeight;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            resolve(canvas.toDataURL('image/jpeg', 0.9));
        });
    }

    // OCR功能实现
    function handleOcrImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            ocrImage.src = e.target.result;
            ocrContainer.style.display = 'grid';
            ocrResult.value = '';
        };
        reader.readAsDataURL(file);
    }

    async function handleOcrStart() {
        if (!ocrImage.src) return;
        
        loadingIndicator.style.display = 'block';
        ocrResult.value = '';
        
        try {
            const result = await Tesseract.recognize(
                ocrImage.src,
                ocrLang.value,
                {
                    logger: m => console.log(m)
                }
            );
            
            ocrResult.value = result.data.text;
        } catch (error) {
            console.error('OCR Error:', error);
            ocrResult.value = '识别失败，请重试';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    function handleOcrCopy() {
        ocrResult.select();
        try {
            document.execCommand('copy');
            alert('文本已复制到剪贴板');
        } catch (err) {
            alert('复制失败，请手动复制');
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

    // 批量调整尺寸按钮事件
    resizeAllBtn.addEventListener('click', async () => {
        const items = imageList.getElementsByClassName('image-item');
        const currentFolder = folderName.value.trim() || 'resized_images';
        const currentPrefix = filePrefix.value.trim() || 'resized_';
        
        const zip = new JSZip();
        const folder = zip.folder(currentFolder);
        
        for (let item of items) {
            const status = item.querySelector('.image-status');
            const img = item.querySelector('img');
            const fileName = item.querySelector('h4').textContent;
            
            status.className = 'image-status processing';
            status.textContent = '处理中...';
            
            try {
                const resizedDataUrl = await resizeImage(img);
                const imageData = resizedDataUrl.split(',')[1];
                folder.file(currentPrefix + fileName, imageData, {base64: true});
                
                status.className = 'image-status completed';
                status.textContent = '完成';
            } catch (error) {
                status.className = 'image-status error';
                status.textContent = '失败';
                console.error(error);
            }
        }

        try {
            const content = await zip.generateAsync({type: 'blob'});
            const zipName = `${currentFolder}_${new Date().toISOString().slice(0,10)}.zip`;
            saveAs(content, zipName);
            alert(`所有图片已保存到 ${zipName} 中`);
        } catch (error) {
            console.error('创建ZIP文件失败:', error);
            alert('保存失败，请重试');
        }
    });

    // 文字抹除功能
    function initEraseFeature() {
        const eraseUploadArea = document.getElementById('eraseUploadArea');
        const eraseImageInput = document.getElementById('eraseImageInput');
        const eraseContainer = document.getElementById('eraseContainer');
        const eraseCanvas = document.getElementById('eraseCanvas');
        const brushSize = document.getElementById('brushSize');
        const brushSizeValue = document.getElementById('brushSizeValue');
        const brushSoftness = document.getElementById('brushSoftness');
        const brushSoftnessValue = document.getElementById('brushSoftnessValue');
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        const resetBtn = document.getElementById('resetBtn');
        const downloadEraseBtn = document.getElementById('downloadEraseBtn');

        let ctx = eraseCanvas.getContext('2d');
        let isDrawing = false;
        let originalImage = null;
        let undoStack = [];
        let redoStack = [];
        let lastX = 0;
        let lastY = 0;

        // 事件监听
        eraseUploadArea.addEventListener('click', () => eraseImageInput.click());
        eraseUploadArea.addEventListener('dragover', handleDragOver);
        eraseUploadArea.addEventListener('dragleave', handleDragLeave);
        eraseUploadArea.addEventListener('drop', handleEraseDrop);
        eraseImageInput.addEventListener('change', handleEraseSelect);

        // 画布事件
        eraseCanvas.addEventListener('mousedown', startDrawing);
        eraseCanvas.addEventListener('mousemove', draw);
        eraseCanvas.addEventListener('mouseup', stopDrawing);
        eraseCanvas.addEventListener('mouseout', stopDrawing);

        // 控制按钮事件
        brushSize.addEventListener('input', updateBrushSize);
        brushSoftness.addEventListener('input', updateBrushSoftness);
        undoBtn.addEventListener('click', undo);
        redoBtn.addEventListener('click', redo);
        resetBtn.addEventListener('click', reset);
        downloadEraseBtn.addEventListener('click', downloadEraseImage);

        function handleEraseDrop(e) {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                loadImage(file);
            }
        }

        function handleEraseSelect(e) {
            const file = e.target.files[0];
            if (file) {
                loadImage(file);
            }
        }

        function loadImage(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // 设置画布大小
                    eraseCanvas.width = img.width;
                    eraseCanvas.height = img.height;
                    
                    // 绘制原始图片
                    ctx.drawImage(img, 0, 0);
                    originalImage = img;
                    
                    // 清空撤销/重做栈
                    undoStack = [];
                    redoStack = [];
                    updateButtons();
                    
                    eraseContainer.style.display = 'block';
                    saveState();
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        function startDrawing(e) {
            isDrawing = true;
            [lastX, lastY] = getMousePos(e);
        }

        function draw(e) {
            if (!isDrawing) return;

            const [x, y] = getMousePos(e);
            const radius = parseInt(brushSize.value);
            const softness = parseInt(brushSoftness.value) / 100;

            ctx.save();
            ctx.beginPath();
            
            // 创建径向渐变
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${1 - softness})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();

            lastX = x;
            lastY = y;
        }

        function stopDrawing() {
            if (isDrawing) {
                isDrawing = false;
                saveState();
            }
        }

        function getMousePos(e) {
            const rect = eraseCanvas.getBoundingClientRect();
            const scaleX = eraseCanvas.width / rect.width;
            const scaleY = eraseCanvas.height / rect.height;
            return [
                (e.clientX - rect.left) * scaleX,
                (e.clientY - rect.top) * scaleY
            ];
        }

        function saveState() {
            undoStack.push(ctx.getImageData(0, 0, eraseCanvas.width, eraseCanvas.height));
            redoStack = [];
            updateButtons();
        }

        function undo() {
            if (undoStack.length > 1) {
                redoStack.push(undoStack.pop());
                ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
                updateButtons();
            }
        }

        function redo() {
            if (redoStack.length > 0) {
                const state = redoStack.pop();
                undoStack.push(state);
                ctx.putImageData(state, 0, 0);
                updateButtons();
            }
        }

        function reset() {
            if (originalImage) {
                ctx.clearRect(0, 0, eraseCanvas.width, eraseCanvas.height);
                ctx.drawImage(originalImage, 0, 0);
                undoStack = [];
                redoStack = [];
                saveState();
            }
        }

        function updateButtons() {
            undoBtn.disabled = undoStack.length <= 1;
            redoBtn.disabled = redoStack.length === 0;
        }

        function updateBrushSize() {
            brushSizeValue.textContent = `${brushSize.value}px`;
        }

        function updateBrushSoftness() {
            brushSoftnessValue.textContent = `${brushSoftness.value}%`;
        }

        function downloadEraseImage() {
            const link = document.createElement('a');
            link.download = 'erased-image.png';
            link.href = eraseCanvas.toDataURL('image/png');
            link.click();
        }
    }

    // 初始化所有功能
    initCompressFeature();
    initHeicFeature();
    initResizeFeature();
    initOcrFeature();
    initEraseFeature();

    // 初始化链接按钮状态
    linkDimensions.classList.add('active');
}); 