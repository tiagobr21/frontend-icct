import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'

import {library} from '@fortawesome/fontawesome-svg-core';
import { faRightFromBracket,faBars, faPenSquare , faTrash, faSearch, faBook , faPen, faGenderless, faCalendar, faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faRightFromBracket,faBars,faPenSquare,faTrash,faSearch, faBook, faPen, faGenderless, faCalendar, faNewspaper)

createApp(App)
.component('fa',FontAwesomeIcon)
.use(router).mount('#app')

