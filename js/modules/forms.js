import {closeModal, openModal} from './modal';
import {postData} from '../services/services';

function forms(formSelector, modalTimerId) {
    //Скрипт отправки данных - Forms

    const forms = document.querySelectorAll(formSelector); //запрос всех форм

    const message = {
      //создаем объект для показа юзеру при отправке данных
      loading: "img/form/spinner.svg", //различные варианты сообщения-статуса при отправке на все случаи
      success: "Спасибо! Скоро мы с вами свяжемся",
      failure: "Что-то пошло не так...",
    };
  
    forms.forEach((item) => {
      //перебираем все формы и подвязываем на каждую форму функцию postData
      bindPostData(item);
    });


  
    function bindPostData(form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault(); //отменяем стандартное поведение сервера для AJAX запросов обязательно!!!
  
        const statusMessage = document.createElement("img"); //создаем див для сообщения-статуса
        statusMessage.src = message.loading; //добавляем атрибут src
        statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
        `; //добавляем стили
        //form.append(statusMessage); //удалили для того чтобы во второй форме нормально работал спиннер
        form.insertAdjacentElement('afterend', statusMessage);//в конец Формы добавляем див сообщения-статуса
  
        const formData = new FormData(form); //создаем переменную, внутри конструктор, внутри которого помещ-ся форма из которой собираем данные
  
        const json = JSON.stringify(Object.fromEntries(formData.entries())); //все что упало в формдата превращаем в массив массивов, потом превращаем в клас.объект, а после в формат данных json
         
        postData(' http://localhost:3000/requests', json)
        .then(data => {   //воспользовались промисом
            console.log(data);
            showThanksModal(message.success); //заполняем див сообщением Успешно
            statusMessage.remove(); //убрали сеттаймаут 
        }).catch(() => {
            showThanksModal(message.failure); //заполняем див сообщением Ошибка
        }).finally(() => {
            form.reset(); //очищаем форму, для того, чтобы не показывало сообщения
        });
      });
    }

        // в input в верстке нужно чтобы всегда был атрибут name!!! всегда проверяем у форм!!!
        //request.send(json); //отправляем данные, при отправке обычных данных - формДата, при JSON - json

    function showThanksModal (message) {   //создаем функцию по созданию нового м.окна Спасибо
        const prevModalDialog = document.querySelector('.modal__dialog'); //получаем старое модальное окно

        prevModalDialog.classList.add('hide'); //скрываем старое м.окно
        openModal('.modal', modalTimerId);    //вызываем функцию открытия м.окна

        const thanksModal = document.createElement('div'); //создаем обертку для нового контента
        thanksModal.classList.add('modal__dialog'); //добавляем класс как у изначального м.окна
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>&times;</div> 
            <div class="modal__title">${message}</div>
        </div>
        `; //наполняем див информацией с помощью верстки: общий див, крестик закрытия и заголовок

        document.querySelector('.modal').append(thanksModal); //добавляем в мод.окно наш див
        setTimeout(() => {  //через время убираем нов.м.окно и возвращаем старое
            thanksModal.remove();   //удаляем н.мод.окно
            prevModalDialog.classList.add('show');  //показываем пред.мод.окно
            prevModalDialog.classList.remove('hide');
            closeModal('.modal');   //закрываем мод.окно
        }, 4000);
    }
}

export default forms;