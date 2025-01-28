document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate-button');
    const resultsDiv = document.getElementById('results');

    calculateButton.addEventListener('click', function() {
        const income = parseFloat(document.getElementById('income').value);
        const taxRate = parseFloat(document.getElementById('tax-rate').value) / 100;

        // Валидация вводимых данных
        if (isNaN(income) || income <= 0 || isNaN(taxRate) || taxRate < 0) {
            alert('Пожалуйста, заполните все обязательные поля корректно.');
            return;
        }

        // Расчет налога и чистого дохода
        const taxAmount = income * taxRate;
        const netIncome = income - taxAmount;

        // Вывод результатов
        resultsDiv.innerHTML = `
            <div class="result-summary">
                <h2>Результаты расчета</h2>
                <p><strong>Облагаемый доход:</strong> ${income.toFixed(2)} ₽</p>
                <p><strong>Налог (${(taxRate * 100).toFixed(1)}%):</strong> ${taxAmount.toFixed(2)} ₽</p>
                <p><strong>Чистый доход после налогообложения:</strong> ${netIncome.toFixed(2)} ₽</p>
            </div>
        `;
    });
});
