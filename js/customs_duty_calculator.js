document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.getElementById('calculate-button');
    const resultsDiv = document.getElementById('results');

    calculateButton.addEventListener('click', function() {
        // Получаем значения, введенные пользователем
        const vehicleType = document.getElementById('vehicle-type').value;
        const vehicleAge = document.getElementById('vehicle-age').value;
        const engineVolume = parseFloat(document.getElementById('engine-volume').value);
        const vehiclePrice = parseFloat(document.getElementById('vehicle-price').value);
        const fuelType = document.getElementById('fuel-type').value;

        // Валидация данных
        if (isNaN(engineVolume) || isNaN(vehiclePrice)) {
            resultsDiv.innerHTML = '<p class="error">Пожалуйста, заполните все поля правильно.</p>';
            return;
        }

        // Расчет растаможки
        let duty = calculateCustomsDuty(vehicleType, vehicleAge, engineVolume, vehiclePrice, fuelType);

        // Отображение результатов
        resultsDiv.innerHTML = `
            <div class="result-summary">
                <h2>Результаты расчета</h2>
                <p><strong>Общая стоимость растаможки: ${duty.toFixed(2)} евро</strong></p>
            </div>
        `;
    });

    function calculateCustomsDuty(vehicleType, vehicleAge, engineVolume, vehiclePrice, fuelType) {
        let dutyRate = 0;
        let engineFee = 0;

        // Определяем базовую ставку в зависимости от типа транспортного средства и возраста
        if (vehicleType === 'car') {
            if (vehicleAge === 'new') {
                dutyRate = 0.2; // 20% для новых легковых автомобилей
            } else if (vehicleAge === '3-5') {
                dutyRate = 0.25; // 25% для автомобилей от 3 до 5 лет
            } else {
                dutyRate = 0.3; // 30% для автомобилей старше 5 лет
            }

            // Дополнительные сборы в зависимости от объема двигателя и типа топлива
            engineFee = calculateEngineFee(engineVolume, fuelType, vehicleType);
        } else if (vehicleType === 'truck') {
            // Для грузовиков используются более высокие ставки
            if (vehicleAge === 'new') {
                dutyRate = 0.3; // 30% для новых грузовиков
            } else if (vehicleAge === '3-5') {
                dutyRate = 0.35; // 35% для грузовиков от 3 до 5 лет
            } else {
                dutyRate = 0.4; // 40% для грузовиков старше 5 лет
            }

            // Для грузовиков сбор за объем двигателя больше
            engineFee = calculateEngineFee(engineVolume, fuelType, vehicleType);
        } else if (vehicleType === 'moto') {
            // Для мотоциклов используется единая ставка
            dutyRate = 0.15; // 15% для мотоциклов
            engineFee = calculateEngineFee(engineVolume, fuelType, vehicleType);
        }

        // Общая стоимость растаможки
        const duty = vehiclePrice * dutyRate + engineFee;
        return duty;
    }

    // Вспомогательная функция для расчета сбора в зависимости от объема двигателя и типа топлива
    function calculateEngineFee(engineVolume, fuelType, vehicleType) {
        let engineFee = 0;

        if (vehicleType === 'car') {
            // Сбор за объем двигателя для легковых автомобилей
            if (fuelType === 'petrol') {
                if (engineVolume <= 1000) {
                    engineFee = engineVolume * 0.5; // 0.5 евро за см³ для бензина до 1000 см³
                } else if (engineVolume <= 2000) {
                    engineFee = engineVolume * 0.75; // 0.75 евро за см³ для бензина до 2000 см³
                } else {
                    engineFee = engineVolume * 1.0; // 1 евро за см³ для бензина свыше 2000 см³
                }
            } else if (fuelType === 'diesel') {
                if (engineVolume <= 1000) {
                    engineFee = engineVolume * 0.6; // 0.6 евро за см³ для дизеля до 1000 см³
                } else if (engineVolume <= 2000) {
                    engineFee = engineVolume * 0.85; // 0.85 евро за см³ для дизеля до 2000 см³
                } else {
                    engineFee = engineVolume * 1.2; // 1.2 евро за см³ для дизеля свыше 2000 см³
                }
            }
        } else if (vehicleType === 'truck') {
            // Сбор за объем двигателя для грузовиков
            if (fuelType === 'petrol') {
                if (engineVolume <= 2000) {
                    engineFee = engineVolume * 1.5; // 1.5 евро за см³ для бензиновых грузовиков до 2000 см³
                } else {
                    engineFee = engineVolume * 2.0; // 2 евро за см³ для бензиновых грузовиков свыше 2000 см³
                }
            } else if (fuelType === 'diesel') {
                if (engineVolume <= 2000) {
                    engineFee = engineVolume * 2.0; // 2 евро за см³ для дизельных грузовиков до 2000 см³
                } else {
                    engineFee = engineVolume * 2.5; // 2.5 евро за см³ для дизельных грузовиков свыше 2000 см³
                }
            }
        } else if (vehicleType === 'moto') {
            // Сбор за объем двигателя для мотоциклов (упрощенно)
            if (engineVolume <= 500) {
                engineFee = engineVolume * 0.3; // 0.3 евро за см³ для мотоциклов до 500 см³
            } else {
                engineFee = engineVolume * 0.5; // 0.5 евро за см³ для мотоциклов свыше 500 см³
            }
        }

        return engineFee;
    }
});




