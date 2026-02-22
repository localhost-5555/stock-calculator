<script setup lang="ts">
import Header from './components/Header.vue';
import Calculator from './components/Calculator.vue';
import SimulationsTable from './components/SimulationsTable.vue';
import Toast from 'primevue/toast';
</script>

<template>
  <div class="flex flex-col gap-3">
    <Toast />
    <Header></Header>
    <Calculator></Calculator>
    <hr>
    <SimulationsTable></SimulationsTable>
  </div>
</template>

