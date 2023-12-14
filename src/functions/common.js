import axios from "axios";
import VueJwtDecode from 'vue-jwt-decode'
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

export function checkRoles(token = null){
    if (token) {
        let decodedToken = VueJwtDecode.decode(token)
        return decodedToken.roles
    } else {
        return null
    }
}

export async function register(userRegister){
    const response = await axios.post('http://localhost:8000/registration', {
        userRegister: userRegister
    })
    if(response.status === 201) {
        return 0;
    } else {
        return response.data
    }
}

export async function postData(path, restaurant, token) {
    const response = await axios.post('http://localhost:8000/api/private/' + path, {
        restaurant: restaurant
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).catch(reason => {
        console.log(reason.response)
        if(reason.response.status === 401 && reason.response.data.message === 'JWT Token not found') {
            return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'}
        }
        if(reason.response.status === 401 && reason.response.data.message === 'Expired JWT Token') {
            return {status: 207, data: 'Wygasł dostęp.'} //trzeba dodac refreshToken i wyrzucać do logowania
        }
        if(reason.response.status === 403 && reason.response.data.detail === 'Access Denied.') {
            return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'} //trzeba dodac refreshToken i wyrzucać do logowania
        }
    })
    return {status: response.status, data: response.data}
}

export async function pay(amount, hiddenDescription, email, token = null){
    if(token === null) {
        token = await axios.post('http://localhost:8000/api/login_check', {
            username: 'root@root',
            password: 'root'
        });
    }

    const response = await axios.post(
        'http://localhost:8000/api/public/payment',
        {
            amount: amount,
            hiddenDescription: hiddenDescription,
            email: email,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    console.log(response)
    return {status: response.status, data: response.data}
}


export async function login(email, password){
    try {
        const loginCheck = await axios.post('http://localhost:8000/api/login_check', {
            username: email,
            password: password
        });
        if (loginCheck.data.token) {
            window.axios.defaults.headers.common = {
                'Authorization': `Bearer ${loginCheck.data.token}`,
                'Content-Type': 'application/json'
            }
            console.log(window.axios.defaults.headers.common)
            const updateUserToken = await axios.post('http://localhost:8000/api/public/updateUserToken', {
                username: email,
                password: password
            });
            console.log(updateUserToken.data)
            if(updateUserToken.data[0] === 'Upgraded') {
                return loginCheck.data.token;
            } else {
                return -1;
            }
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
export async function getListItemsOrItem(name, id = 0, state = 'public') {
    let response
    if(id > 0) {
        response = await axios.get('http://localhost:8000/api/' + state + '/' + name + '/' + id)
    } else {
        response = await axios.get('http://localhost:8000/api/' + state + '/' + name + '/')
    }

    if (response.status === 200) {
        if (response.data.length > 0 || typeof response.data === 'object') {
            return response.data;
        }
    } else  {
        return 0;
    }
}

export function calculateTotalPrice () {

}