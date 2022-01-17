// This file is ran as a background script
import axios from 'axios'

console.log("Hello from background script!")

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined) {
        console.log("Tab Updated", tabId, tab.url)
        const uid = 5
        axios.get(`https://jsonplaceholder.typicode.com/todos?userId=${uid}`)
            .then((res) => {
                chrome.tabs.sendMessage(tabId, res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request)
    axios.get(`https://jsonplaceholder.typicode.com/todos?userId=${request}`)
        .then(async (res) => {
            console.log(res)
            await sendResponse(res)
        })
        .catch((err) => {
            console.log(err)
        })
})