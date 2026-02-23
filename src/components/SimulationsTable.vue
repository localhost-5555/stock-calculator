<script setup lang="ts">
import { simulations, deleteSimulation } from '@/composables/useSimulations';
import { Trash2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

</script>

<template>
  <DataTable :value="simulations" scrollable scrollHeight="55vh">
    <Column field="company" header="Company" sortable />
    <Column field="priceNow" header="Now" sortable />
    <Column field="quantity" header="Quantity" sortable />
    <Column field="buyPrice" header="B Price" sortable />
    <Column field="valueInvested" header="Investment" sortable />
    <Column field="breakEven" header="Break Even" sortable />
    <Column field="profit" header="Profit" sortable />
    <Column field="minFee" header="Min Fee" sortable />
    <Column field="commissionRate" header="Commission" sortable />
    <Column field="vatRate" header="VAT" sortable />
    <Column header="">

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