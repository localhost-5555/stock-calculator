<script setup lang="ts">
import { markets, COLOMBIAN_MARKETS, US_MARKETS } from '@/data/markets';
import { addSimulation } from '@/composables/useSimulations';
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button'
import { useToast } from 'primevue/usetoast';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';

import { useForm, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { simulationSchema } from '@/schemas/simulationSchema'

import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field'


// State to track which market to show
const currentMarket = ref('BVC');

// Computed property to return the right list based on selection
const companies = computed(() => {
  if (currentMarket.value === 'BVC') return COLOMBIAN_MARKETS;
  if (currentMarket.value === 'NYSE') return US_MARKETS; // The Tech/Finance list
  return []; // For Favorites
});

const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(simulationSchema),
  initialValues: {
    commissionRate: 1.25,
    vatRatePercentage: 19,
    minFee: 1,
  }
})

const toast = useToast();

const loading = ref(false);

const [selectedCompany] = defineField('company')
const [quantity] = defineField('quantity')
const [buyPrice] = defineField('buyPrice')
const [priceNow] = defineField('priceNow')
const profit = ref();
const valueInvested = ref();

const [commissionRate] = defineField('commissionRate');
const [vatRatePercentage] = defineField('vatRatePercentage');
const breakEven = ref();
const [minFee] = defineField('minFee');
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
    quantity.value = 1;

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

const addRow = handleSubmit(() => {
  addSimulation({
    date: new Date(),
    company: selectedCompany.value.name ?? '',
    code: selectedCompany.value.code ?? '',
    priceNow: priceNow.value ?? 0,
    quantity: quantity.value ?? 0,
    buyPrice: buyPrice.value ?? 0,
    valueInvested: valueInvested.value ?? 0,
    breakEven: breakEven.value ?? 0,
    profit: profit.value ?? 0,
    minFee: minFee.value ?? 0,
    commissionRate: commissionRate.value ?? 0,
    vatRate: vatRatePercentage.value ??0,
  });
  resetForm();
})

const resetForm = () => {
  priceNow.value = 1;
  quantity.value = 1;
  buyPrice.value = 1;
  profit.value = 0;
  valueInvested.value = 0;
}
</script>

<template>
  <div class="w-full">

  <div class="flex gap-2 mb-4 px-4 overflow-x-scroll">
    <Button 
      v-for="market in markets"
      :key="market.value"
      :class="{'active': currentMarket === market.value }"
      @click="currentMarket = market.value"
      size="small"
    >
      {{ market.label }}
    </Button>
  </div>

    <form class="flex w-full flex-col gap-3" @submit.prevent>
          <div class="flex flex-col gap-3">

            <div class="card flex md:flex-row flex-col gap-4 p-4 rounded-md">   

              <Field>
                <FieldLabel for="company">Company</FieldLabel>
                <Select
                  v-model="selectedCompany"
                  :options="companies"
                  optionLabel="name"
                  optionGroupLabel="label"
                  optionGroupChildren="items"
                  filter
                  placeholder="Select a Stock"
                  class="w-full"
                  @change="selectedCompany && fetchPrice(selectedCompany.code)"
                >
                  <template #optiongroup="slotProps">
                    <div class="flex items-center font-bold text-primary uppercase text-xs border-b border-gray-100 pb-1">
                      {{ slotProps.option.label }}
                    </div>
                  </template>
                </Select>
                <FieldError>{{ errors.company }}</FieldError>
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
                  placeholder="$0.00"
                  :class="{ 'opacity-50': loading }"
                />
                <FieldError>{{ errors.priceNow }}</FieldError>
              </Field>
              
              <Field>
                <FieldLabel for="quantity">Quantity</FieldLabel>
                <InputNumber
                  v-model="quantity"
                  id="quantity"
                  :min="0"
                  @input="(e) => { quantity = e.value; calculate(); }"
                  placeholder="$0.00"
                />
                <FieldError>{{ errors.quantity }}</FieldError>
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
                  placeholder="$0.00"
                />
                <FieldError>{{ errors.buyPrice }}</FieldError>
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
                  placeholder="$0.00"
                />
                <ErrorMessage name="valueInvested" />
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
                  placeholder="$0.00"
                />
                <ErrorMessage name="breakEven" />
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
                  placeholder="$0.00"
                />
                <ErrorMessage name="profit" />
              </Field>
              
              <Button class="bg-emerald-500 hover:bg-emerald-400" type="submit" @click="addRow">
                + Add
              </Button>
              
            </div>
          </div>
          
          <div v-if="commissionVisible" class="card flex md:flex-row flex-col w-full gap-3 md:w-fit text-white p-4 rounded-md">
            <!-- Min Fee -->
            <Field>
              <FieldLabel for="minimum-fee">Minimum Fee</FieldLabel>
              <InputNumber
                v-model="minFee"
                id="minimumFee"
                mode="currency"
                currency="USD"
                locale="en-US"
                :min=0
                @input="(e) => { minFee = e.value; calculate(); }"
              />
              <ErrorMessage name="minFee" />
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
              <ErrorMessage name="commissionRate" />
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
              <ErrorMessage name="vatRatePercentage" />
            </Field>
          </div>

    <div class="flex flex-col bg-green-100 dark:bg-green-950 md:flex-row gap-2 p-2 rounded-b-md font-bold">
      <h3>
        Minimum fee: <span class="font-normal">{{ minFee }}</span>
      </h3>
      <h3>
        Commission(%): <span class="font-normal">{{ commissionRate }}</span>
      </h3>
      <h3>
        VAT(%): <span class="font-normal">{{ vatRatePercentage }}</span> 
      </h3>
      <span v-if="!commissionVisible" class=" text-blue-400 hover:underline hover:cursor-pointer" @click="commissionVisible = !commissionVisible" > 
        <i class="pi pi-pen-to-square"></i>
        Edit
      </span>
      <span v-else class=" text-red-400 hover:underline hover:cursor-pointer" @click="commissionVisible = !commissionVisible" > 
        <i class="pi pi-times"></i>
        Close
      </span>
    </div>
    </form>
  </div>
</template>
