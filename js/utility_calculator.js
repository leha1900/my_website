document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate-button');
    const resultsDiv = document.getElementById('results');

    calculateButton.addEventListener('click', function() {
        const electricityUsage = parseFloat(document.getElementById('electricity-usage').value) || 0;
        const electricityRate = parseFloat(document.getElementById('electricity-rate').value) || 0;
        const waterUsage = parseFloat(document.getElementById('water-usage').value) || 0;
        const waterRate = parseFloat(document.getElementById('water-rate').value) || 0;
        const gasUsage = parseFloat(document.getElementById('gas-usage').value) || 0;
        const gasRate = parseFloat(document.getElementById('gas-rate').value) || 0;
        const heatingCost = parseFloat(document.getElementById('heating-cost').value) || 0;
        const otherExpenses = parseFloat(document.getElementById('other-expenses').value) || 0;

        // Расчет стоимости услуг
        const electricityCost = electricityUsage * electricityRate;
        const waterCost = waterUsage * waterRate;
        const gasCost = gasUsage * gasRate;

        // Общая сумма коммунальных платежей
        const totalCost = electricityCost + waterCost + gasCost + heatingCost + otherExpenses;

        // Вывод результатов
        resultsDiv.innerHTML = `
            <div class="result-summary">
                <h2>Результаты расчета коммунальных платежей</h2>
                <p><strong>Электричество:</strong> ${electricityCost.toFixed(2)} ₽</p>
                <p><strong>Вода:</strong> ${waterCost.toFixed(2)} ₽</p>
                <p><strong>Газ:</strong> ${gasCost.toFixed(2)} ₽</p>
                <p><strong>Отопление:</strong> ${heatingCost.toFixed(2)} ₽</p>
                <p><strong>Другие расходы:</strong> ${otherExpenses.toFixed(2)} ₽</p>
                <p><strong>Общая сумма коммунальных платежей:</strong> ${totalCost.toFixed(2)} ₽</p>
            </div>
        `;
    });
});
