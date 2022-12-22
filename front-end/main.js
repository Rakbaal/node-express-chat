const server = 'http://127.0.0.1:3000'
const socket = io(server);

let me = null
let userName = null

const initHistory = (history) => {
    console.log("TRIGGERED");
    for (i = 0; i != history.length; i++) {
        addToFeed(history[i])
    }
}

const addToFeed = (message) => {
    const authorDiv = document.createElement('div')
        authorDiv.innerText = message.from
        authorDiv.classList.add('name') 

        const contentDiv = document.createElement('div')
        contentDiv.innerText = message.content
        contentDiv.classList.add('message')

        const liElement = document.createElement('li')
        message.socketId === me ? liElement.classList.add("me") : ""
        liElement.appendChild(authorDiv)
        liElement.appendChild(contentDiv)

        document.getElementById('msgList').appendChild(liElement)
}

(function () {
    socket.on('connect', () => {
        me = socket.id
        userName = prompt('UserName :')
        document.getElementById('userName').innerText = userName
        socket.emit('chosenUserName', userName)
    })


    socket.on('notification', (data) => {
        console.log('Message depuis le seveur:', data);
    })

    socket.on('history', (history) => {
        initHistory(history)
    })
})()

const inputMsg = document.getElementById('msg')
const submitButton = document.getElementById('submit')

submitButton.addEventListener('click', () => {
    if(inputMsg.value != "") {
        const msg = {
            from: userName,
            socketId: socket.id,
            content: inputMsg.value
        }
        socket.emit('pushMessage', { msg })
        inputMsg.value = ""
    }
})
