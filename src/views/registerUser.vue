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
        <h1 class="h3 mb-3 fw-normal text-center">Register</h1>

        <div class="form-floating">
          <input v-model="data.name" type="text" class="form-control" id="floatingInput" placeholder="John"  />
          <label for="floatingInput">Name</label>
          <p v-if="errors.name" class="text-danger">{{ errors.name }}</p>
        </div>

        <div class="form-floating">
          <input v-model="data.email" type="email" class="form-control" id="floatingInput" placeholder="test@gmail.com"  />
          <label for="floatingInput">Email address</label>
          <p v-if="errors.email" class="text-danger">{{ errors.email }}</p>
        </div>

        <div class="form-floating">
          <input v-model="data.password" type="password" class="form-control" id="floatingPassword" placeholder="Password"  />
          <label for="floatingPassword">Password</label>
          <p v-if="errors.password" class="text-danger">{{ errors.password }}</p>
        </div>

        <div class="form-floating">
          <input v-model="data.password_confirmation" type="password" class="form-control" id="floatingPassworConfirm" placeholder="Password"/>
          <label for="floatingPassworConfirm"> Confirmation </label>
          <p v-if="errors.password_confirmation" class="text-danger">{{ errors.password_confirmation }}</p>
        </div>

        <p id="goregister"> Already have an account? <router-link to="/login" style="color: #333333;" aria-current="page" > click here </router-link></p>
        <button class="w-100 btn btn-lg btn-primary" type="submit" :disabled="loading">Register</button>
      </form>
      
    </main>

</template>

<script lang="ts">

  import {reactive,ref } from 'vue'


  export default{

    name:"registerUser",
   
    setup(){

      
      const successMessage = ref<string | null>('');
      const errorMessage = ref<string | null>('');
      const loading = ref(false);

      const data = reactive({
        name:'',
        email:'',
        password:'',
        password_confirmation:''
      });

      const errors = reactive({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      });

      const validate = () => {
        errors.name = data.name.length > 0 ? '' : 'Name is required';
        errors.email = /\S+@\S+\.\S+/.test(data.email) ? '' : 'Invalid email address';
        errors.password = data.password.length >= 6 ? '' : 'Password must be at least 6 characters';
        errors.password_confirmation =
        data.password_confirmation === data.password ? '' : 'Passwords do not match';

      return (
        !errors.name &&
        !errors.email &&
        !errors.password &&
        !errors.password_confirmation
      );
    };

      
      const submit = async () =>{
        
        if (validate()) {

          loading.value = true; // Ativa o spinner
          
          const url:string = 'http://localhost:3000/user/register';
          
          try {
              const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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



</style>
