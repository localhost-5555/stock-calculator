<script setup lang="ts">
import { simulations, deleteSimulation, updateStorage } from '@/composables/useSimulations';
import { Trash2, Settings2Icon } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { computed } from 'vue'

import { useDialog } from 'primevue/usedialog';
import DynamicDialog from 'primevue/dynamicdialog';
import DynamicDialogEdit from './DynamicDialogEdit.vue';

const dialog = useDialog();

const openDialog = (id: number) => {
  dialog.open(DynamicDialogEdit, {
    props: {
      header: 'Edit simulation',
      style: { width: '50vw' },
      modal: true
    },
    data: {
      simulationId: id
    },
    onClose: (options) => {
      if (options?.data) {
        console.log(options.data);
      }
    }
  });
};

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
      let price = await fetch(`http://localhost:3000?symbol=${simulation.code}`);
      if (!price.ok) throw new Error('Stock not found');
      
      const data = await price.json();
      
      // Update the price of the simulation
      updateStorage(data);
      // simulation.priceNow = data.regularMarketPrice;
    } catch (error) {
      console.error("Error updating simulation: ", error);
    }
  }
};

const totalProfit = computed(() => 
  simulations.value.reduce((acc, sim) => acc + sim.profit, 0)
)

const totalInvested = computed(() => 
  simulations.value.reduce((acc, sim) => acc + sim.valueInvested, 0)
)

const balance = computed(() => 
  simulations.value.reduce((acc, sim) => acc + sim.valueInvested + sim.profit, 0)
)
</script>

<template>
  <div class="card flex gap-2 p-4 rounded-md overflow-x-scroll">
    <div class="mini-card">
      <h3 class="text-sm">Total Profit</h3>
      <p :class="totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'" class="text-2xl font-bold">
        {{ formatCurrency(totalProfit) }}
      </p>
    </div>
    <div class="mini-card">
      <h3 class="text-sm">Total Invested</h3>
      <p class="text-2xl font-bold">
        {{ formatCurrency(totalInvested) }}
      </p>
    </div>
    <div>
      <h3 class="text-sm">Balance</h3>
      <p class="text-2xl font-bold">
        {{ formatCurrency(balance) }}
      </p>
    </div>
  </div>
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

    <Column class="flex gap-2">
      <template #body="{ data }">
        <Button class="hover:border-red-500" variant="ghost" size="icon" @click="deleteSimulation(data.id)">
          <Trash2 class="h-4 w-4 text-red-500" />
        </Button>
        <Button class="hover:border-sky-500" variant="ghost" size="icon" @click="openDialog(data.id)">
          <Settings2Icon class="h-4 w-4 text-sky-500" />
        </Button>
      </template>
    </Column>
  </DataTable>

  <div>
    <DynamicDialog/>
  </div>
</template>


