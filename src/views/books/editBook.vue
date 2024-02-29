<template>

   <navBar></navBar>
   
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


       <div class="container">
           <div class="row">
               <div class="col-12 text-center">
               <h4 class="pt-3">Edit Book</h4>
               </div>
           </div>
       
           <div class="row">
               <div class="col-3"></div>
               <div class="col-md-6 px-5 px-md-0">

               <form>
                  
                <div class="form-group">
                  <label>Name</label>
                  <input v-model="data.nome" type="text" class="form-control" required>
               
                </div>
                
                <div class="form-group">
                  <label>Author</label>
                  <input v-model="data.nomeDoAutor" type="text" class="form-control" required>
                
                </div>
       
                <div class="form-group">
                  <label>Release</label>
                  <input v-model="data.lancamento" type="text" class="form-control" required>
               
                </div>
       
                <div class="form-group">
                  <label>Type</label>
                  <input v-model="data.tipo" type="text" class="form-control" required>
                
                </div>
       
                <div class="form-group">
                  <label>Gender</label>
                  <input v-model="data.genero" type="text" class="form-control" required> 
                  
                </div>
       
                <div class="form-group">
                  <label>Publishing Company</label>
                  <input v-model="data.editora" type="text" class="form-control" required>
                 
                </div>
       
                <div class="form-group">
                 <label>Year Edition</label>
                 <input v-model="data.anoEdicao" type="text" class="form-control" required>
              
               </div>
               
               <div class="form-group">
                 <label>Number Edition</label>
                 <input v-model="data.numEdicao" type="text" class="form-control" required>
              
               </div>
                  
    
                   <button type="submit" class="btn btn-primary"  @click="updates"> Update</button>
               </form>

               </div>
               <div class="col-3"></div>
           </div>
       </div>
  

 </template>
 
 <script lang="ts">
   
   import navBar from '@/components/navBar.vue';
   import { useRoute } from 'vue-router';
   import {reactive,ref,onMounted} from 'vue';

   

 export default {
   name: 'editBook',
   components : {navBar},

   setup() {

     const successMessage = ref<string | null>('');
     const errorMessage = ref<string | null>('');
     const url = ref<string | null>('');
     const localStorageData = ref<string | null>('');
     const token = ref<string | null>('');
     const loading = ref<boolean | null>(false);

     const route = useRoute();
 
     const data = reactive({
        nome:'',
        nomeDoAutor:'',
        lancamento:'',
        tipo:'',
        genero: '', 
        editora:'',
        anoEdicao:'',
        numEdicao: ''
  
     });


     onMounted(async() => {

       localStorageData.value = localStorage.getItem('token');

       if(localStorageData.value != null){

       token.value = localStorageData.value.replace(/^"(.*)"$/, '$1');
       
               
       url.value= 'http://localhost:3000/books/getbyid/'+ route.params.id;
               
       try{
               
           const response =  await fetch(url.value, {
                       
           headers: { 
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token.value}`,
               },
           });

           const book = await response.json();
           
    
           data.nome = book.data.nome;
           data.nomeDoAutor = book.data.nomeDoAutor;
           data.lancamento = book.data.lancamento;
           data.tipo = book.data.tipo;
           data.genero = book.data.genero;
           data.editora = book.data.editora;
           data.anoEdicao = book.data.anoEdicao;
           data.numEdicao = book.data.numEdicao;
                   
           successMessage.value = book.message;
           
           
           } catch (error) {
               
               // console.error(error);
               errorMessage.value = 'Algo deu errado';
               successMessage.value = ''; // Limpar mensagem de sucesso

           } 
       
       }

     });




     const updates = async () =>{
           
             loading.value = true; 
            
            url.value = 'http://localhost:3000/books/edit/'+ route.params.id;
    
            try {
              

            const response = await fetch(url.value, {
                    method: 'PATCH',
                    headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token.value}` 
                    },
                    body: JSON.stringify(data),
            });

                
               if (!response.ok) {

                  const errorData = await response.json();
                  errorMessage.value = errorData.message;
       

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
       data,
       updates,
       errorMessage,
       successMessage,
       loading,
 
     }
      
 },

 }
 </script>
 
 <style scoped>
 h4 {
   font-family: 'Roboto', sans-serif;
   color: #484848;
   font-weight: 700;
 }
 </style>