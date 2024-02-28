<template>

    <navBar></navBar>

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
                <h4 class="pt-3">Our Categories</h4>
                
                <div v-if="role == 'admin'">
                    <router-link id="add-category" to="/category/add" >
                        <button class="btn">Add a new Category</button>
                    </router-link>
                </div>

            </div>
        </div>
        <div class="row">
           <div v-for="category of filteredCategories" :key="category.id" class="col-md-6 col-xl-4 col-12 pt-3  justify-content-around d-flex">
            
                <categoryBox :category="category">
                </categoryBox>
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

    import categoryBox from '../../components/category/categoryBox.vue';
    import navBar from '@/components/navBar.vue';
    import{onMounted,ref,computed } from 'vue';


    export default {
        name: 'categoriesPage',

        components : {navBar,categoryBox},
      
        setup(){
             
             const successMessage = ref<string | null>('');
             const errorMessage = ref<string | null>('');
             const url = ref<string | null>('');
             const localStorageData = ref<string | null>('');
             const token = ref<string | null>('');
             const categories = ref<any[]>([]);
             let totalPaginas = ref<number>(0);
             const contador = ref<number>(0);
             const data = ref<any | null>('');
             const search = ref<string>('');
             const role = ref<string | null>('');

             onMounted( async ()=>{   
     
              localStorageData.value = localStorage.getItem('token');

              role.value = localStorage.getItem('role');
     
              if(localStorageData.value != null && role.value != null){
     
               token.value = localStorageData.value.replace(/^"(.*)"$/, '$1');
 
               role.value = role.value.replace(/^"(.*)"$/, '$1');
                     
               url.value= 'http://localhost/api/auth/categoria';
                     
               try{
                       
                   const response =  await fetch(url.value, {
                             
                   headers: { 
                     'Accept': 'application/json',
                    
                     'Authorization': `Bearer ${token.value}`,
                     },
                   });
     
                   const data = await response.json();     

    
                   totalPaginas.value = Math.ceil(data[0].total/data[0].per_page);
                
                                                  
                   categories.value = data[0].data;

              
 
                   } catch (error) {
                     
                       errorMessage.value = 'Algo deu errado ou o token expirou';
                       successMessage.value = ''; // Limpar mensagem de sucesso
     
                     } 
              
               }
               
            });


            const filteredCategories = computed(() => {
                        // Use a função filter para filtrar as categorias com base na pesquisa
                        return categories.value.filter((category: any) => {
                            // Aqui você pode ajustar a lógica de filtro conforme necessário
                            // Neste exemplo, estamos verificando se o nome da categoria contém a string de pesquisa
                            return category.categoria.toLowerCase().includes(search.value.toLowerCase());
                        });
                    });

         

            const goToPage = async (page:any) => {

                if (page >= 1 && page <= totalPaginas.value) {

                   contador.value = page;
                    
                            
                 url.value= 'http://localhost/api/auth/categoria?page='+ contador.value;
                     
                     try{
                             
                         const response =  await fetch(url.value, {
                                   
                         headers: { 
                           'Accept': 'application/json',
                          
                           'Authorization': `Bearer ${token.value}`,
                           },
                         });
           
                         const data = await response.json();     
                      
                                                                 
                         categories.value = data[0].data;
                      
           
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
                    
                    url.value= 'http://localhost/api/auth/categoria?page='+ contador.value;
                     
                     try{
                             
                         const response =  await fetch(url.value, {
                                   
                         headers: { 
                           'Accept': 'application/json',
                          
                           'Authorization': `Bearer ${token.value}`,
                           },
                         });
           
                         data.value = await response.json();     
                         
                                         
                         categories.value = data.value[0].data;
                      
           
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
                      
                    url.value= 'http://localhost/api/auth/categoria?page='+ contador.value;
                     
                     try{
                             
                         const response =  await fetch(url.value, {
                                   
                         headers: { 
                           'Accept': 'application/json',
                          
                           'Authorization': `Bearer ${token.value}`,
                           },
                         });
           
                         const data = await response.json();     
                         
                                         
                         categories.value = data[0].data;
                      
           
                         } catch (error) {
                           
                             console.error(error);
                             errorMessage.value = 'Algo deu errado ou o token expirou';
                             successMessage.value = ''; // Limpar mensagem de sucesso
           
                           }

                }
                };

         
           
     
            return{
             errorMessage,
             categories,
             totalPaginas,
             goToPage,
             previousPage,
             nextPage,
             contador,
             search,
             filteredCategories,
             role
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

    #add-category {
      
        font-weight: 500;
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


