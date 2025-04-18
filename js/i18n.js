const translations = {
    zh: {
        title: '图片压缩工具',
        subtitle: '简单、快速地压缩您的图片',
        compress: '图片压缩',
        convert: 'HEIC转换',
        resize: '批量调整尺寸',
        dropImage: '点击或拖拽图片到这里',
        supportFormat: '支持 PNG、JPG 格式',
        original: '原图',
        compressed: '压缩后',
        fileSize: '文件大小：',
        quality: '压缩质量：',
        download: '下载压缩后的图片',
        ocr: '文字识别',
        dropImageOcr: '上传图片进行文字识别',
        supportFormatOcr: '支持各种图片格式',
        originalImage: '原始图片',
        startOcr: '开始识别',
        recognizedText: '识别结果',
        recognizing: '正在识别中...',
        copyText: '复制文本',
        copySuccess: '复制成功',
        copyFailed: '复制失败',
        erase: '文字抹除',
        dropImageErase: '上传需要抹除文字的图片',
        supportFormatErase: '支持各种图片格式',
        convertPdf: 'PDF转换',
        selectConversionType: '选择转换类型：',
        dropFile: '点击或拖拽文件到这里',
        supportFileFormat: '支持的格式会根据转换类型自动更新',
        fileInfo: '文件信息',
        fileName: '文件名：',
        fileType: '文件类型：',
        startConversion: '开始转换',
        converting: '正在转换中...',
        conversionSuccess: '转换成功',
        conversionFailed: '转换失败',
        downloadResult: '下载转换结果'
    },
    en: {
        title: 'Image Compressor',
        subtitle: 'Compress your images quickly and easily',
        compress: 'Compress',
        convert: 'HEIC Convert',
        resize: 'Batch Resize',
        dropImage: 'Drop image here or click to upload',
        supportFormat: 'Supports PNG, JPG formats',
        original: 'Original',
        compressed: 'Compressed',
        fileSize: 'File size: ',
        quality: 'Quality: ',
        download: 'Download compressed image',
        ocr: 'OCR',
        dropImageOcr: 'Upload image for text recognition',
        supportFormatOcr: 'Supports various image formats',
        originalImage: 'Original Image',
        startOcr: 'Start Recognition',
        recognizedText: 'Recognition Result',
        recognizing: 'Recognizing...',
        copyText: 'Copy Text',
        copySuccess: 'Copied',
        copyFailed: 'Copy failed',
        erase: 'Text Eraser',
        dropImageErase: 'Upload image to erase text',
        supportFormatErase: 'Supports various image formats',
        convertPdf: 'PDF Converter',
        selectConversionType: 'Select conversion type:',
        dropFile: 'Drop file here or click to upload',
        supportFileFormat: 'Supported formats will update based on conversion type',
        fileInfo: 'File Information',
        fileName: 'File name: ',
        fileType: 'File type: ',
        startConversion: 'Start Conversion',
        converting: 'Converting...',
        conversionSuccess: 'Conversion Successful',
        conversionFailed: 'Conversion Failed',
        downloadResult: 'Download Result'
    }
};

// 设置语言
function setLanguage(lang) {
    document.querySelectorAll('.i18n').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // 更新语言按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    
    // 保存语言选择
    localStorage.setItem('preferred-language', lang);
}

// 初始化语言
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferred-language') || 'zh';
    setLanguage(savedLang);
    
    // 语言切换事件监听
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
}); 