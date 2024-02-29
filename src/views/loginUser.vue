<template>

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

        <form @submit.prevent="submit">
          
            <h1 class="h3 mb-3 fw-normal text-center">Login</h1>

            <div class="form-floating">
              <input v-model="data.email" type="email" class="form-control" id="floatingInput" placeholder="name@example.com" required>
              <label for="floatingInput">Email address</label>
              <p v-if="errors.email" class="text-danger">{{ errors.email }}</p>
            </div>

            <div class="form-floating">
              <input v-model="data.password" type="password" class="form-control" id="floatingPassword" placeholder="Password" required>
              <label for="floatingPassword">Password</label>
              <p v-if="errors.password" class="text-danger">{{ errors.password }}</p>
            </div>
            
            <p id="goregister">Don't have an account? <router-link to="/register" style="color: #333333;" aria-current="page" > click here </router-link></p>
            <button class="w-100 btn btn-lg btn-primary" type="submit" :disabled="loading">Entrar</button>
            
        </form>
      </main>
</template>

<script lang="ts">

  import {reactive,ref } from 'vue'
  import { useRouter } from 'vue-router';

  export default{

      name:"loginUser",

      setup(){

        const successMessage = ref('');
        const errorMessage = ref('');
        const loading = ref(false);
        const url = ref<string | null>('');
         
        const data = reactive({
          email:'',
          password:'',
        });
        

        const errors = reactive({
          email: '',
          password: '',
        });

        const validate = () => {
          errors.email = /\S+@\S+\.\S+/.test(data.email) ? '' : 'Invalid email address';
          errors.password = data.password.length >= 6 ? '' : 'Password must be at least 6 characters';

          return (
            !errors.email &&
            !errors.password 
          );
        };
 

        const router = useRouter();

        const submit = async () =>{
          
          if (validate()) {

            loading.value = true; // Ativa o spinner
            
            url.value = 'http://localhost:3000/user/login';
            
            
            try {

                const response = await fetch(url.value, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data),
                });

        
                if (response.ok) {
                  
                  const responseData = await response.json();
                  

                  successMessage.value = responseData.message;
                  errorMessage.value = ''; // Limpar mensagem de erro

                   
                  // console.log(responseData);
                  
                  
                  // Convertendo para formato JSON e armazenando no localStorage
                  localStorage.setItem('user', JSON.stringify(responseData.name));
                  localStorage.setItem('token', JSON.stringify(responseData.token));
                  localStorage.setItem('role', JSON.stringify(responseData.role));
                  
                                
                  await router.push('/');
                  
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
          submit,
          errors,
          successMessage,
          errorMessage,
          loading,

        }
    }

  }

</script>




<style>
  
  
   .btn {
    margin-top: 20px;

  }

  #goregister{
   float: inline-end;
  }


</style>
