import Vue from 'vue'
import VueCG from '@grantjbutler/vuecg'
import App from './components/App'

Vue.use(VueCG)

new Vue({
    el: '#app',
    render: h => h(App)
})