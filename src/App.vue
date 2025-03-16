<template>
  <div class="app">
    <header>
      <h1>Simulateur d'Audit Énergétique</h1>
    </header>
    
    <main>
      <FormAudit 
        v-if="!showResults" 
        @audit-calculate="handleAuditCalculation" 
      />
      <ResultatsAudit 
        v-if="showResults" 
        :logement="logementData" 
        :showResults="showResults" 
        @back-to-form="showResults = false" 
      />
    </main>
    
    <footer>
      <p>Simulateur d'audit énergétique - Prototype v1.0</p>
    </footer>
  </div>
</template>

<script>
import { ref } from 'vue';
import FormAudit from './components/FormAudit.vue';
import ResultatsAudit from './components/ResultatsAudit.vue';

export default {
  name: 'App',
  components: {
    FormAudit,
    ResultatsAudit
  },
  setup() {
    const showResults = ref(false);
    const logementData = ref({});
    
    function handleAuditCalculation(data) {
      logementData.value = data;
      showResults.value = true;
      
      // Faire défiler vers le haut pour voir les résultats
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    return {
      showResults,
      logementData,
      handleAuditCalculation
    };
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1rem;
}

main {
  flex: 1;
  padding: 20px;
}

footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

h1, h2, h3, h4 {
  margin-bottom: 0.5rem;
}

button {
  cursor: pointer;
}
</style>