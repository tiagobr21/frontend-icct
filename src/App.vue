<template>
  
       <router-view/>
</template>

<script >
  


export default{

}

</script>

<style>

  .form-sign {

    max-width: 330px;
    padding-top: 100px;

  }

    .form-sign .form-floating:focus-within {
    z-index: 2;
    }

    .form-sign #floatingPassword {
    margin-bottom: 0px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    }


    .form-sign #floatingPassworConfirm {
    margin-bottom: 20px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    }


  /* spinner */

  .spinner-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Cor de fundo com opacidade 0.5 para criar um efeito transparente */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; /* Z-index alto para garantir que fique acima de outros elementos */
  }

  .spinner-border {
     color: #fff; /* Cor do spinner */
  }

</style>
