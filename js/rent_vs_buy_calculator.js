document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate-button');
    const resultsDiv = document.getElementById('results');

    calculateButton.addEventListener('click', function() {
        // Получение значений из полей формы
        const homePrice = parseFloat(document.getElementById('home-price').value);
        const initialPayment = parseFloat(document.getElementById('initial-payment').value);
        const mortgageRate = parseFloat(document.getElementById('mortgage-rate').value);
        const loanTerm = parseInt(document.getElementById('loan-term').value);
        const rentCost = parseFloat(document.getElementById('rent-cost').value);
        const years = parseInt(document.getElementById('years').value);

        // Валидация вводимых данных
        if (isNaN(homePrice) || homePrice <= 0) {
            alert('Введите корректную стоимость жилья.');
            return;
        }
        if (isNaN(initialPayment) || initialPayment < 0) {
            alert('Введите корректный первоначальный взнос.');
            return;
        }
        if (isNaN(mortgageRate) || mortgageRate < 0) {
            alert('Введите корректную процентную ставку.');
            return;
        }
        if (isNaN(loanTerm) || loanTerm <= 0) {
            alert('Введите корректный срок ипотеки.');
            return;
        }
        if (isNaN(rentCost) || rentCost <= 0) {
            alert('Введите корректную ежемесячную арендную плату.');
            return;
        }
        if (isNaN(years) || years <= 0) {
            alert('Введите корректный период оценки.');
            return;
        }

        // Основная сумма кредита
        const loanAmount = homePrice - initialPayment;

        if (loanAmount <= 0) {
            alert('Первоначальный взнос не может быть больше или равен стоимости жилья.');
            return;
        }

        // Ежемесячная процентная ставка
        const monthlyInterestRate = mortgageRate / 100 / 12;

        // Общее количество месяцев по кредиту
        const totalPayments = loanTerm * 12;

        // Расчет ежемесячного платежа по ипотеке (аннуитетная формула)
        let monthlyMortgagePayment = 0;
        if (monthlyInterestRate > 0) {
            monthlyMortgagePayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) /
                                    (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
        } else {
            // Если процентная ставка равна нулю, расчет будет простым делением
            monthlyMortgagePayment = loanAmount / totalPayments;
        }

        // Общие затраты на покупку жилья за указанный период
        const monthsToEvaluate = Math.min(years * 12, totalPayments);
        let totalMortgagePayments = monthsToEvaluate * monthlyMortgagePayment;
        const totalRentPayments = years * 12 * rentCost;

        // Общие затраты на покупку включают первоначальный взнос и ежемесячные платежи
        const totalPurchaseCost = totalMortgagePayments + initialPayment;

        // Общая сумма всех ипотечных выплат (если полностью выплатить ипотеку)
        const totalMortgageCost = (monthlyMortgagePayment * totalPayments) + initialPayment;

        // Добавляем стоимость жилья к общим активам после покупки
        const remainingPropertyValue = homePrice;

        // Сравнение: чистые расходы на покупку с учетом стоимости актива (жилья)
        let netCostPurchase = totalPurchaseCost - remainingPropertyValue;
        let netCostRent = totalRentPayments;

        // Сравнительное сообщение с учетом стоимости жилья
        let comparisonMessage = '';
        if (netCostPurchase < netCostRent) {
            comparisonMessage = `Покупка жилья выгоднее на ${(netCostRent - netCostPurchase).toFixed(2)} ₽, учитывая, что вы станете владельцем недвижимости, которая останется вашей собственностью.`;
        } else {
            comparisonMessage = `Аренда жилья дешевле на ${(netCostPurchase - netCostRent).toFixed(2)} ₽ за ${years} лет, но важно учитывать, что после покупки жилья оно останется в вашем владении.`;
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
                <p><strong>Общие затраты на покупку за ${years} лет (с учетом стоимости жилья):</strong> ${(totalPurchaseCost - remainingPropertyValue).toFixed(2)} ₽</p>
                <p><strong>Общая сумма всех ипотечных выплат (с учетом первоначального взноса):</strong> ${totalMortgageCost.toFixed(2)} ₽</p>
                <p><strong>${comparisonMessage}</strong></p>
                <p><em>Важно: данный расчет не учитывает инфляцию, изменения рыночной стоимости недвижимости, а также возможное повышение арендной платы.</em></p>
            </div>
        `;
    });
});

