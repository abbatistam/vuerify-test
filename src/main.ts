import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faUserSecret, faClose, faSearch, faChevronRight, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import './assets/main.css'

/* add icons to the library */
library.add(faUserSecret, faClose, faSearch, faChevronRight, faArrowRight, faArrowLeft)


const app = createApp(App)

app.use(createPinia())
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)

app.mount('#app')
