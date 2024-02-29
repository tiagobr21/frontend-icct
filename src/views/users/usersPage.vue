<template>

    <navBar></navBar>

     <!-- Spinner -->
     <div v-if="loading" class="spinner-overlay">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

    <div class="search-container">
        <input type="search" v-model="search" class="search-input" placeholder="Pesquisar...">
        <fa class="search-icon" icon="search"></fa>
    </div>

    <main v-if="errorMessage" class="form-sign w-110 m-auto">
      <!-- Exibir mensagem de erro -->
      <div  class="alert alert-danger" role="alert">
            {{ errorMessage }}
    </div>
   </main>

    <div class="container">
        <div class="row">
            <div class="col-12 text-center">
                <h4 class="pt-3">Users</h4>
                
                <div v-if="role == 'admin'">
                    <router-link id="add-user" to="/register" >
                        <button id="add-user" class="btn">Add a new User</button>
                    </router-link>
                </div>

            </div>
        </div>

        <div class="row">
           <div v-for="user of filteredUsers" :key="user.id" class="col-md-6 col-xl-4 col-12 pt-3  justify-content-around d-flex">
            
                <userBox :user="user">
                </userBox>
            </div> 
        </div>
        
    </div>
    <main class="form-sign w-110 m-auto">
        <nav class="navagation" aria-label="Page navigation example">
                <ul class="pagination">
                    <li @click="previousPage" :class="{ 'disabled': contador === 1 }" class="page-item"><a class="page-link" href="#">Previous</a></li>
                    <li v-for="pagina in totalPaginas" v-bind:key="pagina" class="page-item"  @click="goToPage(pagina)"><a class="page-link" > {{ pagina }}</a></li>
                    <li @click="nextPage" :class="{ 'disabled': contador === totalPaginas }" class="page-item"><a class="page-link">Next</a></li>
                </ul>
        </nav>
    </main> 
</template>

<script lang="ts">

    import userBox from '../../components/user/userBox.vue';
    import navBar from '@/components/navBar.vue';
    import{onMounted,ref,computed } from 'vue';


    export default {
        name: 'usersPage',

        components : {navBar,userBox},
      
        setup(){
             
             const successMessage = ref<string | null>('');
             const errorMessage = ref<string | null>('');
             const url = ref<string | null>('');
             const localStorageData = ref<string | null>('');
             const token = ref<string | null>('');
             const users = ref<any[]>([]);
             let totalPaginas = ref<number>(0);
             let contador = ref<number>(1);
             const data = ref<any | null>('');
             const search = ref<string>('');
             const role = ref<string | null>('');
             const loading = ref<boolean | null>(false);

             onMounted( async ()=>{   
     
              localStorageData.value = localStorage.getItem('token');

              role.value = localStorage.getItem('role');
     
              loading.value = true;

              if(localStorageData.value != null && role.value != null){
     
               token.value = localStorageData.value.replace(/^"(.*)"$/, '$1');
 
               role.value = role.value.replace(/^"(.*)"$/, '$1');
                     
               url.value= 'http://localhost:3000/user';
                     
               try{
                       
                   const response =  await fetch(url.value, {
                             
                   headers: { 
                     'Accept': 'application/json',
                    
                     'Authorization': `Bearer ${token.value}`,
                     },
                   });

                   loading.value = false;
     
                   const data = await response.json(); 
                
    
                   totalPaginas.value = data.totalPages;
                                                  
                   users.value = data.data.rows;
              
 
                   } catch (error) {
                     
                       errorMessage.value = 'Algo deu errado';
                       successMessage.value = ''; // Limpar mensagem de sucesso
     
                     } 
              
               } else{
                    errorMessage.value = 'Seu token expirou faça login';
                    successMessage.value = ''; // Limpar mensagem de sucesso
                    loading.value = false;
              }
               
            });


            const filteredUsers = computed(() => {
                        // Use a função filter para filtrar as users com base na pesquisa
                        return users.value.filter((user: any) => {
                       
                            
                            // Aqui você pode ajustar a lógica de filtro conforme necessário
                            // Neste exemplo, estamos verificando se o nome da user contém a string de pesquisa
                            return user.name.toLowerCase().includes(search.value.toLowerCase());
                        });
                    });

         

            const goToPage = async (page:any) => {

                if (page >= 1 && page <= totalPaginas.value) {
                    

                   contador.value = page;
                    
                            
                 url.value= 'http://localhost:3000/user?page='+ contador.value;
                     
                     try{
                             
                         const response =  await fetch(url.value, {
                                   
                         headers: { 
                           'Accept': 'application/json',
                          
                           'Authorization': `Bearer ${token.value}`,
                           },
                         });
           
                         const data = await response.json();     
                        
                         
                         
                                                                 
                         users.value = data.data.rows;
                      
           
                         } catch (error) {
                           
                             console.error(error);
                             errorMessage.value = 'Algo deu errado ou o token expirou';
                             successMessage.value = ''; // Limpar mensagem de sucesso
           
                           }

                }
                };

                const previousPage = async () => {
                
                 if (contador.value > 1) {
                    contador.value--;
                    
                    url.value= 'http://localhost:3000/user?page='+ contador.value;
                     
                     try{
                             
                         const response =  await fetch(url.value, {
                                   
                         headers: { 
                           'Accept': 'application/json',
                          
                           'Authorization': `Bearer ${token.value}`,
                           },
                         });
           
                         data.value = await response.json();     
          
                         users.value = data.value.data.rows;
                      
           
                         } catch (error) {
                           
                             console.error(error);
                             errorMessage.value = 'Algo deu errado ou o token expirou';
                             successMessage.value = ''; // Limpar mensagem de sucesso
           
                           }

                }
                };

                const nextPage = async () => {
                 
                    
                if (contador.value < totalPaginas.value) {
                    

                    contador.value++;
                      
                    url.value= 'http://localhost:3000/user?page='+ contador.value;
                     
                     try{
                             
                         const response =  await fetch(url.value, {
                                   
                         headers: { 
                           'Accept': 'application/json',
                          
                           'Authorization': `Bearer ${token.value}`,
                           },
                         });
           
                         const data = await response.json();     
                         
                         console.log(data);
                         
                                         
                         users.value = data.data.rows;
                      
           
                         } catch (error) {
                           
                             console.error(error);
                             errorMessage.value = 'Algo deu errado ou o token expirou';
                             successMessage.value = ''; // Limpar mensagem de sucesso
           
                           }

                }
                };

         
           
     
            return{
             errorMessage,
             users,
             totalPaginas,
             goToPage,
             previousPage,
             nextPage,
             contador,
             search,
             filteredUsers,
             role,
             loading
            }

            
         }

         

    }
</script>

<style >
    h4 {
        font-family: 'Roboto', sans-serif;
        color: #484848;
        font-weight: 700;
    }

    #add-user {
        background-color:cadetblue;
        
    }
 
    #add-user:hover {
    color: #484848;
     
 }

    .navagation{
        margin:-70px 0px 0px 60px;
    }

    .search-container {
            position: relative;
            max-width: 300px;
            margin: 20px;
            margin-left: 10px;
        }

        .search-input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;

        }

        .search-icon {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #aaa;
            cursor: pointer;
        }
</style>


