<template>
  <div class="flex flex-col gap-4 p-2">
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-sm text-muted-foreground">Quantity</label>
        <input v-model.number="form.quantity" type="number" class="input" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm text-muted-foreground">Buy Price</label>
        <input v-model.number="form.buyPrice" type="number" class="input" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm text-muted-foreground">Min Fee</label>
        <input v-model.number="form.minFee" type="number" class="input" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm text-muted-foreground">Commission Rate (%)</label>
        <input v-model.number="form.commissionRate" type="number" class="input" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm text-muted-foreground">VAT Rate (%)</label>
        <input v-model.number="form.vatRate" type="number" class="input" />
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-2">
      <Button variant="ghost" @click="cancel">Cancel</Button>
      <Button class="bg-emerald-500 hover:bg-emerald-400" @click="save">Save</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, reactive, computed, ref } from 'vue';
import { Button } from '@/components/ui/button';
import { simulations, updateSimulation } from '@/composables/useSimulations';
import type { Simulation } from '@/composables/useSimulations';

const dialogRef = inject<Ref<any>>('dialogRef');

const simulationId = computed(() => dialogRef.value.data.simulationId);

const simulation = computed(() =>
  simulations.value.find(s => s.id === simulationId.value)
);

// Reactive shallow copy so edits don't mutate the original until Save
const form = reactive<Partial<Simulation>>({ ...simulation.value });

const cancel = () => {
  try {
    dialogRef.value.close();
  } catch (e) {
    console.error('Dialog close error:', e);
  }
};

const save = () => {
  updateSimulation(simulationId.value, form);
  dialogRef.value.close({ success: true });
};
</script>