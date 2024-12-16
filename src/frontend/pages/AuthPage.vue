<script>
  import Logo from "../components/Logo.vue";
  import AuthForm from "../components/AuthForm.vue";
  
  export default {
    components: {
      Logo,
      AuthForm,
    },
  };
</script>

<template>
    <div class="auth-page">
      <Logo />
      <AuthForm />
    </div>
</template>
  
<style scoped>
  .auth-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f2e9f3;
  }
</style>
  