import os

# Получаем путь к текущей директории (где находится скрипт)
project_dir = os.path.dirname(os.path.abspath(__file__))

# Функция для обновления путей в HTML-файлах
def update_paths(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Обновляем пути к CSS
    content = content.replace('href="style.css"', 'href="css/style.css"')
    
    # Обновляем пути к JavaScript
    content = content.replace('src="utilization_fee_calculator.js"', 'src="js/utilization_fee_calculator.js"')
    content = content.replace('src="menu.js"', 'src="js/menu.js"')
    
    # Обновляем путь к navbar.html в menu.js
    content = content.replace('fetch("navbar.html")', 'fetch("partials/navbar.html")')
    
    # Сохраняем изменения обратно в файл
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)

# Проходим по всем файлам в проекте
for root, dirs, files in os.walk(project_dir):
    for file in files:
        if file.endswith('.html'):
            file_path = os.path.join(root, file)
            update_paths(file_path)

print("Пути обновлены успешно.")

