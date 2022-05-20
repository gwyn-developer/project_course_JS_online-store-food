const postData = async (url, data) => { //обертываем в функцию отправку данных и добавляем async для того, чтобы внутри сделать асинхронный код
    const res = await fetch(url, {      //добавляем await чтобы дождаться этой операции
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: data,
    });

    return await res.json();    //возвращаем json формат когда получим данные, добавляем await чтобы дождаться этой операции
};

const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) { 
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);  //выкидываем ошибку
    }

    return await res.json();
};

export {postData};
export {getResource};