// js/script.js

document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generate-qr-button');
    const downloadButton = document.getElementById('download-qr-button');
    const qrTextInput = document.getElementById('qr-text');
    const qrContainer = document.getElementById('qrcode');

    let qr = null;

    generateButton.addEventListener('click', function() {
        const text = qrTextInput.value.trim();
        if (text === '') {
            alert('Пожалуйста, введите текст или ссылку для генерации QR-кода.');
            return;
        }

        // Очищаем предыдущий QR-код
        qrContainer.innerHTML = '';

        // Генерируем новый QR-код
        qr = new QRCode(qrContainer, {
            text: text,
            width: 256,
            height: 256,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
            useSVG: false
        });
    });

    downloadButton.addEventListener('click', function() {
        // Проверяем, сгенерирован ли QR-код
        const canvas = qrContainer.querySelector('canvas');
        if (!canvas) {
            alert('Сначала сгенерируйте QR-код!');
            return;
        }
        const dataURL = canvas.toDataURL('image/png');

        // Создаём временную ссылку для скачивания
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = 'qrcode.png';
        a.click();
    });
});

