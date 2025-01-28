document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate-button');
    const resultsDiv = document.getElementById('results');

    // Объект с коэффициентами утилизационного сбора
    const coefficients = {
        'car': {
            'new': {
                'domestic': [
                    { maxVolume: 1000, coefficient: 0.17 },
                    { maxVolume: 2000, coefficient: 0.26 },
                    { maxVolume: 3000, coefficient: 0.45 },
                    { maxVolume: Infinity, coefficient: 0.60 }
                ],
                'imported': [
                    { maxVolume: 1000, coefficient: 0.20 },
                    { maxVolume: 2000, coefficient: 0.35 },
                    { maxVolume: 3000, coefficient: 0.55 },
                    { maxVolume: Infinity, coefficient: 0.75 }
                ]
            },
            'used': {
                'domestic': [
                    { maxVolume: 1000, coefficient: 1.34 },
                    { maxVolume: 2000, coefficient: 2.02 },
                    { maxVolume: 3000, coefficient: 3.47 },
                    { maxVolume: Infinity, coefficient: 5.50 }
                ],
                'imported': [
                    { maxVolume: 1000, coefficient: 1.80 },
                    { maxVolume: 2000, coefficient: 2.70 },
                    { maxVolume: 3000, coefficient: 4.20 },
                    { maxVolume: Infinity, coefficient: 6.50 }
                ]
            }
        },
        'truck': {
            'new': {
                'domestic': [
                    { maxVolume: 2500, coefficient: 0.60 },
                    { maxVolume: Infinity, coefficient: 1.10 }
                ],
                'imported': [
                    { maxVolume: 2500, coefficient: 0.80 },
                    { maxVolume: Infinity, coefficient: 1.40 }
                ]
            },
            'used': {
                'domestic': [
                    { maxVolume: 2500, coefficient: 2.80 },
                    { maxVolume: Infinity, coefficient: 5.20 }
                ],
                'imported': [
                    { maxVolume: 2500, coefficient: 3.50 },
                    { maxVolume: Infinity, coefficient: 6.00 }
                ]
            }
        },
        'special': {
            'new': {
                'domestic': [
                    { maxVolume: 2500, coefficient: 0.60 },
                    { maxVolume: Infinity, coefficient: 1.10 }
                ],
                'imported': [
                    { maxVolume: 2500, coefficient: 0.80 },
                    { maxVolume: Infinity, coefficient: 1.40 }
                ]
            },
            'used': {
                'domestic': [
                    { maxVolume: 2500, coefficient: 2.80 },
                    { maxVolume: Infinity, coefficient: 5.20 }
                ],
                'imported': [
                    { maxVolume: 2500, coefficient: 3.50 },
                    { maxVolume: Infinity, coefficient: 6.00 }
                ]
            }
        },
        'moto': {
            'new': {
                'domestic': [
                    { maxVolume: 500, coefficient: 0.30 },
                    { maxVolume: Infinity, coefficient: 0.50 }
                ],
                'imported': [
                    { maxVolume: 500, coefficient: 0.40 },
                    { maxVolume: Infinity, coefficient: 0.70 }
                ]
            },
            'used': {
                'domestic': [
                    { maxVolume: 500, coefficient: 0.30 },
                    { maxVolume: Infinity, coefficient: 0.50 }
                ],
                'imported': [
                    { maxVolume: 500, coefficient: 0.40 },
                    { maxVolume: Infinity, coefficient: 0.70 }
                ]
            }
        }
    };

    calculateButton.addEventListener('click', function() {
        // Получаем значения, введенные пользователем
        const vehicleCategory = document.getElementById('vehicle-category').value;
        const vehicleAge = document.getElementById('vehicle-age').value;
        const vehicleOrigin = document.getElementById('vehicle-origin').value;
        const engineVolume = parseFloat(document.getElementById('engine-volume').value);

        // Валидация данных
        if (isNaN(engineVolume) || engineVolume <= 0) {
            resultsDiv.innerHTML = '<p class="error">Пожалуйста, введите корректный объем двигателя.</p>';
            return;
        }

        // Проверка наличия данных в объекте коэффициентов
        if (!coefficients[vehicleCategory] || !coefficients[vehicleCategory][vehicleAge] || !coefficients[vehicleCategory][vehicleAge][vehicleOrigin]) {
            resultsDiv.innerHTML = '<p class="error">Недостаточно данных для расчета. Пожалуйста, проверьте введенные параметры.</p>';
            return;
        }

        // Поиск соответствующего коэффициента
        let coefficient = 0;
        const categories = coefficients[vehicleCategory][vehicleAge][vehicleOrigin];
        for (let i = 0; i < categories.length; i++) {
            if (engineVolume <= categories[i].maxVolume) {
                coefficient = categories[i].coefficient;
                break;
            }
        }

        // Получение базовой ставки
        let baseRate = 0;
        if (vehicleCategory === 'car') {
            baseRate = 20000;
        } else if (vehicleCategory === 'truck' || vehicleCategory === 'special') {
            baseRate = 150000;
        } else if (vehicleCategory === 'moto') {
            baseRate = 10000;
        }

        // Расчет утилизационного сбора
        const utilizationFee = baseRate * coefficient;

        // Отображение результатов
        resultsDiv.innerHTML = `
            <div class="result-summary">
                <h2>Результаты расчета</h2>
                <p><strong>Общая сумма утилизационного сбора: ${utilizationFee.toFixed(2)} ₽</strong></p>
            </div>
        `;
    });
});
