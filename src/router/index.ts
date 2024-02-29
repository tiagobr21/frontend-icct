import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/homePage.vue';
import Login from '../views/loginUser.vue';
import Register from '../views/registerUser.vue';
import Users from '../views/users/usersPage.vue';
import editUser from '../views/users/editUser.vue';
import Books from '../views/books/booksPage.vue';
import editBook from '@/views/books/editBook.vue';
import addBook from '@/views/books/addBook.vue';

const routes = [
  { path: '/', component: Home},
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/users',
    name: 'users',
    component: Users,

  },
  {
    path: '/user/edit/:id',
    name:"editUser",
    component: editUser,
    beforeEnter: (to:any, from:any, next:any) => {
      guard(to, from, next);
    }
  },
  
  { 
    path: '/books', 
    name: 'books',
    component: Books, 
  },
  { 
    path: '/book/edit/:id', 
    name: 'editBook',
    component: editBook, 
    beforeEnter: (to:any, from:any, next:any) => {
      guard(to, from, next);
    }
  },
  { 
    path: '/book/add', 
    name: 'addBook',
    component: addBook, 
    beforeEnter: (to:any, from:any, next:any) => {
      guard(to, from, next);
    }
  }
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});


const guard = function(to:any, from:any, next:any) {
    // Obtenha o token do localStorage
    const token = localStorage.getItem('token');
    let role = localStorage.getItem('role');


    if(role != null){
      role = role.replace(/^"(.*)"$/, '$1')
    }
   

    // Verifique se há um token válido
    if (token && role == 'admin') {
      next();
    } else {
      // Se não houver token, redirecione para a página de login
      next('/');
    }
 
};

export default router