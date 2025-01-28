document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы
    const loanTypeSelect = document.getElementById('loan-type');
    const calculationTypeSelect = document.getElementById('calculation-type');
    const calculateButton = document.getElementById('calculate-button');
    const showDetailsButton = document.getElementById('show-details-button');
    const exportPDFButton = document.getElementById('export-pdf');
    const exportExcelButton = document.getElementById('export-excel');
    const allFields = document.querySelectorAll('.field-row');
    const resultDiv = document.getElementById('results');
    const chartCanvas = document.getElementById('balanceChart');

    let schedule = [];
    let balanceChart;

    // Функция для управления видимостью полей
    function updateFields() {
        const calculationType = calculationTypeSelect.value;

        // Скрываем все поля
        allFields.forEach(field => {
            field.classList.add('hidden');
            field.classList.remove('required-field');
        });

        // Поля, которые будут видимы и обязательны для заполнения в зависимости от типа расчета
        const commonFields = ['loan-amount', 'interest-rate', 'closing-fee'];
        let requiredFields = [];

        if (calculationType === 'monthly-payment') {
            requiredFields = ['loan-amount', 'interest-rate', 'loan-term'];
        } else if (calculationType === 'remaining-balance') {
            requiredFields = ['loan-amount', 'interest-rate', 'loan-term', 'period'];
        } else if (calculationType === 'loan-term') {
            requiredFields = ['loan-amount', 'interest-rate', 'monthly-payment'];
        } else if (calculationType === 'total-overpayment') {
            requiredFields = ['loan-amount', 'interest-rate', 'loan-term'];
        }

        // Показываем необходимые поля и помечаем обязательные
        const fieldsToShow = [...new Set([...commonFields, ...requiredFields, 'annual-extra-payment', 'individual-extra-payments', 'start-date', 'calculation-accuracy'])];
        fieldsToShow.forEach(fieldName => {
            const fieldRow = document.querySelector(`.field-row[data-field="${fieldName}"]`);
            if (fieldRow) {
                fieldRow.classList.remove('hidden');
                if (requiredFields.includes(fieldName)) {
                    fieldRow.classList.add('required-field');
                }
            }
        });
    }

    // Обновление полей при изменении типа расчета
    calculationTypeSelect.addEventListener('change', updateFields);
    updateFields(); // Первоначальная настройка полей

    // Обработчик кнопки "Рассчитать"
    calculateButton.addEventListener('click', function() {
        const loanType = loanTypeSelect.value;
        const calculationType = calculationTypeSelect.value;

        const loanAmount = parseFloat(document.getElementById('loan-amount').value);
        const closingFee = parseFloat(document.getElementById('closing-fee').value) || 0;
        const netLoanAmount = loanAmount - closingFee;
        const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
        const loanTerm = parseFloat(document.getElementById('loan-term').value);
        const monthlyPayment = parseFloat(document.getElementById('monthly-payment').value);
        const period = parseInt(document.getElementById('period').value);
        const annualExtraPayment = parseFloat(document.getElementById('annual-extra-payment').value) || 0;
        const startDate = document.getElementById('start-date').value ? new Date(document.getElementById('start-date').value) : new Date();

        // Валидация вводимых данных
        if (!validateInputs(calculationType, netLoanAmount, interestRate, loanTerm, monthlyPayment, period)) {
            return;
        }

        // Очищаем предыдущие результаты
        resultDiv.innerHTML = '';
        schedule = [];

        // Расчеты
        if (calculationType === 'monthly-payment') {
            // Расчет ежемесячного платежа
            const monthlyPaymentResult = calculateMonthlyPayment(netLoanAmount, interestRate, loanTerm, loanType);
            resultDiv.innerHTML += `<div class="result-summary"><h2>Результаты расчета</h2><p>Ежемесячный платеж: ${monthlyPaymentResult.toFixed(2)} ₽</p></div>`;
            generateAmortizationSchedule(netLoanAmount, interestRate, loanTerm, monthlyPaymentResult, loanType, startDate, annualExtraPayment);

        } else if (calculationType === 'remaining-balance') {
            // Расчет остатка задолженности
            const monthlyPaymentResult = calculateMonthlyPayment(netLoanAmount, interestRate, loanTerm, loanType);
            generateAmortizationSchedule(netLoanAmount, interestRate, loanTerm, monthlyPaymentResult, loanType, startDate, annualExtraPayment, period);
            const remainingBalance = schedule[schedule.length - 1].remainingBalance;
            resultDiv.innerHTML += `<div class="result-summary"><h2>Результаты расчета</h2><p>Остаток задолженности после ${period} месяцев: ${remainingBalance.toFixed(2)} ₽</p></div>`;

        } else if (calculationType === 'loan-term') {
            // Расчет срока кредита
            const loanTermResult = calculateLoanTerm(netLoanAmount, interestRate, monthlyPayment, loanType);
            resultDiv.innerHTML += `<div class="result-summary"><h2>Результаты расчета</h2><p>Срок кредита: ${loanTermResult.years} лет и ${loanTermResult.months} месяцев</p></div>`;
            generateAmortizationSchedule(netLoanAmount, interestRate, loanTermResult.totalYears, monthlyPayment, loanType, startDate, annualExtraPayment);

        } else if (calculationType === 'total-overpayment') {
            // Расчет общей переплаты
            const monthlyPaymentResult = calculateMonthlyPayment(netLoanAmount, interestRate, loanTerm, loanType);
            generateAmortizationSchedule(netLoanAmount, interestRate, loanTerm, monthlyPaymentResult, loanType, startDate, annualExtraPayment);
            const totalOverpayment = schedule.reduce((sum, payment) => sum + payment.paymentAmount, 0) - netLoanAmount;
            resultDiv.innerHTML += `<div class="result-summary"><h2>Результаты расчета</h2><p>Общая переплата по кредиту: ${totalOverpayment.toFixed(2)} ₽</p></div>`;
        }

        // Показываем кнопку для отображения детальной таблицы
        showDetailsButton.style.display = 'block';

        // Отображаем график
        displayChart(schedule);
    });

    // Функция валидации данных
    function validateInputs(calculationType, loanAmount, interestRate, loanTerm, monthlyPayment, period) {
        const errors = [];
        if (isNaN(loanAmount) || loanAmount <= 0) {
            errors.push('Сумма кредита должна быть положительным числом.');
        }
        if (isNaN(interestRate) || interestRate <= 0) {
            errors.push('Процентная ставка должна быть положительным числом.');
        }
        if ((calculationType !== 'loan-term') && (isNaN(loanTerm) || loanTerm <= 0)) {
            errors.push('Срок кредита должен быть положительным числом.');
        }
        if ((calculationType === 'loan-term') && (isNaN(monthlyPayment) || monthlyPayment <= 0)) {
            errors.push('Ежемесячный платёж должен быть положительным числом.');
        }
        if ((calculationType === 'remaining-balance') && (isNaN(period) || period <= 0)) {
            errors.push('Период должен быть положительным числом.');
        }

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return false;
        }
        return true;
    }

    // Функция расчета ежемесячного платежа
    function calculateMonthlyPayment(loanAmount, interestRate, loanTerm, loanType) {
        const monthlyRate = interestRate / 12;
        const numberOfPayments = loanTerm * 12;
        let monthlyPayment = 0;

        if (loanType === 'annuity') {
            monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
        } else if (loanType === 'differentiated') {
            monthlyPayment = (loanAmount / numberOfPayments) + (loanAmount * monthlyRate);
        }

        return monthlyPayment;
    }

    // Функция расчета срока кредита
    function calculateLoanTerm(loanAmount, interestRate, monthlyPayment, loanType) {
        const monthlyRate = interestRate / 12;
        let n = 0;

        if (loanType === 'annuity') {
            n = Math.log(monthlyPayment / (monthlyPayment - loanAmount * monthlyRate)) / Math.log(1 + monthlyRate);
        } else if (loanType === 'differentiated') {
            const principalPayment = loanAmount / (monthlyPayment - loanAmount * monthlyRate);
            n = principalPayment;
        }

        const years = Math.floor(n / 12);
        const months = Math.ceil(n % 12);
        return { years: years, months: months, totalYears: n / 12 };
    }

    // Функция генерации графика амортизации
    function generateAmortizationSchedule(loanAmount, interestRate, loanTerm, monthlyPayment, loanType, startDate, annualExtraPayment, maxPeriod) {
        const monthlyRate = interestRate / 12;
        let remainingBalance = loanAmount;
        let paymentDate = new Date(startDate);
        schedule = [];

        const totalPayments = loanTerm * 12;

        for (let i = 1; i <= totalPayments; i++) {
            let interestPayment = remainingBalance * monthlyRate;
            let principalPayment;

            if (loanType === 'annuity') {
                principalPayment = monthlyPayment - interestPayment;
            } else if (loanType === 'differentiated') {
                principalPayment = loanAmount / totalPayments;
                monthlyPayment = principalPayment + interestPayment;
            }

            // Ежегодные дополнительные платежи
            if (annualExtraPayment > 0 && i % 12 === 0) {
                principalPayment += annualExtraPayment;
            }

            remainingBalance -= principalPayment;

            schedule.push({
                paymentNumber: i,
                paymentDate: new Date(paymentDate),
                paymentAmount: monthlyPayment,
                principalPayment: principalPayment,
                interestPayment: interestPayment,
                remainingBalance: remainingBalance > 0 ? remainingBalance : 0
            });

            paymentDate.setMonth(paymentDate.getMonth() + 1);
            if (remainingBalance <= 0) break;
            if (maxPeriod && i >= maxPeriod) break;
        }
    }

    // Функция отображения графика
    function displayChart(schedule) {
        const ctx = chartCanvas.getContext('2d');
        const labels = schedule.map(payment => payment.paymentNumber);
        const data = schedule.map(payment => payment.remainingBalance);

        if (balanceChart) {
            balanceChart.destroy();
        }

        balanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Остаток задолженности',
                    data: data,
                    borderColor: 'rgba(52, 152, 219, 1)',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Номер платежа'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Сумма (₽)'
                        }
                    }
                }
            }
        });
    }

    // Обработчик кнопки показа детальной таблицы
    showDetailsButton.addEventListener('click', function() {
        if (schedule.length === 0) {
            alert('Нет данных для отображения. Пожалуйста, сначала выполните расчет.');
            return;
        }

        let detailedTable = document.createElement('table');
        detailedTable.className = 'detailed-table';
        let headerRow = document.createElement('tr');
        const headers = ['№ платежа', 'Дата платежа', 'Платеж (₽)', 'Основной долг (₽)', 'Проценты (₽)', 'Остаток долга (₽)'];
        headers.forEach(headerText => {
            let header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
        });
        detailedTable.appendChild(headerRow);

        // Заполнение таблицы
        schedule.forEach(payment => {
            let row = document.createElement('tr');
            row.innerHTML = `
                <td>${payment.paymentNumber}</td>
                <td>${payment.paymentDate.toLocaleDateString()}</td>
                <td>${payment.paymentAmount.toFixed(2)}</td>
                <td>${payment.principalPayment.toFixed(2)}</td>
                <td>${payment.interestPayment.toFixed(2)}</td>
                <td>${payment.remainingBalance.toFixed(2)}</td>
            `;
            detailedTable.appendChild(row);
        });

        // Очищаем предыдущие результаты и добавляем таблицу
        resultDiv.innerHTML = '';
        resultDiv.appendChild(detailedTable);
    });

    // Экспорт в PDF
    exportPDFButton.addEventListener('click', function() {
        if (schedule.length === 0) {
            alert('Нет данных для экспорта. Пожалуйста, сначала выполните расчет.');
            return;
        }

        const doc = new jsPDF.jsPDF();
        doc.setFontSize(16);
        doc.text('График платежей', 14, 20);

        const data = schedule.map(payment => [
            payment.paymentNumber,
            payment.paymentDate.toLocaleDateString(),
            payment.paymentAmount.toFixed(2),
            payment.principalPayment.toFixed(2),
            payment.interestPayment.toFixed(2),
            payment.remainingBalance.toFixed(2)
        ]);

        doc.autoTable({
            head: [['№ платежа', 'Дата платежа', 'Платеж (₽)', 'Основной долг (₽)', 'Проценты (₽)', 'Остаток долга (₽)']],
            body: data,
            startY: 30,
            styles: {
                fontSize: 8
            },
            headStyles: {
                fillColor: [52, 152, 219]
            }
        });

        doc.save('amortization-schedule.pdf');
    });

    // Экспорт в Excel
    exportExcelButton.addEventListener('click', function() {
        if (schedule.length === 0) {
            alert('Нет данных для экспорта. Пожалуйста, сначала выполните расчет.');
            return;
        }

        const ws_data = [
            ['№ платежа', 'Дата платежа', 'Платеж (₽)', 'Основной долг (₽)', 'Проценты (₽)', 'Остаток долга (₽)'],
            ...schedule.map(payment => [
                payment.paymentNumber,
                payment.paymentDate.toLocaleDateString(),
                payment.paymentAmount,
                payment.principalPayment,
                payment.interestPayment,
                payment.remainingBalance
            ])
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        XLSX.utils.book_append_sheet(wb, ws, 'График платежей');
        XLSX.writeFile(wb, 'amortization-schedule.xlsx');
    });
});
