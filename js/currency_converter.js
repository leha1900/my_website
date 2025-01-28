// Объект валют с полными названиями и флагами
const currencyData = {
  USD: { flag: 'us', name: 'Доллар США' },
  RUB: { flag: 'ru', name: 'Российский рубль' },
  EUR: { flag: 'eu', name: 'Евро' },
  GBP: { flag: 'gb', name: 'Фунт стерлингов' },
  JPY: { flag: 'jp', name: 'Японская йена' },
  CAD: { flag: 'ca', name: 'Канадский доллар' },
  AUD: { flag: 'au', name: 'Австралийский доллар' },
  CHF: { flag: 'ch', name: 'Швейцарский франк' },
  CNY: { flag: 'cn', name: 'Китайский юань' },
  TRY: { flag: 'tr', name: 'Турецкая лира' },
  SEK: { flag: 'se', name: 'Шведская крона' },
  NOK: { flag: 'no', name: 'Норвежская крона' },
  DKK: { flag: 'dk', name: 'Датская крона' },
  PLN: { flag: 'pl', name: 'Польский злотый' },
  CZK: { flag: 'cz', name: 'Чешская крона' },
  INR: { flag: 'in', name: 'Индийская рупия' },
  BRL: { flag: 'br', name: 'Бразильский реал' },
  SGD: { flag: 'sg', name: 'Сингапурский доллар' },
  HKD: { flag: 'hk', name: 'Гонконгский доллар' },
  KRW: { flag: 'kr', name: 'Южнокорейская вона' },
  MXN: { flag: 'mx', name: 'Мексиканский песо' },
  MYR: { flag: 'my', name: 'Малайзийский ринггит' },
  NZD: { flag: 'nz', name: 'Новозеландский доллар' },
  THB: { flag: 'th', name: 'Тайский бат' },
  ZAR: { flag: 'za', name: 'Южноафриканский рэнд' }
};

const currencies = Object.keys(currencyData);

// DOM элементы
const fromCurrencyEl = document.getElementById('fromCurrency');
const toCurrencyEl = document.getElementById('toCurrency');
const fromFlagEl = document.getElementById('fromFlag');
const toFlagEl = document.getElementById('toFlag');
const amountEl = document.getElementById('amount');
const resultEl = document.getElementById('result');
const swapBtn = document.getElementById('swapBtn');
const historyList = document.getElementById('historyList');
const searchInputs = document.querySelectorAll('.currency-search');

// Переменные
let currentRates = {};
let historyData = [];
let currencyChart;

// Кэш для курсов
const ratesCache = {};
const API_KEY = 'a1380ab21aa8695e72774fd6'; // Вставьте сюда ваш API-ключ
const CACHE_TTL = 30 * 60 * 1000; // 30 минут

// Проверка валидности кэша
function isCacheValid(base) {
  return ratesCache[base] && (Date.now() - ratesCache[base].timestamp) < CACHE_TTL;
}

// Инициализация
(async function init() {
  populateSelects();
  loadStateFromLocalStorage();
  updateFlags();
  await fetchRatesForBase(fromCurrencyEl.value);
  convert();
  await renderChart(fromCurrencyEl.value, toCurrencyEl.value);
})();

// Загрузка состояния из LocalStorage
function loadStateFromLocalStorage() {
  const savedFrom = localStorage.getItem('fromCurrency');
  const savedTo = localStorage.getItem('toCurrency');
  const savedAmount = localStorage.getItem('amount');
  const savedHistory = JSON.parse(localStorage.getItem('historyData')) || [];

  if (savedFrom && currencies.includes(savedFrom)) fromCurrencyEl.value = savedFrom;
  else fromCurrencyEl.value = 'USD';

  if (savedTo && currencies.includes(savedTo)) toCurrencyEl.value = savedTo;
  else toCurrencyEl.value = 'RUB';

  if (savedAmount && !isNaN(parseFloat(savedAmount))) amountEl.value = savedAmount;
  else amountEl.value = '1';

  historyData = savedHistory;
  updateHistoryUI();
}

// Сохранение состояния в LocalStorage
function saveStateToLocalStorage() {
  localStorage.setItem('fromCurrency', fromCurrencyEl.value);
  localStorage.setItem('toCurrency', toCurrencyEl.value);
  localStorage.setItem('amount', amountEl.value);
  localStorage.setItem('historyData', JSON.stringify(historyData));
}

// Заполнение селектов валютами
function populateSelects() {
  fromCurrencyEl.innerHTML = '';
  toCurrencyEl.innerHTML = '';
  
  currencies.forEach(cur => {
    const optFrom = document.createElement('option');
    optFrom.value = cur;
    optFrom.textContent = `${cur} - ${currencyData[cur].name}`;
    fromCurrencyEl.appendChild(optFrom);

    const optTo = document.createElement('option');
    optTo.value = cur;
    optTo.textContent = `${cur} - ${currencyData[cur].name}`;
    toCurrencyEl.appendChild(optTo);
  });
}

// Обновление флагов
function updateFlags() {
  fromFlagEl.className = `converter-flag fi fi-${currencyData[fromCurrencyEl.value].flag}`;
  toFlagEl.className = `converter-flag fi fi-${currencyData[toCurrencyEl.value].flag}`;
}

// Загрузка курсов валют
async function fetchRatesForBase(base) {
  if (isCacheValid(base)) {
    currentRates = ratesCache[base].rates;
    return;
  }

  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);
    const data = await res.json();
    if (data.result === "success") {
      currentRates = data.conversion_rates;
      ratesCache[base] = {
        rates: currentRates,
        timestamp: Date.now()
      };
    } else {
      console.error('Не удалось получить курсы валют', data);
      currentRates = {};
      resultEl.textContent = "Ошибка при загрузке курсов.";
    }
  } catch (error) {
    console.error('Ошибка сети или проблемы с API', error);
    currentRates = {};
    resultEl.textContent = "Ошибка при загрузке курсов. Проверьте соединение.";
  }
}

// Конвертация валют
async function convert() {
  let from = fromCurrencyEl.value;
  let to = toCurrencyEl.value;
  let amount = parseFloat(amountEl.value) || 0;

  if (amount < 0) {
    amount = Math.abs(amount);
    amountEl.value = amount;
  }

  if (!currentRates[from]) {
    await fetchRatesForBase(from);
  }

  if (Object.keys(currentRates).length === 0) {
    resultEl.textContent = "Нет данных для конвертации.";
    return;
  }

  const rate = currentRates[to];
  const converted = amount * rate;
  resultEl.textContent = `Результат: ${converted.toLocaleString('ru-RU', { style: 'decimal', maximumFractionDigits: 2 })} ${to}`;
  addToHistory(from, to, amount, converted);
  saveStateToLocalStorage();
}

// Добавление записи в историю
function addToHistory(from, to, amount, converted) {
  const timestamp = new Date().toLocaleString();
  const entry = `${timestamp}: ${amount.toLocaleString('ru-RU', { style: 'decimal', maximumFractionDigits: 2 })} ${from} → ${converted.toLocaleString('ru-RU', { style: 'decimal', maximumFractionDigits: 2 })} ${to}`;
  historyData.push(entry);
  updateHistoryUI();
}

// Обновление истории на странице
function updateHistoryUI() {
  historyList.innerHTML = '';
  const recentHistory = historyData.slice(-10);
  recentHistory.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    historyList.appendChild(li);
  });
}

// Рендер графика
async function renderChart(base, target) {
  const ctx = document.getElementById('currencyChart').getContext('2d');
  const historicalRates = await fetchHistoricalRates(base, target, 30);

  if (!historicalRates) {
    console.error("Нет данных для графика");
    return;
  }

  const labels = Object.keys(historicalRates).sort();
  const data = labels.map(date => historicalRates[date][target]);

  console.log("Данные для графика:", { labels, data }); // Отладка

  if (currencyChart) currencyChart.destroy();

  currencyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${base} to ${target}`,
        data,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        borderWidth: 2,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true, title: { display: true, text: 'Дата' } },
        y: { display: true, title: { display: true, text: 'Курс' } }
      }
    }
  });
}

// Загрузка исторических данных
async function fetchHistoricalRates(base, target, days = 30) {
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/history/${base}/${days}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);
    const data = await res.json();
    if (data.result === "success") {
      return data.conversion_rates;
    } else {
      console.error('Не удалось получить исторические данные', data);
      return null;
    }
  } catch (error) {
    console.error('Ошибка при загрузке исторических данных', error);
    return null;
  }
}

// События
fromCurrencyEl.addEventListener('change', async () => {
  updateFlags();
  await fetchRatesForBase(fromCurrencyEl.value);
  convert();
  await renderChart(fromCurrencyEl.value, toCurrencyEl.value);
});

toCurrencyEl.addEventListener('change', () => {
  updateFlags();
  convert();
  renderChart(fromCurrencyEl.value, toCurrencyEl.value);
});

amountEl.addEventListener('input', convert);

swapBtn.addEventListener('click', async () => {
  const temp = fromCurrencyEl.value;
  fromCurrencyEl.value = toCurrencyEl.value;
  toCurrencyEl.value = temp;
  updateFlags();
  await fetchRatesForBase(fromCurrencyEl.value);
  convert();
  await renderChart(fromCurrencyEl.value, toCurrencyEl.value);
});

searchInputs.forEach(input => {
  input.addEventListener('input', () => {
    const targetSelectId = input.dataset.target;
    filterCurrencies(input, targetSelectId);
  });
});

// Фильтрация валют
function filterCurrencies(searchInput, targetSelectId) {
  const query = searchInput.value.toLowerCase().trim();
  const targetSelect = document.getElementById(targetSelectId);

  targetSelect.innerHTML = '';

  const filtered = currencies.filter(cur => {
    const fullName = currencyData[cur].name.toLowerCase();
    return cur.toLowerCase().includes(query) || fullName.includes(query);
  });

  filtered.forEach(cur => {
    const opt = document.createElement('option');
    opt.value = cur;
    opt.textContent = `${cur} - ${currencyData[cur].name}`;
    targetSelect.appendChild(opt);
  });

  if (!filtered.includes(targetSelect.value) && filtered.length > 0) {
    targetSelect.value = filtered[0];
  }

  updateFlags();
  convert();
}