<template>

       <!-- Spinner -->
       <div v-if="loading" class="spinner-overlay">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

    <div class="card h-100" >
 
      <div class="card-body">
        <h5 class="card-title"><strong> <fa class="book-icon" icon="book"></fa> Name: </strong>{{product.nome}} </h5>
        <h5 class="card-title"><strong><fa class="pen-icon" icon="pen"></fa> Author: </strong>{{product.nomeDoAutor}}</h5>
        <h5 class="card-title"><strong><fa class="calendar-icon" icon="calendar"></fa> Release: </strong>{{product.lancamento}}</h5>
        <h5 class="card-title"><strong><fa class="genderless-icon" icon="genderless"></fa> Gender: </strong>{{product.genero}}</h5>
        <h5 class="card-title"><strong><fa class="newspaper-icon" icon="newspaper"></fa> Publi. Company: </strong>{{product.editora}}</h5>
        
        <div v-if="role == 'admin'" id="actions-product">
          <router-link id="edit-product" :to="{name : 'editProduct', params : {id : product.id} }" >
            <fa icon="pen-square"></fa>
          </router-link>
          <router-link to="/products" >
                <div class="delete"> <fa @click="deleteProduct(product.id)" icon="trash"></fa> </div>
          </router-link >
        </div>

      </div>
    </div>
  </template>
  
  <script lang="ts">

   
   import {ref,onMounted} from 'vue';

  export default {
      name : "productBox",
      props : ["product"],
         
      
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


        const deleteProduct = async (id:any) =>{
            
            
            loading.value = true; // Ativa o spinner
            
            url.value = 'http://localhost/api/auth/produto/delete/'+id;
            
            try {

                const response = await fetch(url.value, {
                    method: 'DELETE',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token.value}` 
                    },

                    });

                if (response.ok) {
                    
                    const responseData = await response.json();
                    successMessage.value = responseData.message;
                    errorMessage.value = ''; // Limpar mensagem de erro
                      
                    window.location.reload();
                    
                } else {

                    const errorData = await response.json();
                    errorMessage.value = errorData.message;
                    successMessage.value = ''; // Limpar mensagem de sucesso

                }

            } catch (error) {
                
                console.error(error);
                errorMessage.value = 'Algo deu errado ou o token expirou';
                successMessage.value = ''; // Limpar mensagem de sucesso

            } finally {
                

                loading.value = false; // Desativa o spinner

            }    
            }


            return{
                deleteProduct,
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
  
  #edit-product {
    float: right;
  }
  

  #actions-product {
    float: right;
    display: block;
    margin-left: 10px;
  }
  
  
  </style>