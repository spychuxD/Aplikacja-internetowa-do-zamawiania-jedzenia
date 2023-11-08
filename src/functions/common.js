import axios from "axios";

// function responseAlert (response, title = 'Błąd podczas pobierania danych') {
//     let text = ''
//     for (let i in response.data) {
//         text += response.data[i] + '\n'
//     }
//     Vue.swal({
//         type: 'warning',
//         title: store.state.i18n.t(title),
//         showConfirmButton: false,
//         timer: 3000
//     })
// }

export async function register(email, password){
    const response = await axios.post('http://localhost:8000/registration', {
        email: email,
        password: password
    })
    if(response.status === 201) {
        return 0;
    } else {
        return -1
    }

}


export async function login(email, password){
    try {
        const loginCheck = await axios.post('http://localhost:8000/api/login_check', {
            username: email,
            password: password
        });

        if (loginCheck.data.token) {
            return loginCheck.data.token;
        } else {
            return -1;
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            return -1;
        } else {
            return -1;
        }
    }
}

export async function getImg(name, img, token) {
    let response
    if(name === 'restaurant' && img !== null) {
        if(token === null) {
            token = await axios.post('http://localhost:8000/api/login_check', {
                username: 'root@root',
                password: 'root'
            });
        }
        response = await axios.get('http://localhost:8000/api/public/restaurant/img/' + img, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
    if (response.status === 200) {
        if (response.data.length > 0 || typeof response.data === 'object') {
            // return response.data;
            console.log(response)
        }
    } else  {
        console.log(response)
    }
}
export async function getListItemsOrItem(name, id = 0, token) {
    let response
    if(name === 'restaurants' && id === 0) {
        if(token === null) {
            token = await axios.post('http://localhost:8000/api/login_check', {
                username: 'root@root',
                password: 'root'
            });
        }
        response = await axios.get('http://localhost:8000/api/public/restaurants', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } else if (name === 'restaurant' && id > 0) {
        if(token === null) {
            token = await axios.post('http://localhost:8000/api/login_check', {
                username: 'root@root',
                password: 'root'
            });
        }
        response = await axios.get('http://localhost:8000/api/public/restaurant/' + id, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } else if (name === 'dishes' && id > 0) {
        response = await axios.get('http://localhost:8000/dishes/' + id)
    } else if (name === 'dishingridients/dish' && id > 0) {
        response = await axios.get('http://localhost:8000/dishingridients/dish/' + id)
    }

    if (response.status === 200) {
        if (response.data.length > 0 || typeof response.data === 'object') {
            return response.data;
        }
    } else  {
        return 0;
    }
}