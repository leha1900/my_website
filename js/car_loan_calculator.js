document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate-button');
    const resultsDiv = document.getElementById('results');

    calculateButton.addEventListener('click', function() {
        const carPrice = parseFloat(document.getElementById('car-price').value);
        const initialPayment = parseFloat(document.getElementById('initial-payment').value);
        const loanTerm = parseInt(document.getElementById('loan-term').value);
        const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
        const loanType = document.getElementById('loan-type').value;

        // Валидация вводимых данных
        if (isNaN(carPrice) || carPrice <= 0 || isNaN(loanTerm) || loanTerm <= 0 || isNaN(interestRate) || interestRate <= 0) {
            alert('Пожалуйста, заполните все обязательные поля корректно.');
            return;
        }

        // Расчет суммы кредита
        const loanAmount = carPrice - initialPayment;

        // Проверяем корректность суммы кредита
        if (loanAmount <= 0) {
            alert('Первоначальный взнос не может быть больше или равен стоимости автомобиля.');
            return;
        }

        const monthlyInterestRate = interestRate / 12;
        const totalPayments = loanTerm * 12;

        let monthlyPayment = 0;
        let totalPayment = 0;

        if (loanType === 'annuity') {
            // Аннуитетный платеж
            const annuityFactor = (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / (Math.pow(1 + monthlyInterestRate, totalPayments) - 1);
            monthlyPayment = loanAmount * annuityFactor;
            totalPayment = monthlyPayment * totalPayments;
        } else if (loanType === 'differentiated') {
            // Дифференцированный платеж
            const principalPayment = loanAmount / totalPayments;
            let firstInterestPayment = loanAmount * monthlyInterestRate;
            let firstMonthlyPayment = principalPayment + firstInterestPayment;
            let lastInterestPayment = principalPayment * monthlyInterestRate;
            let lastMonthlyPayment = principalPayment + lastInterestPayment;

            monthlyPayment = `${firstMonthlyPayment.toFixed(2)} ₽ - ${lastMonthlyPayment.toFixed(2)} ₽`;
            totalPayment = (principalPayment * totalPayments) + ((firstInterestPayment + lastInterestPayment) / 2 * totalPayments);
        }

        const overpayment = totalPayment - loanAmount;

        // Вывод результатов
        resultsDiv.innerHTML = `
            <div class="result-summary">
                <h2>Результаты расчета</h2>
                <p><strong>Сумма кредита:</strong> ${loanAmount.toFixed(2)} ₽</p>
                <p><strong>Ежемесячный платеж:</strong> ${monthlyPayment}</p>
                <p><strong>Общая сумма выплат:</strong> ${totalPayment.toFixed(2)} ₽</p>
                <p><strong>Общая переплата по кредиту:</strong> ${overpayment.toFixed(2)} ₽</p>
            </div>
        `;
    });
});
