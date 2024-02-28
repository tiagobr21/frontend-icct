<template>
     <navBar></navBar>

           <!-- Spinner -->
           <div v-if="loading" class="spinner-overlay">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      
      <main class="form-sign w-100 m-auto">

      <!-- Exibir mensagem de sucesso -->
        <div v-if="successMessage" class="alert alert-success" role="alert">
            {{ successMessage }}
        </div>

        <!-- Exibir mensagem de erro -->
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
        </div>

      </main>
    
    <div class="container">
      <div class="row">
        <div class="col-12 text-center">
          <h4 class="pt-3">Add new Category</h4>
        </div>
      </div>
 
      <div class="row">
        <div class="col-3"></div>
        <div class="col-md-6 px-5 px-md-0">
         <form>
           <div class="form-group">
             <label>Category Name</label>
             <input v-model="data.categoria" type="text" class="form-control" required>
           </div>
           <button type="button" class="btn btn-primary" @click="add">Create</button>
         </form>
        </div>
        <div class="col-3"></div>
      </div>
   </div>
 </template>
 
 <script lang="ts">


    import navBar from '@/components/navBar.vue';
  
    import {reactive,ref,onMounted} from 'vue';

  export default {
    name: 'addCategory',
    components : {navBar},

    setup() {

      const successMessage = ref<string | null>('');
      const errorMessage = ref<string | null>('');
      const url = ref<string | null>('');
      const localStorageData = ref<string | null>('');
      const token = ref<string | null>('');
      const loading = ref<boolean | null>(false);
  
       const data = reactive({
          categoria:'',
       
        });

      
        

      onMounted(async() => {

      

        });



      const add= async () =>{
           
   
           loading.value = true; // Ativa o spinner

           console.log(data);
           


           localStorageData.value = localStorage.getItem('token');

           if(localStorageData.value != null){

                token.value = localStorageData.value.replace(/^"(.*)"$/, '$1');
       
                    
           url.value = 'http://localhost/api/auth/categoria/add';
           
           try {

            const response = await fetch(url.value, {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.value}` 
                },
                  body: JSON.stringify(data),
                });
                
            
               if (response.ok) {
                 
                 const responseData = await response.json();
                 console.log(responseData);
                 
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
        add,
        errorMessage,
        successMessage,
        loading
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