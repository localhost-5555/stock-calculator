<script setup lang="ts">
import { addSimulation } from '@/composables/useSimulations';
import { ref } from 'vue';
import { Button } from '@/components/ui/button'
import { useToast } from 'primevue/usetoast';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';

const toast = useToast();

import {
  Field,
  FieldLabel,
} from '@/components/ui/field'

const loading = ref(false);

const selectedCompany = ref(null);
const quantity = ref(0);
const profit = ref(0);
const priceNow = ref(0);
const buyPrice = ref(0);
const valueInvested = ref(0);

const commissionRate = ref(1.25);
const vatRatePercentage = ref(19);
const breakEven = ref(0);
const minFee = ref(1);
const costs = ref(0)

const commissionVisible = ref(false)

const fetchPrice = async (symbol: string) => {
  if (!symbol) return;
  
  loading.value = true;
  try {
    const response = await fetch(`http://localhost:3000?symbol=${symbol}`);
    if (!response.ok) throw new Error('Stock not found');
    
    const data = await response.json();
    // Yahoo Finance returns the price in 'regularMarketPrice'
    priceNow.value = data.regularMarketPrice;
    toast.add({
      severity: 'success', // Severity options: 'success', 'info', 'warn', 'error', etc.
      summary: 'Success Message',
      detail: 'Stock price fetched successfully.',
      life: 3000 // Duration in milliseconds to close the message automatically
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

  const vatRate = vatRatePercentage.value/100; // 19% VAT
  
  let buyFee = minFee.value;
  let sellFee = minFee.value;

  // Logic: If trade > 1000, use 0.125% + VAT, otherwise use flat fee
  if (totalBuy > 1000) {
    buyFee = (totalBuy * (commissionRate.value/100)) * vatRate;
  }
  
  if (totalSell > 1000) {
    sellFee = (totalSell * (commissionRate.value/100)) * vatRate;
  }

  // 3. Update reactive refs
  const totalCosts = Number(buyFee + sellFee);
  costs.value = Number(totalCosts.toFixed(2)); // Keep it as a number

  valueInvested.value = Number(totalBuy.toFixed(2))+ Number(totalCosts.toFixed(2));
  breakEven.value = (valueInvested.value+costs.value)/quantity.value;
  
  // 4. Final Profit Calculation
  profit.value = Number(((totalSell - totalBuy) - totalCosts).toFixed(2));
};

const addRow = () => {
  addSimulation({
    date: new Date(),
    company: selectedCompany.value.name ?? '',
    priceNow: priceNow.value,
    quantity: quantity.value,
    buyPrice: buyPrice.value,
    valueInvested: valueInvested.value,
    breakEven: breakEven.value,
    profit: profit.value,
    minFee: minFee.value,
    commissionRate: commissionRate.value,
    vatRate: vatRatePercentage.value,
  });
};

const resetForm = () => {
  quantity.value = 0;
  profit.value = 0;
  valueInvested.value = 0;
}

const companies = ref([
  {
    label: 'Technology',
    items: [
      { name: 'IBM', code: 'IBM' },
      { name: 'Oracle', code: 'ORCL' },
      { name: 'Salesforce', code: 'CRM' },
      { name: 'Dell Technologies', code: 'DELL' },
      { name: 'HP Inc.', code: 'HPQ' },
      { name: 'Cisco Systems', code: 'CSCO' },
      { name: 'NVIDIA', code: 'NVDA' },
      { name: 'Intel', code: 'INTC' },
      { name: 'AMD', code: 'AMD' },
      { name: 'Microsoft', code: 'MSFT' },
      { name: 'Apple', code: 'AAPL' },
      { name: 'Amazon', code: 'AMZN' },
      { name: 'Google', code: 'GOOGL' },
      { name: 'Facebook', code: 'FB' },
      { name: 'Twitter', code: 'TWTR' },
      { name: 'Netflix', code: 'NFLX' },
      { name: 'Uber', code: 'UBER' },
      { name: 'Lyft', code: 'LYFT' },
      { name: 'Airbnb', code: 'ABNB' },
      { name: 'Zoom', code: 'ZM' },
    ]
  },
  {
    label: 'Finance',
    items: [
      { name: 'JP Morgan Chase', code: 'JPM' },
      { name: 'Bank of America', code: 'BAC' },
      { name: 'Goldman Sachs', code: 'GS' },
      { name: 'Morgan Stanley', code: 'MS' },
      { name: 'Citigroup', code: 'C' },
      { name: 'American Express', code: 'AXP' },
      { name: 'BlackRock', code: 'BLK' },
    ]
  },
]);
</script>

<template>
  <div class="w-full">
    <form class="flex w-full flex-col gap-4" @submit.prevent>
          <div class="flex flex-col gap-3">

            <div class="flex md:flex-row flex-col items-end gap-4 bg-slate-900 text-white p-4 rounded-md">   

              <Field>
                <FieldLabel for="company">
                  Company
                </FieldLabel>
                <Select
                  v-model="selectedCompany"
                  :options="companies"
                  optionLabel="name"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  placeholder="Companies"
                  class="w-full"
                  @change="selectedCompany && fetchPrice(selectedCompany.code)"
                >
                  <template #optiongroup="slotProps">
                    <div class="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                      {{ slotProps.option.label }}
                    </div>
                  </template>
                </Select>
              </Field>

              <!-- Price Now (readonly) -->
              <Field>
                <FieldLabel for="price-now">Price now</FieldLabel>
                <InputNumber
                  v-model="priceNow"
                  id="price-now"
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  :readonly="true"
                  :class="{ 'opacity-50': loading }"
                />
              </Field>
              
              <Field>
                <FieldLabel for="quantity">Quantity</FieldLabel>
                <InputNumber
                  v-model="quantity"
                  id="quantity"
                  :min="0"
                  @input="(e) => { quantity = e.value; calculate(); }"
                />
              </Field>
              
              <!-- Buy Price -->
              <Field>
                <FieldLabel for="price">Buy Price</FieldLabel>
                <InputNumber
                  v-model="buyPrice"
                  id="price"
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  @input="(e) => { buyPrice = e.value; calculate(); }"
                />
              </Field>

              <!-- Value Invested (readonly) -->
              <Field>
                <FieldLabel for="value-invested">Value Invested</FieldLabel>
                <InputNumber
                  v-model="valueInvested"
                  id="value-invested"
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  :readonly="true"
                />
              </Field>

              <!-- Break Even (readonly) -->
              <Field>
                <FieldLabel for="brake-even">Break Even</FieldLabel>
                <InputNumber
                  v-model="breakEven"
                  id="brake-even"
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  :readonly="true"
                />
              </Field>

              <!-- Profit (readonly) -->
              <Field>
                <FieldLabel for="profit">Profit</FieldLabel>
                <InputNumber
                  v-model="profit"
                  id="profit"
                  mode="currency"
                  currency="USD"
                  locale="en-US"
                  :readonly="true"
                />
              </Field>
              
              <Button class="bg-emerald-500 hover:bg-emerald-400" type="submit" @click="addRow">
                + Add
              </Button>
              
            </div>
          </div>
          
          <div v-if="commissionVisible" class="flex md:flex-row flex-col w-fit gap-4 bg-slate-900 text-white p-4 rounded-md">
            <!-- Min Fee -->
            <Field>
              <FieldLabel for="minimum-fee">Minimum Fee</FieldLabel>
              <InputNumber
                v-model="minFee"
                id="minimumFee"
                mode="currency"
                currency="USD"
                locale="en-US"
                @input="(e) => { minFee = e.value; calculate(); }"
              />
            </Field>

            <!-- Commission Rate -->
            <Field>
              <FieldLabel for="commission">Commission (%)</FieldLabel>
              <InputNumber
                v-model="commissionRate"
                id="commission"
                mode="decimal"
                :min="0"
                :max="100"
                :minFractionDigits="2"
                suffix="%"
                @input="(e) => { commissionRate = e.value; calculate(); }"
              />
            </Field>

            <!-- VAT -->
            <Field>
              <FieldLabel for="vat">VAT (%)</FieldLabel>
              <InputNumber
                v-model="vatRatePercentage"
                id="vat"
                mode="decimal"
                :min="0"
                :max="100"
                suffix="%"
                @input="(e) => { vatRatePercentage = e.value; calculate(); }"
              />
            </Field>
          </div>

    <div class="flex flex-col md:flex-row gap-2 bg-slate-200 p-4 rounded-md font-bold">
      <h3>
        Minimum fee: <span class="font-normal">{{ minFee }}</span>
      </h3>
      <h3>
        Commission(%): <span class="font-normal">{{ commissionRate }}</span>
      </h3>
      <h3>
        VAT(%): <span class="font-normal">{{ vatRatePercentage }}</span> 
      </h3>
      <span class="text-blue-500 hover:underline hover:cursor-pointer" @click="commissionVisible = !commissionVisible" > 
        <i class="pi pi-pen-to-square"></i>
        Editar
      </span>
    </div>
    </form>
  </div>
</template>
