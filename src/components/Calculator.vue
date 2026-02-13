<script setup lang="ts">
import { ref } from 'vue';
import { Plus } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'

import { useToast } from 'primevue/usetoast';
const toast = useToast();

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const selectedSymbol = ref('');
const quantity = ref(0);
const profit = ref(0);
const priceNow = ref(0);
const buyPrice = ref(0);
const loading = ref(false);
const valueInvested = ref(0);
const costs = ref(0);

const fetchPrice = async (symbol: string) => {
  if (!symbol) return;
  
  loading.value = true;
  try {
    const response = await fetch(`http://localhost:3000?symbol=${symbol}`);
    if (!response.ok) throw new Error('Stock not found');
    
    const data = await response.json();
    console.log('Fetched data:', data);
    // Yahoo Finance returns the price in 'regularMarketPrice'
    priceNow.value = data.regularMarketPrice;
    console.log('Price updated:', data.regularMarketPrice);
    toast.add({
      severity: 'success', // Severity options: 'success', 'info', 'warn', 'error', etc.
      summary: 'Success Message',
      detail: 'Stock price fetched successfully.',
      life: 20000 // Duration in milliseconds to close the message automatically
    });
  } catch (err) {
    console.error('Fetch error:', err);
    toast.add({
      severity: 'error', // Severity options: 'success', 'info', 'warn', 'error', etc.
      summary: 'Error Message',
      detail: 'Failed to fetch stock price. Please try again.',
      life: 3000 // Duration in milliseconds to close the message automatically
    });
  } finally {
    loading.value = false;
  }
  resetForm();
}

const calculate = () => {
  // 1. Calculate base invested value
  const totalBuy = quantity.value * buyPrice.value;
  const totalSell = quantity.value * priceNow.value;
  valueInvested.value = Number(totalBuy.toFixed(2));

  // 2. Determine Commissions (assuming 7437.5 is the minimum base fee)
  const minFee = 7437.5;
  const vatRate = 1.19; // 19% VAT
  
  let buyFee = minFee;
  let sellFee = minFee;

  // Logic: If trade > 5M, use 0.125% + VAT, otherwise use flat fee
  if (totalBuy > 5000000) {
    buyFee = (totalBuy * 0.00125) * vatRate;
  }
  
  if (totalSell > 5000000) {
    sellFee = (totalSell * 0.00125) * vatRate;
  }

  // 3. Update reactive refs
  const totalCosts = buyFee + sellFee;
  costs.value = Number(totalCosts.toFixed(2)); // Keep it as a number
  
  // 4. Final Profit Calculation
  profit.value = (totalSell - totalBuy) - totalCosts;
};

const resetForm = () => {
  quantity.value = 0;
  profit.value = 0;
  buyPrice.value = 0;
  valueInvested.value = 0;
}

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0, // Typical for COP as we rarely use cents
  }).format(value);
};

</script>

<template>
  <div class="w-full">
    <form class="flex w-full" @submit.prevent>
          <FieldGroup>
            <FieldSeparator />

            <div class="flex gap-4">
              <Field>
                <FieldLabel for="company">
                  Company
                </FieldLabel>
                <Select v-model="selectedSymbol" 
              @update:model-value="fetchPrice" >
                  <SelectTrigger id="company">
                    <SelectValue placeholder="Select a company"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ECOPETROL.CL">
                      Ecopetrol
                    </SelectItem>
                    <SelectItem value="PFCIBEST.CL">
                      PFCIBEST
                    </SelectItem>
                    <SelectItem value="MINEROS.CL">
                      Mineros
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel for="quantity">
                    Quantity
                </FieldLabel>
                <Input
                    v-model="quantity" 
                    type="number"
                    id="quantity"
                    placeholder="0"
                    @update:model-value="calculate"
                    required
                />
              </Field>

              <Field>
                <FieldLabel for="price">
                    Buy Price
                </FieldLabel>
                <Input
                    v-model="buyPrice"
                    @update:model-value="calculate"
                    type="number"
                    id="price"
                    placeholder="0"
                    required
                />
              </Field>

              <Field>
                <FieldLabel for="price">
                    Value Invested
                </FieldLabel>
                <Input
                    v-model="valueInvested"
                    type="number"
                    id="value-invested"
                    placeholder="0"
                    required
                />
              </Field>

              <Field>
                <FieldLabel for="price-now">
                    Price now
                </FieldLabel>
                <Input
                    v-model="priceNow"
                    type="number"
                    id="price-now"
                    :value="priceNow"
                    placeholder="0"
                    readonly
                    :class="{ 'opacity-50': loading }"
                />
              </Field>

              <Field>
                <FieldLabel for="costs">
                    Costs
                </FieldLabel>
                <Input
                    v-model="costs"
                    type="number"
                    id="comission"
                    placeholder="0"
                />
              </Field>

              <Field>
                <FieldLabel for="profit">
                    Profit
                </FieldLabel>
                <Input
                    v-model="profit"
                    type="number"
                    id="profit"
                    placeholder="0"
                    readonly
                />
              </Field>
                            

              <!-- <Field orientation="horizontal">
                <Button type="submit">
                    <Plus class="mr-2 h-4 w-4" />
                </Button>
              </Field> -->

            </div>
          </FieldGroup>
        <FieldSeparator />
    </form>
  </div>
</template>
