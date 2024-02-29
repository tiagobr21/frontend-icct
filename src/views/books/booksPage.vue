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
        
    <div class="filters">
        <strong >Filters</strong>   
        <button @click="sortBooks" id="sort" class="btn">Sort Alphabetically</button>
   
        <select class="form-select form-select-sm " v-model="selectedAuthor">
                  <option value="">All Authors</option>
                  <option v-for="nomeDoAutor in uniqueAuthors" :key="nomeDoAutor" :value="nomeDoAutor">{{ nomeDoAutor }}</option>
        </select>

        <select class="form-select form-select-sm" v-model="selectedGender">
            <option value="">All Gender</option>
            <option v-for="genero in uniqueGender" :key="genero" :value="genero">{{ genero }}</option>
        </select>

        <select class="form-select form-select-sm" v-model="selectedRelease">
            <option value="">All Release</option>
            <option v-for="lancamento in uniqueRelease" :key="lancamento" :value="lancamento">{{ lancamento }}</option>
        </select>

        <select class="form-select form-select-sm" v-model="selectedPublishingCompany">
            <option value="">All Publishing Company</option>
            <option v-for="editora in uniquePublishingCompany" :key="editora" :value="editora">{{ editora }}</option>
        </select>
        
       
    </div>  

 

   <div class="container">
       <div class="row">
           <div class="col-12 text-center">
               <h4 class="pt-3">Our Books</h4>
  
               <div v-if="role === 'admin'">
                    <router-link  to="/book/add" >
                        <button id="add-book" class="btn">Add a new Book</button>
                    </router-link>
               </div>


           </div>
       </div>

       <main v-if="errorMessage" class="form-sign w-110 m-auto">
        <!-- Exibir mensagem de erro -->
        <div  class="alert alert-danger" role="alert">
              {{ errorMessage }}
      </div>
     </main>    


       <div class="row">
          <div v-for="book of filteredBooks" :key="book.id" class="col-md-6 col-xl-4 col-12 pt-3  justify-content-around d-flex">
           
               <bookBox :book="book">
               </bookBox>
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

   import bookBox from '../../components/book/bookBox.vue';
   import navBar from '@/components/navBar.vue';
   import{onMounted,ref,computed } from 'vue';


   export default {
       name: 'booksPage',

       components : {navBar,bookBox},
     
       setup(){
            
            const successMessage = ref<string | null>('');
            const errorMessage = ref<string | null>('');
            const url = ref<string | null>('');
            const localStorageData = ref<string | null>('');
            const token = ref<string | null>('');
            const books = ref<any[]>([]);
            const allbooks = ref<any[]>([]);
            let totalPaginas = ref<number>(0);
            const contador = ref<number>(0);
            const data = ref<any | null>('');
            const search = ref<string>('');
            const role = ref<string | null>('');
            const selectedAuthor = ref<string>('');
            const selectedGender = ref<string>('');
            const selectedRelease = ref<string>('');
            const selectedPublishingCompany = ref<string>('');
            const uniqueAuthors = ref<string[]>([]);
            const uniqueGender = ref<string[]>([]);
            const uniqueRelease = ref<string[]>([]);
            const uniquePublishingCompany = ref<string[]>([]);
            const loading = ref<boolean | null>(false);
           
            onMounted( async ()=>{   
    
             localStorageData.value = localStorage.getItem('token');

             role.value = localStorage.getItem('role');
             
             loading.value = true;
    
             if(localStorageData.value != null && role.value != null){
    
              token.value = localStorageData.value.replace(/^"(.*)"$/, '$1');
              
              role.value = role.value.replace(/^"(.*)"$/, '$1');
                    
              url.value= 'http://localhost:3000/books';
                    
              try{
                      
                  const response =  await fetch(url.value, {
                            
                  headers: { 
                    'Accept': 'application/json',
                   
                    'Authorization': `Bearer ${token.value}`,
                    },
                  });
    
                  const data = await response.json(); 

                  loading.value = false;
                  
                  totalPaginas.value = Math.ceil(data.totalPages/data.per_page);
                     
                  allbooks.value = data.alldata;
                                                                 
                  books.value = data.data;

                  uniqueAuthors.value = [...new Set(allbooks.value.map((book: any) => book.nomeDoAutor))];

                  uniqueGender.value = [...new Set(allbooks.value.map((book: any) => book.genero))];

                  uniqueRelease.value = [...new Set(allbooks.value.map((book: any) => book.lancamento))];

                  uniquePublishingCompany.value = [...new Set(allbooks.value.map((book: any) => book.editora))];
              
                  } catch (error) {
                    
                      errorMessage.value = 'Algo deu errado ou o token expirou';
                      successMessage.value = ''; // Limpar mensagem de sucesso
    
                  } finally {
               
                  loading.value = false; // Desativa o spinner

               }   
             
              }else{
                    errorMessage.value = 'Seu token expirou faça login';
                    successMessage.value = ''; // Limpar mensagem de sucesso
                    loading.value = false;
              }

     
              
           });


           const filteredBooks = computed(() => {
                    
                       
                       return books.value.filter((book: any) => {
                        
                        
                        const lowerCaseSearch = search.value.toLowerCase();
                        const lowerCaseSelectedAuthor = selectedAuthor.value.toLowerCase();
                        const lowerCaseSelectedGender = selectedGender.value.toLowerCase();   
                        const SelectedRelease = selectedRelease.value;  
                        const lowerCasePublishingCompany = selectedPublishingCompany.value.toLowerCase(); 
                        
                        // console.log(lowerCasePublishingCompany);
                        
                                
                                // Verifique se o nome ou a descrição do produto contém a string de pesquisa
                                return (
                                (book.nome.toLowerCase().includes(lowerCaseSearch) || book.nomeDoAutor.toLowerCase().includes(lowerCaseSearch)) &&
                                (lowerCaseSelectedAuthor === '' || book.nomeDoAutor.toLowerCase() === lowerCaseSelectedAuthor) &&
                                (SelectedRelease === '' || book.lancamento === SelectedRelease) &&
                                (lowerCaseSelectedGender === '' || book.genero.toLowerCase() === lowerCaseSelectedGender) &&
                                (lowerCasePublishingCompany === '' || book.editora.toLowerCase() === lowerCasePublishingCompany)
                                );
                       });
            });

            const sortBooks = () => {
            books.value.sort((a, b) => {
                const nomeA = a.nome.toLowerCase();
                const nomeB = b.nome.toLowerCase();
                if (nomeA < nomeB) return -1;
                if (nomeA > nomeB) return 1;
                return 0;
            });
            };


           const goToPage = async (page:any) => {

               if (page >= 1 && page <= totalPaginas.value) {

                  contador.value = page;
                   
                           
                url.value= 'http://localhost:3000/books?page='+ contador.value;
                    
                    try{
                            
                        const response =  await fetch(url.value, {
                                  
                        headers: { 
                          'Accept': 'application/json',
                          'Authorization': `Bearer ${token.value}`,
                          },
                        });
          
                        const data = await response.json();     

                
                     
                                                                
                        books.value = data.data;
                     
          
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
                   
                   url.value= 'http://localhost:3000/books?page='+ contador.value;
                    
                    try{
                            
                        const response =  await fetch(url.value, {
                                  
                        headers: { 
                          'Accept': 'application/json',
                         
                          'Authorization': `Bearer ${token.value}`,
                          },
                        });
          
                        data.value = await response.json();     
                        
                                        
                        books.value = data.value.data;
                     
          
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
                     
                   url.value= 'http://localhost:3000/books?page='+ contador.value;
                    
                    try{
                            
                        const response =  await fetch(url.value, {
                                  
                        headers: { 
                          'Accept': 'application/json',
                         
                          'Authorization': `Bearer ${token.value}`,
                          },
                        });
          
                        const data = await response.json();    
                        
                    
                        
                        
                                        
                        books.value = data.data;
                     
          
                        } catch (error) {
                          
                            console.error(error);
                            errorMessage.value = 'Algo deu errado ou o token expirou';
                            successMessage.value = ''; // Limpar mensagem de sucesso
          
                          }

               }
               };

        
          
    
           return{
            errorMessage,
            books,
            totalPaginas,
            goToPage,
            previousPage,
            nextPage,
            loading,
            contador,
            search,
            filteredBooks,
            role,
            sortBooks,
            uniqueAuthors,
            uniqueGender,
            uniqueRelease,
            uniquePublishingCompany,
            selectedAuthor,
            selectedGender,
            selectedRelease,
            selectedPublishingCompany

           
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

   #add-book {
       background-color:cadetblue;
       
   }

   #add-book:hover {
   color: #484848;
    
}

   .navagation{
       margin:-70px 0px 0px 60px;
       cursor: pointer;
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
           right: 30px;
           top: 50%;
           transform: translateY(-50%);
           color: #aaa;
           cursor: pointer;
       }

       #sort{
        margin-left: 10px;
        background-color:cadetblue;
       }

       .filters{
        margin-left: 10px;
        display: flex;
      }

      .form-select{
        max-width: 14%;
        padding: 12px;
        height: 0%;
        margin-left: 10px;
        margin-top: 20px;
        background-color: cadetblue;
        color: #fff;
      }
    
      @media screen and (max-width:768px) {
        .filters{
            display: block;
          }
        
        .form-select{
            max-width: 48%;
            padding: 12px;
            height: 0%;
            margin-left: 55px;
            margin-top: 20px;
          }
      }
       
</style>


