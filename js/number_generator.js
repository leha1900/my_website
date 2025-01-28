// js/number_generator.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('generator-form');
    const minValueInput = document.getElementById('min-value');
    const maxValueInput = document.getElementById('max-value');
    const quantityInput = document.getElementById('quantity');
    const uniqueCheckbox = document.getElementById('unique');
    const resultsDiv = document.getElementById('results');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const min = parseInt(minValueInput.value, 10);
        const max = parseInt(maxValueInput.value, 10);
        const quantity = parseInt(quantityInput.value, 10);
        const isUnique = uniqueCheckbox.checked;

        // Валидация вводимых данных
        if (isNaN(min) || isNaN(max) || isNaN(quantity)) {
            alert('Пожалуйста, введите корректные числовые значения.');
            return;
        }

        if (min > max) {
            alert('Минимальное значение не может быть больше максимального.');
            return;
        }

        if (quantity < 1) {
            alert('Количество чисел должно быть минимум 1.');
            return;
        }

        if (isUnique && quantity > (max - min + 1)) {
            alert('Количество уникальных чисел превышает возможное количество в заданном диапазоне.');
            return;
        }

        // Генерация чисел
        let numbers = [];
        if (isUnique) {
            numbers = generateUniqueRandomNumbers(min, max, quantity);
        } else {
            numbers = generateRandomNumbers(min, max, quantity);
        }

        // Отображение результатов
        displayResults(numbers);
    });

    // Функция для генерации случайных чисел с возможностью повторений
    function generateRandomNumbers(min, max, quantity) {
        const nums = [];
        for (let i = 0; i < quantity; i++) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            nums.push(num);
        }
        return nums;
    }

    // Функция для генерации уникальных случайных чисел
    function generateUniqueRandomNumbers(min, max, quantity) {
        const nums = new Set();
        while (nums.size < quantity) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            nums.add(num);
        }
        return Array.from(nums);
    }

    // Функция для отображения результатов
    function displayResults(numbers) {
        resultsDiv.innerHTML = `
            <div class="result-summary">
                <h2>Сгенерированные Числа:</h2>
                <p>${numbers.join(', ')}</p>
                <button id="copy-button">Скопировать</button>
                <button id="download-button">Скачать как .txt</button>
            </div>
        `;

        // Добавление функционала копирования
        const copyButton = document.getElementById('copy-button');
        copyButton.addEventListener('click', function() {
            const text = numbers.join(', ');
            navigator.clipboard.writeText(text)
                .then(() => {
                    alert('Числа скопированы в буфер обмена!');
                })
                .catch(err => {
                    console.error('Ошибка при копировании: ', err);
                });
        });

        // Добавление функционала скачивания
        const downloadButton = document.getElementById('download-button');
        downloadButton.addEventListener('click', function() {
            const text = numbers.join('\n');
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'generated_numbers.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
});
