<template>


    <div class="card h-100">
      <div class="embed-responsive embed-responsive-16by9">
        <!-- <img class="card-img-top embed-responsive-item" :src="user.imageUrl" alt="User Image"> -->
      </div>
  
      <div class="card-body">
        <h5 class="card-title"><strong>ID: </strong>{{user.id}}</h5>
        <h5 class="card-title"><strong>Name: </strong>{{user.name}}</h5>
        <h5 class="card-title"><strong>Email: </strong>{{user.email}}</h5>
        <h5 class="card-title"><strong>Role: </strong>{{user.role}}</h5>
   
        <div v-if="role == 'admin'" id="actions-user">
          <router-link :to="{ name: 'editUser', params: { id : user.id } }" >
                <fa icon="pen-square"></fa>
          
          </router-link> <br>
         <router-link to="/users" >
               <div class="delete"> <fa @click="deleteUser(user.id)" icon="trash"></fa> </div>

          </router-link >
        </div>


      </div>
    </div>


  </template>
  
  <script lang="ts">

    import {ref,onMounted} from 'vue';

  export default {

      name : "userBox",
      props : ["user"],

      
      
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


    const deleteUser = async (id:any) =>{
        
        
        loading.value = true; // Ativa o spinner
        
        url.value = 'http://localhost:3000/user/'+id;
        
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
      deleteUser,
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
  .card{
    width : 20rem;
    height : 24rem;
  }
  
  .embed-responsive .card-img-top {
    object-fit: cover;
  }
  
  a {
    text-decoration: none;
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
  
  #actions-user {
    float: right;
    display: block;
    margin-left: 10px;
  }
  </style>