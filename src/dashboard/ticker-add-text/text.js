import { createInstance } from '../../../index.js'
            
document.addEventListener('dialog-confirmed', function() {
    let text = document.getElementById('text').value.trim()
    if (text.length != 0) {
        createInstance('com.grantjbutler.nodecg-ticker.text', { text })
    }
});