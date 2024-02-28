<template>

   <navBar></navBar>
   
     <!-- Spinner -->
       <div v-if="loading" class="spinner-overlay">
       <div class="spinner-border text-primary" role="status">
         <span class="visually-hidden">Loading...</span>
       </div>
     </div>
     

     <!-- Exibir mensagem de sucesso -->
       <div v-if="successMessage" class="alert alert-success" role="alert">
           {{ successMessage }}
       </div>

       <!-- Exibir mensagem de erro -->
       <div v-if="errorMessage" class="alert alert-danger" role="alert">
           {{ errorMessage }}
       </div>


       <div class="container">
           <div class="row">
               <div class="col-12 text-center">
               <h4 class="pt-3">Edit Product</h4>
               </div>
           </div>
       
           <div class="row">
               <div class="col-3"></div>
               <div class="col-md-6 px-5 px-md-0">

               <form>
                  
                  <div class="form-group">
                  <label>Product Name</label>
                  <input v-model="data.nome" type="text" class="form-control" required>
                
                  </div>
                  <div class="form-group">
                  <label>Product Description</label>
                  <input v-model="data.descricao" type="text" class="form-control" required>
                 
                  </div>
                  <div class="form-group">
                  <label>Product Price</label>
                  <input v-model="data.preco" type="text" class="form-control" required>
               
                  </div>
                  <div class="form-group">
                  <label>Product Date Validity</label>
                  <input v-model="data.data_validade" type="text" class="form-control" required>
                 
                  </div>
                
                  <div class="form-group">
                  <label>Product Cetegory ID</label>
                  <input v-model="data.categoria_id" type="text" class="form-control" required>
                  
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
   name: 'editProduct',
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
        descricao:'',
        preco:'',
        data_validade:'',
        imagem: '', 
        categoria_id:'',
  
     });


     onMounted(async() => {

       localStorageData.value = localStorage.getItem('token');

       if(localStorageData.value != null){

       token.value = localStorageData.value.replace(/^"(.*)"$/, '$1');
       
               
       url.value= 'http://localhost/api/auth/produto/'+ route.params.id;
               
       try{
               
           const response =  await fetch(url.value, {
                       
           headers: { 
               'Accept': 'application/json',
               'Content-Type': 'multipart/form-data',
               'Authorization': `Bearer ${token.value}`,
               },
           });

           const product = await response.json();
      
           
           data.nome = product[0].nome;
           data.descricao = product[0].descricao;
           data.preco = product[0].preco;
           data.data_validade = product[0].data_validade;
           data.imagem = product[0].imagem;
           data.categoria_id = product[0].categoria_id;
           
                   
           successMessage.value = product.message;
           
           
           } catch (error) {
               
               // console.error(error);
               errorMessage.value = 'Algo deu errado';
               successMessage.value = ''; // Limpar mensagem de sucesso

           } 
       
       }

     });




     const updates = async () =>{
           
            // loading.value = true; // Ativa o spinner
            
            url.value = 'http://localhost/api/auth/produto/edit/'+ route.params.id;
            


             // Validar se a data_validade é menor que o dia atual
            const currentDate = new Date();
            const expirationDate = new Date(data.data_validade);
            
       
              
            if (expirationDate < currentDate) {
              errorMessage.value  = 'The expiration date must be greater than the current date';
            }else{
              
            try {
              

            const response = await fetch(url.value, {
                    method: 'PUT',
                    headers: { 
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token.value}` 
                    },
                    body: JSON.stringify(data),
            });

                  

               if (response.ok) {

                  
                  const responseData = await response.json(); 
                  successMessage.value = responseData.message;
                  errorMessage.value = ''; // Limpar mensagem de erro
                                 
                  
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