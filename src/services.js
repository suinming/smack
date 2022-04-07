import axios from "axios"
import io from 'socket.io-client';

const base_URL = 'http://localhost:3005/v1'
const URL_account = `${base_URL}/account`
const URL_login = `${URL_account}/login`
const URL_register = `${URL_account}/register`

const URL_USER = `${base_URL}/user`
const URL_USER_ADD = `${URL_USER}/add`
const URL_USER_BY_EMAIL = `${URL_USER}/byEmail/`

const URL_GET_CHANNEL = `${base_URL}/channel`

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

export class ChatService {
    constructor(authHeader) {
        this.getAuthHeader = authHeader
        this.channels = []
        this.selectedChannel = {}
    }

    async findAllChannels() {
        const headers = this.getAuthHeader()
        try {
            let response = await axios.get(URL_GET_CHANNEL, { headers })
            response = response.data.map(channel => ({
                name: channel.name,
                id: channel.id,
                description: channel.description
            }))
            this.channels = [...response]
            return response
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    addChannel = (channel) => this.channels.push(channel)

    getAllChannels = () => this.channels

    setSelectedChannel = (channel) => this.selectedChannel = channel
}

export class SocketService {
    socket = io('http://localhost:3005/');

    constructor(socketAddChannel, getChannelList) {
        this.socketAddChannel = socketAddChannel
        this.getChannelList = getChannelList
    }

    establishConnection() {
        console.log('connect');
        this.socket.connect()
    }

    closeConnection() {
        console.log('disconnect');
        this.socket.disconnect()
    }

    addChannel(name, description) {
        this.socket.emit('newChannel', name, description)
    }

    getChannel(callback) {
        this.socket.on('channelCreated', (name, description, id) => {
            const channel = { name, description, id }
            this.socketAddChannel(channel)
            const channelList = this.getChannelList()
            callback(channelList)
        })
    }

}