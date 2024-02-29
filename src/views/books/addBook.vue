<template>
   <navBar></navBar>

         <!-- Spinner -->
         <div v-if="loading" class="spinner-overlay">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
   

    <!-- Exibir mensagem de sucesso -->
      <div v-if="successMessage" class="alert alert-success" role="alert">
          {{ successMessage }}
      </div>

      <!-- Exibir mensagem de erro -->
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
      </div>

  
  <div class="container">
    <div class="row">
      <div class="col-12 text-center">
        <h4 class="pt-3">Add new Book</h4>
      </div>
    </div>

    <div class="row">
      <div class="col-3"></div>
      <div class="col-md-6 px-5 px-md-0">
       <form>

         <div class="form-group">
           <label>Name</label>
           <input v-model="data.nome" type="text" class="form-control" required>
           <p v-if="errors.nome" class="text-danger">{{ errors.nome }}</p>
         </div>
         
         <div class="form-group">
           <label>Author</label>
           <input v-model="data.nomeDoAutor" type="text" class="form-control" required>
           <p v-if="errors.nomeDoAutor" class="text-danger">{{ errors.nomeDoAutor }}</p>
         </div>

         <div class="form-group">
           <label>Release</label>
           <input v-model="data.lancamento" type="text" class="form-control" required>
           <p v-if="errors.lancamento" class="text-danger">{{ errors.lancamento }}</p>
         </div>

         <div class="form-group">
           <label>Type</label>
           <input v-model="data.tipo" type="text" class="form-control" required>
           <p v-if="errors.tipo" class="text-danger">{{ errors.tipo }}</p>
         </div>

         <div class="form-group">
           <label>Gender</label>
           <input v-model="data.genero" type="text" class="form-control" required> 
           <p v-if="errors.genero" class="text-danger">{{ errors.genero }}</p>
         </div>

         <div class="form-group">
           <label>Publishing Company</label>
           <input v-model="data.editora" type="text" class="form-control" required>
           <p v-if="errors.editora" class="text-danger">{{ errors.editora }}</p>
         </div>

         <div class="form-group">
          <label>Year Edition</label>
          <input v-model="data.anoEdicao" type="text" class="form-control" required>
          <p v-if="errors.anoEdicao" class="text-danger">{{ errors.anoEdicao }}</p>
        </div>
        
        <div class="form-group">
          <label>Number Edition</label>
          <input v-model="data.numEdicao" type="text" class="form-control" required>
          <p v-if="errors.numEdicao" class="text-danger">{{ errors.numEdicao }}</p>
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
  import {reactive,ref} from 'vue';
  import axios from 'axios';

export default {
  
  
  name: 'addBook',
  components : {navBar},

  setup() {

    const successMessage = ref<string | null>('');
    const errorMessage = ref<string | null>('');
    const url = ref<string | null>('');
    const localStorageData = ref<string | null>('');
    const token = ref<string | null>('');
    const loading = ref<boolean | null>(false);


   
    const data = reactive({
        nome:'',
        nomeDoAutor:'',
        lancamento:'',
        tipo:'',
        genero: '', 
        editora:'',
        anoEdicao:'',
        numEdicao: ''
      });

    const errors = reactive({
         nome:'',
         nomeDoAutor:'',
         lancamento:'',
         tipo:'',
         genero: '', 
         editora:'',
         anoEdicao:'',
         numEdicao: ''
      });

      const validate = () => {
         errors.nome = data.nome.length > 0 ? '' : 'Name is required';
         errors.nomeDoAutor = data.nomeDoAutor.length > 0 ? '' : 'Author is required';
         errors.lancamento = data.lancamento.length > 0 ? '' : 'Release is required';
         errors.tipo = data.tipo.length > 0 ? '' : 'Type Date is required';
         errors.genero = data.genero.length > 0 ? '' : 'Gender Date is required';
         errors.editora = data.editora.length > 0 ? '' : 'Publishing Company is required';
         errors.anoEdicao = data.anoEdicao.length > 0 ? '' : 'Year Edition is required';
         errors.numEdicao = data.numEdicao.length > 0 ? '' : 'Number Edition is required';
         
         return (
            !errors.nome &&
            !errors.nomeDoAutor &&
            !errors.lancamento &&
            !errors.tipo &&
            !errors.genero &&
            !errors.editora &&
            !errors.anoEdicao &&
            !errors.numEdicao
         );
      };


    const add= async () =>{

   
         
         if(validate()){
 
            loading.value = true; // Ativa o spinner
            
            localStorageData.value = localStorage.getItem('token');

            if(localStorageData.value != null){

               token.value = localStorageData.value.replace(/^"(.*)"$/, '$1');
      
                     
            url.value = 'http://localhost:3000/books/add';
          
            try {

            const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.value}`,
                  };

                  const dataToSend = {
                    nome: data.nome,
                    nomeDoAutor: data.nomeDoAutor,
                    lancamento: data.lancamento,
                    tipo: data.tipo,
                    genero: data.genero,
                    editora: data.editora,
                    anoEdicao: data.anoEdicao,
                    numEdicao: data.numEdicao,
                  };

                  // console.log(dataToSend);
                  

                  const formData = new FormData();

                  Object.entries(dataToSend).forEach(([key, value]) => {
                    formData.append(key, value);
                  });
                  

                 const response = await axios.post(url.value, formData, { headers });

                 

                   if (response.status == 200) {

  
                    successMessage.value = response.data.message;
                    errorMessage.value = ''; // Limpar mensagem de erro
                                  

                    } else {

                    errorMessage.value = response.data.message;
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
     }

    
    return{
      data,
      add,
      errors,
      errorMessage,
      successMessage,
      loading,

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