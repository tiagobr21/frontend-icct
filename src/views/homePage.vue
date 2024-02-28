<template>
  
  <navBar></navBar>


  <main class="form-sign w-100 m-auto">

    
    <!-- Exibir mensagem de sucesso -->

    <div class="welcome-container"  >
        <h1> Bem-Vindo!  {{ user }} </h1>
        <p>Vai ser uma honra trabalhar com você !!!</p>
        <router-link to="/products" ><a  class="btn">Ir para lista de Livros</a></router-link>
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
