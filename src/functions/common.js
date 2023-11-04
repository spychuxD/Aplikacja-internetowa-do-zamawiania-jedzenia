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
    const loginCheck = await axios.post('http://localhost:8000/api/login_check', {
        username: email,
        password: password
    })
    if(loginCheck.data.token) {
        return loginCheck.data.token
    } else {
        return -1
    }
}


export async function getListItemsOrItem(name, id = 0, token) {
    let response
    if(token){
        if(name === 'restaurants' && id === 0) {
            response = await axios.get('http://localhost:8000/api/restaurants', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } else if (name === 'restaurant' && id > 0) {
            response = await axios.get('http://localhost:8000/restaurant/' + id)
        } else if (name === 'dishes' && id > 0) {
            response = await axios.get('http://localhost:8000/dishes/' + id)
        } else if (name === 'dishingridients/dish' && id > 0) {
            response = await axios.get('http://localhost:8000/dishingridients/dish/' + id)
        }

        if (response.status === 200) {
            if (response.data.length > 0 || typeof response.data === 'object') {
                return response.data;
            }
        } else if (response.status === 207) {
            return 0;
        }
    }
}