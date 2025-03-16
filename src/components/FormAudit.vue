<template>
    <div class="form-container">
      <h2>Informations du logement</h2>
      <form @submit.prevent="calculerAudit">
        <div class="form-section">
          <h3>Caractéristiques générales</h3>
          <div class="form-group">
            <label for="surface">Surface habitable (m²)</label>
            <input id="surface" v-model="logement.surfaceTotale" type="number" required min="1" step="0.1">
          </div>
          <div class="form-group">
            <label for="annee">Année de construction</label>
            <input id="annee" v-model.number="logement.anneeConstruction" type="number" required>
          </div>
          <div class="form-group">
            <label for="chauffage">Système de chauffage</label>
            <select id="chauffage" v-model="logement.chauffage" required>
              <option v-for="option in systemesChaufage" :key="option.type" :value="option">
                {{ option.type }}
              </option>
            </select>
          </div>
        </div>
  
        <div class="form-section">
          <h3>Parois du logement</h3>
          <div v-for="(paroi, index) in logement.parois" :key="index" class="paroi-item">
            <div class="form-group">
              <label :for="`type-${index}`">Type de paroi</label>
              <select :id="`type-${index}`" v-model="paroi.typeParoi" required @change="updateResistance(index)">
                <option v-for="option in typesParois" :key="option.type" :value="option">
                  {{ option.type }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label :for="`surface-${index}`">Surface (m²)</label>
              <input :id="`surface-${index}`" v-model="paroi.surface" type="number" required min="0.1" step="0.1">
            </div>
            <button type="button" class="btn-remove" @click="supprimerParoi(index)" v-if="logement.parois.length > 1">
              Supprimer
            </button>
          </div>
          <button type="button" class="btn-add" @click="ajouterParoi">+ Ajouter une paroi</button>
        </div>
  
        <div class="form-section">
          <h3>Températures</h3>
          <div class="form-group">
            <label for="temp-int">Température intérieure (°C)</label>
            <input id="temp-int" v-model="logement.temperatureInterieure" type="number" required min="0" max="30" step="0.1">
          </div>
          <div class="form-group">
            <label for="temp-ext">Température extérieure moyenne (°C)</label>
            <input id="temp-ext" v-model="logement.temperatureExterieure" type="number" required min="-20" max="30" step="0.1">
          </div>
        </div>
  
        <button type="submit" class="btn-submit">Calculer l'audit énergétique</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { paroisData } from '../data/parois';
  import { chauffageData } from '../data/chauffage';
  
  export default {
    name: 'FormAudit',
    emits: ['audit-calculate'],
    setup(props, { emit }) {
      const typesParois = ref(paroisData);
      const systemesChaufage = ref(chauffageData);
  
      const logement = ref({
        surfaceTotale: 100,
        anneeConstruction: 1990,
        chauffage: chauffageData[0],
        temperatureInterieure: 19,
        temperatureExterieure: 14.1,
        parois: [
          {
            typeParoi: paroisData[0],
            resistance: paroisData[0].resistance,
            surface: 0
          }
        ]
      });
  
      function updateResistance(index) {
        logement.value.parois[index].resistance = logement.value.parois[index].typeParoi.resistance;
      }
  
      function ajouterParoi() {
        logement.value.parois.push({
          typeParoi: paroisData[0],
          resistance: paroisData[0].resistance,
          surface: 0
        });
      }
  
      function supprimerParoi(index) {
        logement.value.parois.splice(index, 1);
      }
  
      function calculerAudit() {
        // Convert string inputs to numbers before emitting
        const logementData = JSON.parse(JSON.stringify(logement.value));
        logementData.surfaceTotale = parseFloat(logementData.surfaceTotale);
        logementData.temperatureInterieure = parseFloat(logementData.temperatureInterieure);
        logementData.temperatureExterieure = parseFloat(logementData.temperatureExterieure);
        logementData.parois.forEach(paroi => {
          paroi.surface = parseFloat(paroi.surface);
        });
        emit('audit-calculate', logementData);
      }
  
      return {
        logement,
        typesParois,
        systemesChaufage,
        ajouterParoi,
        supprimerParoi,
        updateResistance,
        calculerAudit
      };
    }
  };
  </script>
  
  <style scoped>
  .form-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .form-section {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input, select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .paroi-item {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #eee;
  }
  
  .btn-remove {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn-add {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 5px;
  }
  
  .btn-submit {
    background-color: #2196F3;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
  }
  </style>