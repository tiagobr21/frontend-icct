<template>

      <!-- Spinner -->
      <div v-if="loading" class="spinner-overlay">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
     
        <!-- Exibir mensagem de erro -->
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
      </div>


    <div class="card h-100" >
 
      <div class="card-body">
        <h5 class="card-title"><strong> <fa class="book-icon" icon="book"></fa> Name: </strong>{{book.nome}} </h5>
        <h5 class="card-title"><strong><fa class="pen-icon" icon="pen"></fa> Author: </strong>{{book.nomeDoAutor}}</h5>
        <h5 class="card-title"><strong><fa class="calendar-icon" icon="calendar"></fa> Release: </strong>{{book.lancamento}}</h5>
        <h5 class="card-title"><strong><fa class="genderless-icon" icon="genderless"></fa> Gender: </strong>{{book.genero}}</h5>
        <h5 class="card-title"><strong><fa class="newspaper-icon" icon="newspaper"></fa> Publi. Company: </strong>{{book.editora}}</h5>
        
        <div v-if="role == 'admin'" id="actions-book">
          <router-link id="edit-book" :to="{name : 'editBook', params : {id : book.id} }" >
            <fa icon="pen-square"></fa>
          </router-link>
          <router-link to="/books" >
                <div class="delete"> <fa @click="deletes(book.id)" icon="trash"></fa> </div>
          </router-link >
        </div>

      </div>
    </div>
  </template>
  
  <script lang="ts">

   
   import {ref,onMounted} from 'vue';

  export default {
      name : "bookBox",
      props : ["book"],
         
      
    setup() {

        const successMessage = ref<string | null>('');
        const errorMessage = ref<string | null>('');
        const url = ref<string | null>('');
        const localStorageData = ref<string | null>('');
        const token = ref<string | null>('');
        const loading = ref<boolean | null>(false);
        const role = ref<string | null>('');



        onMounted(async() => {

        localStorageData.value = localStorage.getItem('token');
        role.value = localStorage.getItem('role');

        if(localStorageData.value != null && role.value != null){

                token.value = localStorageData.value.replace(/^"(.*)"$/, '$1');
                role.value = role.value.replace(/^"(.*)"$/, '$1');
        
            } 
        
        });


        const deletes = async (id:any) =>{
            
            
            loading.value = true; // Ativa o spinner
            
            url.value = 'http://localhost:3000/books/delete/'+id;
            
            try {

                const response = await fetch(url.value, {
                    method: 'DELETE',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token.value}` 
                    },

                    });

                if (response.ok) {
                    
  
                    window.location.reload();
                    
                } else {

                    const errorData = await response.json();
                    errorMessage.value = errorData.message;
              
                }

            } catch (error) {
                
                console.error(error);
                errorMessage.value = 'Algo deu errado';
                successMessage.value = ''; // Limpar mensagem de sucesso

            } finally {
                

                loading.value = false; // Desativa o spinner

            }    
            
            }


            return{
                deletes,
                errorMessage,
                successMessage,
                loading,
                role
            }

            },
  }
  </script>
  
  <style scoped>
  

  .delete{
      color: red;
    }
  .embed-responsive .card-img-top {
    object-fit: cover;
  }
  
  a {
    text-decoration: none;
  }

 
  .card-img-top, .description{
    width: 250px;
    
  }
  
  .card-title {
    color: #484848;
    font-size: 1.1rem;
    font-weight: 400;
  }

  
  .card-title:hover {
    font-weight: bold;
  }
  
  .card-text {
    font-size: 0.9rem;
  }
  
  #edit-book {
    float: right;
  }
  

  #actions-book {
    float: right;
    display: block;
    margin-left: 10px;
  }
  
  
  </style>