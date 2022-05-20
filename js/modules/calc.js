function calc() {
    // Calculator calories

    const result = document.querySelector('.calculating__result span');

    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {      //если в лок.хран. есть пол, то используй пол, иначе пол - женский
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {      //если в лок.хран. есть ратио, то используй ратио, иначе ратио равно 1,375
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function initLocalSettings(selector, activeClass) { //функция по тому, чтобы выделенными были те настройки, которые лежат в лок.хран.
        const elements = document.querySelectorAll(selector);   //по селектору находим все элементы

        elements.forEach(elem => {      //перебираем все элементы
            elem.classList.remove(activeClass);     //удаляем у всех элементов класс активности

            if (elem.getAttribute('id') === localStorage.getItem('sex')) {  //если элемент пола равен элементу пола в лок.хран., то добавляем класс активности
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {    //если элемент ратио равен элементу ратио в лок.хран., то добавляем класс активности
                elem.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active'); //запустили функцию по полу из лок.хран. - в селекторе добавлен див
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active'); //запустили функцию по ратио из лок.хран. - в селекторе добавлен див

    function calcTotal() {      //делаем функцию расчета
        if (!sex || !height || !weight || !age || !ratio) {   //если какого-то из значений нет
            result.textContent = '____';
            return; // досрочно завершили функцию при отсутствии одного из значений
        }

        if (sex === 'female') { //разные формулы для разного пола
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        } else {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        }
    }

    calcTotal();    //вызываем функцию изначально, чтобы показало, что не все заполнено
    
    function getStaticInformation(selector, activeClass) {    //функция по получению стат.информации; аргументы - селектор и класс активности
        const elements = document.querySelectorAll(selector);    //получили элемент через селектор
    
        elements.forEach(elem => {      //перебираем все элементы и на каждый из элементов вешаем обработчик события
            elem.addEventListener('click', (e) => {
                if(e.target.getAttribute('data-ratio')) {   //если объект события имеет атрибут
                    ratio = +e.target.getAttribute('data-ratio');   //то приравниваем ратио значению этого атрибута
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio')); //при клике на ратио запоминается кликнутое значение
                } else {
                    sex = e.target.getAttribute('id');  //иначе срабатывает блок с полом и получаем значение идентификатора пола
                    localStorage.setItem('sex', e.target.getAttribute('id')); //при клике на пол запоминается кликнутое значение
                }
    
                elements.forEach(elem => {                  //перебрали все элементы и убрали класс активности нажатия
                    elem.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass);    //по тому элементу, по которому кликнули - добавили класс активности
                
                calcTotal();        //пересчитали при каждом клике
            });   
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active'); //запустили функцию изначально по полу - в селекторе добавлен див
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');    //запустили функцию изначально по активности- в селекторе добавлен див
    
    function getDynamicInformation(selector) {
        const input = document.querySelector(selector); //получаем инпут

        input.addEventListener('input', () => { //при вводе обработчиком событий собираем

            if (input.value.match(/\D/g)) { //если пользователь вводит "не число" (через регулярное выражение)
                input.style.border = '1px solid red';   //красим границу инпута в красный
            } else {
                input.style.border = 'none';    //а если все ок,то не делаем этого
            }

            switch(input.getAttribute('id')) {  //условие свитч, если имеет атрибут id равный:
                case "height":
                    height = +input.value;  //если айди равен росту, то вес равен введенному значению и т.д.
                    break;
                case "weight":
                    weight = +input.value;
                    break;
                case "age":
                    age = +input.value;
                    break;
            }

            calcTotal();    //пересчитали при каждом вводе
        });
    }

    getDynamicInformation('#height');   //вызываем функцию роста
    getDynamicInformation('#weight');   //вызываем функцию веса
    getDynamicInformation('#age');      //вызываем функцию возраста
}

export default calc;