document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate-button');
    const resultsDiv = document.getElementById('results');

    calculateButton.addEventListener('click', function() {
        const homePrice = parseFloat(document.getElementById('home-price').value);
        const initialPayment = parseFloat(document.getElementById('initial-payment').value);
        const mortgageRate = parseFloat(document.getElementById('mortgage-rate').value);
        const loanTerm = parseInt(document.getElementById('loan-term').value);
        const rentCost = parseFloat(document.getElementById('rent-cost').value);
        const years = parseInt(document.getElementById('years').value);

        // Валидация вводимых данных
        if (isNaN(homePrice) || homePrice <= 0 || isNaN(initialPayment) || initialPayment < 0 ||
            isNaN(mortgageRate) || mortgageRate <= 0 || isNaN(loanTerm) || loanTerm <= 0 ||
            isNaN(rentCost) || rentCost <= 0 || isNaN(years) || years <= 0) {
            alert('Пожалуйста, заполните все обязательные поля корректно.');
            return;
        }

        // Основная сумма кредита
        const loanAmount = homePrice - initialPayment;

        // Ежемесячная процентная ставка
        const monthlyInterestRate = mortgageRate / 100 / 12;

        // Общее количество месяцев
        const totalPayments = loanTerm * 12;

        // Расчет ежемесячного платежа по ипотеке (аннуитетная формула)
        const monthlyMortgagePayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
                                        (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);

        // Общие затраты на покупку жилья за указанный период
        const monthsToEvaluate = years * 12;
        let totalMortgagePayments = Math.min(monthsToEvaluate, totalPayments) * monthlyMortgagePayment;
        const totalRentPayments = monthsToEvaluate * rentCost;

        // Общие затраты на покупку включают первоначальный взнос и ежемесячные платежи
        const totalPurchaseCost = totalMortgagePayments + initialPayment;

        // Добавляем стоимость жилья к общим активам после покупки
        const remainingPropertyValue = homePrice;

        // Оценка: если сумма аренды оказалась меньше, но жилье остается у владельца
        let netCostPurchase = totalPurchaseCost - remainingPropertyValue;
        let netCostRent = totalRentPayments;

        // Сравнение покупки и аренды
        let comparisonMessage = '';
        if (netCostPurchase < netCostRent) {
            comparisonMessage = `Покупка жилья выгоднее на ${(netCostRent - netCostPurchase).toFixed(2)} ₽, учитывая стоимость жилья, остающегося у вас.`;
        } else {
            comparisonMessage = `Аренда жилья выгоднее на ${(netCostPurchase - netCostRent).toFixed(2)} ₽, но стоит учитывать, что в конце периода при покупке вы будете владельцем имущества.`;
        }

        // Вывод результатов
        resultsDiv.innerHTML = `
            <div class="result-summary">
                <h2>Результаты оценки: Покупка или аренда?</h2>
                <p><strong>Стоимость жилья:</strong> ${homePrice.toFixed(2)} ₽</p>
                <p><strong>Первоначальный взнос:</strong> ${initialPayment.toFixed(2)} ₽</p>
                <p><strong>Процентная ставка по ипотеке:</strong> ${mortgageRate.toFixed(2)} %</p>
                <p><strong>Срок ипотеки:</strong> ${loanTerm} лет</p>
                <p><strong>Ежемесячный платеж по ипотеке:</strong> ${monthlyMortgagePayment.toFixed(2)} ₽</p>
                <p><strong>Общие затраты на аренду за ${years} лет:</strong> ${totalRentPayments.toFixed(2)} ₽</p>
                <p><strong>Общие затраты на покупку за ${years} лет (с учетом стоимости жилья):</strong> ${(netCostPurchase + remainingPropertyValue).toFixed(2)} ₽</p>
                <p><strong>${comparisonMessage}</strong></p>
            </div>
        `;
    });
});
