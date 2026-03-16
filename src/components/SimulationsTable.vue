<script setup lang="ts">
import { simulations, deleteSimulation } from '@/composables/useSimulations';
import { Trash2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

const formatPercent = (value: number) => `${value}%`;

const updateSimulations = async () => {
  // Update the price of each simulation
  for (const simulation of simulations.value) {
    try {
      // Fetch the price of the company
      let price = await fetch(`http://localhost:3000?symbol=${simulation.company}`);
      if (!price.ok) throw new Error('Stock not found');
      const data = await price.json();
      
      // Update the price of the simulation
      simulation.priceNow = data.regularMarketPrice;
    } catch (error) {
      console.error("Error updating simulation: ", error);
    }
  }
};
</script>

<template>
  <DataTable :value="simulations" scrollable scrollHeight="55vh" class="relative">
    <Button class="bg-emerald-500 hover:bg-emerald-400 absolute top-2 right-2 z-10 opacity-90" @click="updateSimulations">
      <i class="pi pi-refresh" style="font-size: 1rem"></i>
    </Button>
    <Column field="company" header="Company" sortable />
    <Column field="priceNow" header="Now" sortable>
      <template #body="{ data }">{{ formatCurrency(data.priceNow) }}</template>
    </Column>
    <Column field="quantity" header="Quantity" sortable />
    <Column field="buyPrice" header="B Price" sortable>
      <template #body="{ data }">{{ formatCurrency(data.buyPrice) }}</template>
    </Column>
    <Column field="valueInvested" header="Investment" sortable>
      <template #body="{ data }">{{ formatCurrency(data.valueInvested) }}</template>
    </Column>
    <Column field="breakEven" header="Break Even" sortable>
      <template #body="{ data }">{{ formatCurrency(data.breakEven) }}</template>
    </Column>
    <Column field="profit" header="Profit" sortable>
      <template #body="{ data }">
        <span :class="{
          'text-emerald-400 font-semibold': data.profit > 0,
          'text-rose-500 font-semibold': data.profit < 0,
        }">
          {{ formatCurrency(data.profit) }}
        </span>
      </template>
    </Column>
    <Column field="minFee" header="Min Fee" sortable>
      <template #body="{ data }">{{ formatCurrency(data.minFee) }}</template>
    </Column>
    <Column field="commissionRate" header="Commission" sortable>
      <template #body="{ data }">{{ formatPercent(data.commissionRate) }}</template>
    </Column>
    <Column field="vatRate" header="VAT" sortable>
      <template #body="{ data }">{{ formatPercent(data.vatRate) }}</template>
    </Column>

    <template #empty>
      <div class="flex justify-center p-4 text-gray-500">
        No simulations yet. Fill the form and press + to add one.
      </div>
    </template>

    <Column header="">
      <template #body="{ data }">
        <Button variant="ghost" size="icon" @click="deleteSimulation(data.id)">
          <Trash2 class="h-4 w-4 text-red-500" />
        </Button>
      </template>
    </Column>
  </DataTable>
  
</template>