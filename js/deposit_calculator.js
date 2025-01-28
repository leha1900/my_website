document.addEventListener('DOMContentLoaded', function() {
    const capitalizationSelect = document.getElementById('capitalization');
    const capitalizationPeriodRow = document.getElementById('capitalization-period-row');
    const calculateButton = document.getElementById('calculate-button');
    const resultsDiv = document.getElementById('results');

    // Показываем или скрываем периодичность капитализации
    capitalizationSelect.addEventListener('change', function() {
        if (this.value === 'yes') {
            capitalizationPeriodRow.style.display = 'table-row';
        } else {
            capitalizationPeriodRow.style.display = 'none';
        }
    });

    // Обработчик кнопки "Рассчитать"
    calculateButton.addEventListener('click', function() {
        const depositAmount = parseFloat(document.getElementById('deposit-amount').value);
        const depositTerm = parseInt(document.getElementById('deposit-term').value);
        const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
        const capitalization = capitalizationSelect.value;
        const capitalizationPeriods = parseInt(document.getElementById('capitalization-period').value) || 1;

        // Валидация вводимых данных
        if (isNaN(depositAmount) || depositAmount <= 0 ||
            isNaN(depositTerm) || depositTerm <= 0 ||
            isNaN(interestRate) || interestRate <= 0) {
            alert('Пожалуйста, заполните все обязательные поля корректно.');
            return;
        }

        const termInYears = depositTerm / 12;
        let totalAmount = 0;
        let income = 0;

        if (capitalization === 'no') {
            // Без капитализации
            income = depositAmount * interestRate * termInYears;
            totalAmount = depositAmount + income;
        } else {
            // С капитализацией
            const n = capitalizationPeriods * termInYears;
            const ratePerPeriod = interestRate / capitalizationPeriods;
            totalAmount = depositAmount * Math.pow(1 + ratePerPeriod, n);
            income = totalAmount - depositAmount;
        }

        // Отображение результатов
        resultsDiv.innerHTML = `
            <div class="result-summary">
                <h2>Результаты расчета</h2>
                <p><strong>Доход по вкладу:</strong> ${income.toFixed(2)} ₽</p>
                <p><strong>Итоговая сумма:</strong> ${totalAmount.toFixed(2)} ₽</p>
            </div>
        `;
    });
});
