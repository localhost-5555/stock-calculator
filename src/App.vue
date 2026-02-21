<script setup lang="ts">
import Header from './components/Header.vue';
import Calculator from './components/Calculator.vue';
import SimulationsTable from './components/SimulationsTable.vue';
import Toast from 'primevue/toast';
</script>

<template>
  <Toast />
  <Header></Header>
  <Calculator></Calculator>
  <SimulationsTable></SimulationsTable>
</template>

