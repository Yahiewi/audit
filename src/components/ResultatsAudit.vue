<template>
    <div class="results-container" v-if="showResults">
      <h2>Résultats de l'audit énergétique</h2>
      
      <div class="result-section">
        <h3>Déperditions thermiques</h3>
        <div class="result-card">
          <p><strong>Déperditions totales:</strong> {{ resultats.deperditionsTotales.toFixed(2) }} W/K</p>
          
          <h4>Détail par paroi:</h4>
          <table>
            <thead>
              <tr>
                <th>Type de paroi</th>
                <th>Surface (m²)</th>
                <th>Déperdition (W/K)</th>
                <th>% des pertes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(paroi, index) in resultats.detailParois" :key="index">
                <td>{{ paroi.type }}</td>
                <td>{{ paroi.surface }}</td>
                <td>{{ paroi.deperdition.toFixed(2) }}</td>
                <td>{{ paroi.pourcentage.toFixed(1) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="result-section">
        <h3>Consommation théorique</h3>
        <div class="result-card">
          <p><strong>Consommation annuelle:</strong> {{ resultats.consommationAnnuelle.toFixed(2) }} kWh/an</p>
          <p><strong>Consommation par m²:</strong> {{ (resultats.consommationAnnuelle / logement.surfaceTotale).toFixed(2) }} kWh/m²/an</p>
          <p><strong>Système de chauffage:</strong> {{ logement.chauffage.type }} (rendement: {{ logement.chauffage.rendement }})</p>
          <p><strong>Estimation coût annuel:</strong> {{ calculerCoutAnnuel() }} €/an</p>
        </div>  
      </div>
      
      <div class="result-section" v-if="resultats.travauxRecommandes && resultats.travauxRecommandes.length">
        <h3>Travaux recommandés</h3>
        <div class="result-card">
          <table>
            <thead>
              <tr>
                <th>Type de travaux</th>
                <th>Économie (kWh/an)</th>
                <th>Coût estimé (€)</th>
                <th>Temps de retour (ans)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(travail, index) in resultats.travauxRecommandes.slice(0, 3)" :key="index">
                <td>{{ travail.type }} avec {{ travail.materiau }}</td>
                <td>{{ travail.economieEnergie }}</td>
                <td>{{ travail.coutTravaux }}</td>
                <td>{{ travail.tempsRetour }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <button class="btn-back" @click="retourAuFormulaire">Modifier les données</button>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue';
  import { calculerDeperditionTotale, calculerConsommationTheorique } from '../services/auditCalculator';
  import { suggererTravaux } from '../services/travauxCalculator';
  
  export default {
    name: 'ResultatsAudit',
    props: {
      logement: {
        type: Object,
        required: true
      },
      showResults: {
        type: Boolean,
        default: false
      }
    },
    emits: ['back-to-form'],
    setup(props, { emit }) {
      const resultats = computed(() => {
        // Transformer les données de parois pour le calcul
        const parois = props.logement.parois.map(p => ({
          type: p.typeParoi.type,
          surface: p.surface,
          resistance: p.typeParoi.resistance
        }));
        
        // Calculer les déperditions totales
        const deperditionsTotales = calculerDeperditionTotale(parois);
        
        // Calculer les déperditions par paroi et leur pourcentage
        const detailParois = parois.map(p => {
          const deperdition = p.surface * (1 / p.resistance);
          return {
            type: p.type,
            surface: p.surface,
            deperdition: deperdition,
            pourcentage: (deperdition / deperditionsTotales) * 100
          };
        });
        
        // Calculer la consommation théorique
        const consommationAnnuelle = calculerConsommationTheorique(
          deperditionsTotales,
          props.logement.chauffage.rendement,
          props.logement.temperatureInterieure,
          props.logement.temperatureExterieure
        );
        
        // Suggérer des travaux de rénovation
        const travauxRecommandes = suggererTravaux(
          parois,
          deperditionsTotales,
          props.logement.chauffage.rendement
        );
        
        return {
          deperditionsTotales,
          detailParois,
          consommationAnnuelle,
          travauxRecommandes
        };
      });
      
      function calculerCoutAnnuel() {
        // Hypothèse de prix de l'énergie (€/kWh)
        const prixEnergie = {
          'Chaudière gaz': 0.08,
          'Radiateur électrique': 0.15,
          'Pompe à chaleur': 0.15,
          'Chaudière fioul': 0.1,
          'Poêle à granulés': 0.07
        };
        
        // Trouver le type général du chauffage
        let typeBase = 'Radiateur électrique'; // Par défaut
        for (const type in prixEnergie) {
          if (props.logement.chauffage.type.includes(type)) {
            typeBase = type;
            break;
          }
        }
        
        const cout = resultats.value.consommationAnnuelle * prixEnergie[typeBase];
        return cout.toFixed(2);
      }
      
      function retourAuFormulaire() {
        emit('back-to-form');
      }
      
      return {
        resultats,
        calculerCoutAnnuel,
        retourAuFormulaire
      };
    }
  }
  </script>
  
  <style scoped>
  .results-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .result-section {
    margin-bottom: 20px;
  }
  
  .result-card {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-top: 10px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  th, td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  .btn-back {
    background-color: #607D8B;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
  }
  </style>