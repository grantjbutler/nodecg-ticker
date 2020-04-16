import { createInstance } from '../../../index.js'

let textField = document.getElementById('text')

document.addEventListener('dialog-confirmed', function() {
    let text = textField.value.trim()
    if (text.length != 0) {
        createInstance('com.grantjbutler.nodecg-ticker.text', { text })

        textField.value = ''
    }
});