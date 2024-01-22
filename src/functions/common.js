import axios from "axios";
import VueJwtDecode from 'vue-jwt-decode'
import VueCookie from "vue-cookie";

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
    const response = await axios.post('http://localhost:8000/common/registration', {
        userRegister: userRegister
    })
    if(response.status === 201) {
        return 0;
    } else {
        return response.data
    }
}

export async function postData(path, data, token) {
    if(path === 'addRestaurant') {
        const response = await axios.post('http://localhost:8000/api/admin/' + path, {
                restaurant: data
            }
            ,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).catch(reason => {
            console.log(reason.response)
            if(reason.response.status === 401 && reason.response.data.message === 'JWT Token not found') {
                VueCookie.delete('token')
                window.location.href = '/home'
                return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'}
            }
            if(reason.response.status === 401 && reason.response.data.message === 'Expired JWT Token') {
                window.location.href = '/home'
                return {status: 207, data: 'Wygasł dostęp.'} //trzeba dodac refreshToken i wyrzucać do logowania
            }
            if(reason.response.status === 403 && reason.response.data.detail === 'Access Denied.') {
                window.location.href = '/home'
                return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'} //trzeba dodac refreshToken i wyrzucać do logowania
            }
        })
        return {status: response.status, data: response.data}
    }
    if(path === 'addCategory' || path === 'addDishCategory' || path === 'addIngridientCategory') {
        const response = await axios.post('http://localhost:8000/api/admin/' + path, {
                category: data
            }
            ,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).catch(reason => {
            console.log(reason.response)
            if(reason.response.status === 401 && reason.response.data.message === 'JWT Token not found') {
                window.location.href = '/home'
                return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'}
            }
            if(reason.response.status === 401 && reason.response.data.message === 'Expired JWT Token') {
                window.location.href = '/home'
                return {status: 207, data: 'Wygasł dostęp.'} //trzeba dodac refreshToken i wyrzucać do logowania
            }
            if(reason.response.status === 403 && reason.response.data.detail === 'Access Denied.') {
                window.location.href = '/home'
                return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'} //trzeba dodac refreshToken i wyrzucać do logowania
            }
        })
        return {status: response.status, data: response.data}
    }
    if(path === 'passwordReset') {
        const response = await axios.post('http://localhost:8000/common/passwordReset', {
                email: data
            }
        ).catch(reason => {
            console.log(reason.response)
            if(reason.response.status === 401 && reason.response.data.message === 'JWT Token not found') {
                window.location.href = '/home'
                return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'}
            }
            if(reason.response.status === 401 && reason.response.data.message === 'Expired JWT Token') {
                window.location.href = '/home'
                return {status: 207, data: 'Wygasł dostęp.'} //trzeba dodac refreshToken i wyrzucać do logowania
            }
            if(reason.response.status === 403 && reason.response.data.detail === 'Access Denied.') {
                window.location.href = '/home'
                return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'} //trzeba dodac refreshToken i wyrzucać do logowania
            }
        })
        return {status: response.status, data: response.data}
    }
    if(path === 'addToFavorite') {
        const response = await axios.post('http://localhost:8000/api/addToFavorite/'+data, {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).catch(reason => {
            console.log(reason.response)
            if(reason.response.status === 401 && reason.response.data.message === 'JWT Token not found') {
                window.location.href = '/home'
                return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'}
            }
            if(reason.response.status === 401 && reason.response.data.message === 'Expired JWT Token') {
                window.location.href = '/home'
                return {status: 207, data: 'Wygasł dostęp.'} //trzeba dodac refreshToken i wyrzucać do logowania
            }
            if(reason.response.status === 403 && reason.response.data.detail === 'Access Denied.') {
                window.location.href = '/home'
                return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'} //trzeba dodac refreshToken i wyrzucać do logowania
            }
        })
        return {status: response.status, data: response.data}
    }
    if(path === 'removeFromFavorite') {
        const response = axios.delete('http://localhost:8000/api/removeFromFavorite/'+data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).catch(reason => {
            console.log(reason.response)
            if(reason.response.status === 401 && reason.response.data.message === 'JWT Token not found') {
                window.location.href = '/home'
                return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'}
            }
            if(reason.response.status === 401 && reason.response.data.message === 'Expired JWT Token') {
                window.location.href = '/home'
                return {status: 207, data: 'Wygasł dostęp.'} //trzeba dodac refreshToken i wyrzucać do logowania
            }
            if(reason.response.status === 403 && reason.response.data.detail === 'Access Denied.') {
                window.location.href = '/home'
                return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'} //trzeba dodac refreshToken i wyrzucać do logowania
            }
        })
        console.log(response)
        return {status: response.status, data: response.data}
    }
    if(path === 'addRating') {
        let response
        if(token) {
            response = await axios.post('http://localhost:8000/common/addRating/'+data.id, {
                    value: data.value,
                    description: data.description
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            ).catch(reason => {
                console.log(reason.response)
                if(reason.response.status === 401 && reason.response.data.message === 'JWT Token not found') {
                    window.location.href = '/home'
                    return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'}
                }
                if(reason.response.status === 401 && reason.response.data.message === 'Expired JWT Token') {
                    window.location.href = '/home'
                    return {status: 207, data: 'Wygasł dostęp.'} //trzeba dodac refreshToken i wyrzucać do logowania
                }
                if(reason.response.status === 403 && reason.response.data.detail === 'Access Denied.') {
                    window.location.href = '/home'
                    return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'} //trzeba dodac refreshToken i wyrzucać do logowania
                }
            })
        } else {
             response = await axios.post('http://localhost:8000/common/addRating/'+data.id, {
                    value: data.value,
                    description: data.description
                }
            ).catch(reason => {
                console.log(reason.response)
                if(reason.response.status === 401 && reason.response.data.message === 'JWT Token not found') {
                    window.location.href = '/home'
                    return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'}
                }
                if(reason.response.status === 401 && reason.response.data.message === 'Expired JWT Token') {
                    window.location.href = '/home'
                    return {status: 207, data: 'Wygasł dostęp.'} //trzeba dodac refreshToken i wyrzucać do logowania
                }
                if(reason.response.status === 403 && reason.response.data.detail === 'Access Denied.') {
                    window.location.href = '/home'
                    return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'} //trzeba dodac refreshToken i wyrzucać do logowania
                }
            })
        }
        return {status: response.status, data: response.data}
    }
}

export async function pay(amount, hiddenDescription, email, cart, cost, address, token = null){
    if(token === null) {
        token = await axios.post('http://localhost:8000/api/login_check', {
            username: 'root@root',
            password: 'root'
        });
    }

    const response = await axios.post(
        'http://localhost:8000/common/payment',
        {
            amount: amount,
            hiddenDescription: hiddenDescription,
            email: email,
            cart: cart,
            cost: cost,
            address: address
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
            const updateUserToken = await axios.post('http://localhost:8000/common/updateUserToken', {
                username: email,
                password: password
            }, {
                headers: {
                    Authorization: `Bearer ${loginCheck.data.token}`
                }
            });
            console.log(updateUserToken.data)
            if(updateUserToken.data[0] === 'Upgraded') {
                return loginCheck.data.token;
            } else {
                return -1;
            }
            // return loginCheck.data.token;
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
export async function getListItemsOrItem(name, id = 0, state = 'common', role = '') {
    try {
        let response
        let path = 'http://localhost:8000/' + state + '/' + name
        if(role !== '') {
            path = 'http://localhost:8000/' + state + '/' + role + '/' + name
        }
        const token = VueCookie.get('token')
        if(id > 0) {
            response = await axios.get(path + '/' + id, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } else {
            response = await axios.get(path, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }

        if (response.status === 200) {
            if (response.data.length > 0 || typeof response.data === 'object') {
                return response.data;
            }
        } else  {
            return 0;
        }
    } catch (error) {
        if(error.response.status === 401 && error.response.data.message === 'JWT Token not found') {
            VueCookie.delete('token')
            window.location.href = '/home'
            return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'}
        }
        if(error.response.status === 401 && error.response.data.message === 'Expired JWT Token') {
            VueCookie.delete('token')
            window.location.href = '/home'
            return {status: 207, data: 'Wygasł dostęp.'} //trzeba dodac refreshToken i wyrzucać do logowania
        }
        if(error.response.status === 403 && error.response.data.detail === 'Access Denied.') {
            VueCookie.delete('token')
            window.location.href = '/home'
            return {status: 207, data: 'Nie posiadasz wymaganych uprawnień do korzystania z tej funkcji.'} //trzeba dodac refreshToken i wyrzucać do logowania
        }
        return error.response.data
    }

}

export function calculateTotalPrice () {

}