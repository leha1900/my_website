// js/script.js

document.addEventListener('DOMContentLoaded', function() {
    const generateButton = document.getElementById('generate-button');
    const copyButton = document.getElementById('copy-button');
    const passwordDisplay = document.getElementById('password-display');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('length-value');

    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');

    // Обновление отображаемого значения длины пароля
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = lengthSlider.value;
    });

    // Функция генерации пароля
    function generatePassword() {
        const length = parseInt(lengthSlider.value);
        const hasUpper = uppercaseCheckbox.checked;
        const hasLower = lowercaseCheckbox.checked;
        const hasNumbers = numbersCheckbox.checked;
        const hasSymbols = symbolsCheckbox.checked;

        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?/';

        let charSet = '';
        if (hasUpper) charSet += upperChars;
        if (hasLower) charSet += lowerChars;
        if (hasNumbers) charSet += numberChars;
        if (hasSymbols) charSet += symbolChars;

        if (charSet === '') {
            alert('Пожалуйста, выберите хотя бы один тип символов для генерации пароля.');
            return '';
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charSet.length);
            password += charSet[randomIndex];
        }

        return password;
    }

    // Обработчик кнопки "Сгенерировать Пароль"
    generateButton.addEventListener('click', function() {
        const password = generatePassword();
        if (password !== '') {
            passwordDisplay.value = password;
        } else {
            passwordDisplay.value = '';
        }
    });

    // Обработчик кнопки "Копировать"
    copyButton.addEventListener('click', function() {
        const password = passwordDisplay.value.trim();
        if (password === '') {
            alert('Нет пароля для копирования.');
            return;
        }

        navigator.clipboard.writeText(password).then(() => {
            alert('Пароль скопирован в буфер обмена.');
        }).catch(err => {
            alert('Не удалось скопировать пароль.');
        });
    });
});




