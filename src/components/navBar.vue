<template>
   

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
        <div class="container-fluid">
            
            <router-link to="/"  class="navbar-brand" >Home </router-link>
                
            <div class="menu">
              <ul class="navbar-nav me-auto mb-2 mb-md-0" v-if="!token">
                    <li class="nav-item">
                      <router-link to="/login" class="nav-link active" aria-current="page" > Login </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/register" class="nav-link active" aria-current="page" > Register </router-link>
                    </li>
                 </ul>
                <ul class="navbar-nav me-auto mb-2 mb-md-0" v-if="token">

                  <li class="nav-item">
                      <router-link to="/products" class="nav-link active" aria-current="page" > Products </router-link>
                    </li>
                    <li class="nav-item">
                      <router-link to="/categories" class="nav-link active" aria-current="page" > Categories </router-link>
                    </li>
<!--                     <li class="nav-item">
                      <router-link to="/" class="nav-link active" aria-current="page" > Profile </router-link>
                    </li> -->

                    <li class="nav-item"> 
                      <router-link to="/login" class="nav-link active" aria-current="page" @click="logout"> <fa icon="right-from-bracket"></fa></router-link>
                     
                    </li>

                </ul>
            </div>
          
    
            <div class="dropdown">
                  <button class="dropdown-btn">
                          <fa id="icon" icon="bars"></fa>
                  </button>
                  
                  <div class="dropdown-content">
                      <ul class="navbar-nav me-auto mb-2 mb-md-0" v-if="!token">
                          <li class="nav-item">
                            <router-link to="/login" class="nav-link active" style="color: #333333;" aria-current="page" > Login </router-link>
                          </li>
                          <li class="nav-item">
                              <router-link to="/register" class="nav-link active" style="color: #333333;" aria-current="page" > Register </router-link>
                          </li>
                      </ul>
                      <ul class="navbar-nav me-auto mb-2 mb-md-0" v-if="token">

                        <li class="nav-item">
                            <router-link to="/products" class="nav-link active" style="color: #333333;" aria-current="page" > Products </router-link>
                          </li>
                          <li class="nav-item">
                            <router-link to="/categories" class="nav-link active" style="color: #333333;" aria-current="page" > Categories </router-link>
                          </li>
                     <!--      <li class="nav-item">
                            <router-link to="/" class="nav-link active" style="color: #333333;" aria-current="page" > Profile </router-link>
                          </li> -->

                          <li class="nav-item"> 
                            <router-link to="/login" class="nav-link active" style="color: #333333;" aria-current="page" @click="logout"> <fa icon="right-from-bracket"></fa></router-link>
                          </li>
                      </ul>
                  </div>
            </div>
          </div>
        </nav> 

          

       
   
</template>

<script lang="ts">

   import {ref,onMounted } from 'vue'

   export default {
    
    name:"navBar",
    
    setup(){

      const token =ref<string | null>('');
      const localStorageData = ref<string | null>('');
      const url = ref<string | null>('');


    onMounted(async () => {
     
      
      localStorageData.value = localStorage.getItem('token');

      if (localStorageData.value !== null) {
       
        token.value = localStorageData.value.replace(/^"(.*)"$/, '$1');
      }
   
    });

       const logout = async () => {
    
             url.value = 'http://localhost/api/auth/logout';

            try{

                await fetch(url.value, {
                    method: 'POST',
                    headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token.value}`, },
                });

                localStorage.removeItem('token' as string);

            } catch (error) {
        
                console.error(error);
            } 
        
        
      } 

      return{
        token,
        logout
      }
    }

   }

   

</script>

<style>

        .dropdown {
            display: none;
          }

        .dropdown-btn {
            background-color: transparent;
            border: none;
            color: #ffffff;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
        }

        .dropdown-btn #icon {
            margin-left: 90px;
        }

        .dropdown-content {
            display: none;
            position: relative;
            border-radius: 10px;
            background-color: #ffffff;
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
            z-index: 1;
        }

        .dropdown-content a {
            color: #333333;
            padding: 12px;
            display: block;
            border-radius: 10px;
            text-decoration: none;

        }

    
        @media screen and (max-width: 1000px) {
            .menu {
                display: none;
            }

            .dropdown {
              display: block;
           
            }

            .dropdown-btn {
                display: flex;
            }

            .dropdown-content {
                position: absolute;
             
                display: none;
        
            }

            .dropdown:hover .dropdown-content {
                display: block;
            }
        }
</style>
