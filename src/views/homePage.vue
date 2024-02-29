<template>
  
  <navBar></navBar>


  <main class="form-sign w-100 m-auto">


       <!-- Exibir mensagem de erro -->
       <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
       </div>

    
    <!-- Exibir mensagem de sucesso -->

    <div v-if="!errorMessage" class="welcome-container"  >
        <h1> Welcome!  {{ user }} </h1>
        <p> It will be an honor to work with you! !!!</p>
        <router-link to="/books" ><a  class="btn">Go to book list</a></router-link>
    </div>


    
  </main>


</template>

<script lang="ts">
  
  import navBar from '@/components/navBar.vue';
  import{onMounted,ref} from 'vue';

  export default {
    components: {navBar},
    name:"homePage",

    setup(){
             
        const successMessage = ref<string | null>('');
        const errorMessage = ref<string | null>('');
        const user = ref<string | null>('');
        const localStorageData = ref<string | null>('');
        


        onMounted( async ()=>{
   
          localStorageData.value = localStorage.getItem('user');

          if(localStorageData.value != null ){
            user.value = localStorageData.value.replace(/^"(.*)"$/, '$1');
          }else{
            errorMessage.value = 'Seu token expirou faça login';
             
             
          }
    
       });

       return{
        successMessage,
        errorMessage,
        user
       }
    }
  }
 
</script>



<style>
 
       
        .welcome-container {
            text-align: center;
            padding: 40px;
            border-radius: 10px;
            background-color: #ffffff;
            border: 1px solid #d1d1d1;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 100%;
            transform: perspective(900px) rotateY(5deg);
        }

        h1 {
            color: #333333;
        }

        p {
            color: #666666;
        }

        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            font-size: 16px;
            text-decoration: none;
            color: #ffffff;
            background-color: #007bff;
            border-radius: 5px;
            transition: background-color 0.3s;
        }

        .btn:hover {
            background-color: #0056b3;
        }


</style>
