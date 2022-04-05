import axios from "axios"

const base_URL = 'http://localhost:3005/v1'
const URL_account = `${base_URL}/account`
const URL_login = `${URL_account}/login`
const URL_register = `${URL_account}/register`

const URL_USER = `${base_URL}/user`
const URL_USER_ADD = `${URL_USER}/add`
const URL_USER_BY_EMAIL = `${URL_USER}/byEmail/`

const headers = { 'Content-Type': 'application/json' }

class User {
    constructor() {
        this.id = ''
        this.name = ''
        this.email = ''
        this.avatarName = 'avatarDefault.png'
        this.avatarColor = ''
        this.isLoggedIn = false
    }

    setUserEmail(email) { this.email = email }

    setIsLoggedIn(loggedIn) { this.isLoggedIn = loggedIn }

    setUserData(userData) {
        const { _id, name, email, avatarName, avatarColor } = userData
        this.id = _id
        this.name = name
        this.email = email
        this.avatarName = avatarName
        this.avatarColor = avatarColor
    }

}

export class AuthService extends User {
    constructor() {
        super()
        this.authToken = ''
        this.bearerHeader = ''
    }

    logoutUser() {
        this.id = ''
        this.name = ''
        this.email = ''
        this.avatarName = ''
        this.avatarColor = ''
        this.isLoggedIn = false
        this.authToken = ''
        this.bearerHeader = ''
    }

    getBearerHeader = () => this.bearerHeader

    setAuthToken(token) { this.authToken = token }

    setBearerHeader(token) {
        this.bearerHeader = {
            'Content-Type': 'application/json',
            'Authorization': `bearer ${token}`
        }
    }

    async registerUser(email, password) {
        const body = { 'email': email.toLowerCase(), 'password': password }
        try {
            await axios.post(URL_register, body)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async createUser(name, email, avatarName, avatarColor) {
        const headers = this.getBearerHeader()
        const body = {
            'name': name,
            'email': email,
            'avatarName': avatarName,
            'avatarColor': avatarColor
        }
        try {
            const response = await axios.post(URL_USER_ADD, body, { headers })
            console.log(response.data)
            this.setUserData(response.data)
        } catch (error) {
            console.error(error)
            throw (error)
        }
    }

    async loginUser(email, password) {
        const body = { 'email': email.toLowerCase(), 'password': password }
        try {
            const response = await axios.post(URL_login, body, { headers });
            // headers is declare as const headers = { 'Content-Type': 'application/json' }
            // set authToken
            this.setAuthToken(response.data.token)
            // set bearerHeader
            this.setBearerHeader(response.data.token)
            // set the email
            this.setUserEmail(response.data.user)
            // isLoggedIn = true
            this.setIsLoggedIn(true)
            // findUserByEmail
            await this.findUserByEmail()
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async findUserByEmail() {
        const headers = this.getBearerHeader()
        try {
            const response = await axios.get(URL_USER_BY_EMAIL + this.email, { headers })
            this.setUserData(response.data)
        } catch (error) {
            console.error(error)
        }
    }
}