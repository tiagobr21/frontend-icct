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
        <h4 class="pt-3">Add new Category</h4>
      </div>
    </div>

    <div class="row">
      <div class="col-3"></div>
      <div class="col-md-6 px-5 px-md-0">
       <form>
         
         <div class="form-group">
           <label>Product Name</label>
           <input v-model="data.nome" type="text" class="form-control" required>
           <p v-if="errors.nome" class="text-danger">{{ errors.nome }}</p>
         </div>
         <div class="form-group">
           <label>Product Description</label>
           <input v-model="data.descricao" type="text" class="form-control" required>
           <p v-if="errors.descricao" class="text-danger">{{ errors.descricao }}</p>
         </div>
         <div class="form-group">
           <label>Product Price</label>
           <input v-model="data.preco" type="text" class="form-control" required>
           <p v-if="errors.preco" class="text-danger">{{ errors.preco }}</p>
         </div>
         <div class="form-group">
           <label>Product Date Validity</label>
           <input v-model="data.data_validade" type="text" class="form-control" required>
           <p v-if="errors.data_validade" class="text-danger">{{ errors.data_validade }}</p>
         </div>
         <div class="form-group">
           <label>Product Image</label>
           <input @change="handleImageChange" type="file" class="form-control" required > 
           <p v-if="errors.imagem" class="text-danger">{{ errors.imagem }}</p>
         </div>
         <div class="form-group">
           <label>Product Cetegory ID</label>
           <input v-model="data.categoria_id" type="text" class="form-control" required>
           <p v-if="errors.categoria_id" class="text-danger">{{ errors.categoria_id }}</p>
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
  import {reactive,ref,onMounted} from 'vue';
  import axios from 'axios';

export default {
  
  
  name: 'addCategory',
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
        descricao:'',
        preco:'',
        data_validade:'',
        imagem:  null as File | null, 
        categoria_id:'',
      });

    

       function handleImageChange($event: Event) {
            const target = $event.target as HTMLInputElement;
            if (target && target.files) {
              data.imagem = target.files[0];
                 
                
            }
        } 

    

    onMounted(async() => {

    });


    const errors = reactive({
         nome:'',
         descricao:'',
         preco:'',
         data_validade:'',
         imagem: '', 
         categoria_id:'',
      });

      const validate = () => {
         errors.nome = data.nome.length > 0 ? '' : 'Name is required';
         errors.descricao = data.descricao.length > 0 ? '' : 'Description is required';
         errors.preco = data.preco.length > 0 ? '' : 'Price is required';
         errors.data_validade = data.data_validade.length > 0 ? '' : 'Expiration Date is required';

         errors.categoria_id = data.categoria_id.length > 0 ? '' : 'Category ID is required';

           // Validar se a data_validade é menor que o dia atual
            const currentDate = new Date();
            const expirationDate = new Date(data.data_validade);
            

            if (expirationDate < currentDate) {
              errors.data_validade = 'The expiration date must be greater than the current date';
            } 

         return (
            !errors.nome &&
            !errors.descricao &&
            !errors.preco &&
            !errors.data_validade &&
            !errors.imagem &&
            !errors.categoria_id
         );
      };


    const add= async () =>{

   
         
         if(validate()){
 
            loading.value = true; // Ativa o spinner
            
            localStorageData.value = localStorage.getItem('token');

            if(localStorageData.value != null){

               token.value = localStorageData.value.replace(/^"(.*)"$/, '$1');
      
                     
            url.value = 'http://localhost/api/auth/produto/add';
          
            try {

            const headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token.value}`,
                  };

                  const dataToSend = {
                    nome: data.nome,
                    descricao: data.descricao,
                    preco: data.preco,
                    data_validade: data.data_validade,
                    categoria_id: data.categoria_id,
                  };

                  const formData = new FormData();

                  Object.entries(dataToSend).forEach(([key, value]) => {
                    formData.append(key, value);
                  });
            
                  if (data.imagem instanceof Blob) {
                        formData.append('imagem', data.imagem);
                  }

                  console.log(formData);
                  

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
      handleImageChange
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