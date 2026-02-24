<script setup lang="ts">
import { addSimulation } from '@/composables/useSimulations';
import { ref } from 'vue';
import { Button } from '@/components/ui/button'
import { useToast } from 'primevue/usetoast';
import InputNumber from 'primevue/inputnumber';

const toast = useToast();

import {
  Field,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const loading = ref(false);

const selectedSymbol = ref('');
const quantity = ref(0);
const profit = ref(0);
const priceNow = ref(0);
const buyPrice = ref(0);
const valueInvested = ref(0);
// const costs = ref(0);

const commissionRate = ref(1.25);
const vatRatePercentage = ref(19);
const breakEven = ref(0);
const minFee = ref(7437.5);
const costs = ref(0)

const commisionVisible = ref(false)

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

  const vatRate = vatRatePercentage.value/100; // 19% VAT
  
  let buyFee = minFee.value;
  let sellFee = minFee.value;

  // Logic: If trade > 5M, use 0.125% + VAT, otherwise use flat fee
  if (totalBuy > 5000000) {
    buyFee = (totalBuy * (commissionRate.value/100)) * vatRate;
  }
  
  if (totalSell > 5000000) {
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
  console.log("Adding to table")
  addSimulation({
    company: selectedSymbol.value,
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
  buyPrice.value = 0;
  valueInvested.value = 0;
}

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
                <Select v-model="selectedSymbol" @update:model-value="(val) => val && fetchPrice(val as string)">
                  <SelectTrigger id="company" class="w-full">
                    <SelectValue placeholder="Companies" />
                  </SelectTrigger>
                  <SelectContent>

                    <SelectGroup>
                      <SelectLabel class="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                        Technology
                      </SelectLabel>
                      <SelectItem value="IBM">IBM</SelectItem>
                      <SelectItem value="ORCL">Oracle</SelectItem>
                      <SelectItem value="CRM">Salesforce</SelectItem>
                      <SelectItem value="DELL">Dell Technologies</SelectItem>
                      <SelectItem value="HPQ">HP Inc.</SelectItem>
                    </SelectGroup>

                    <SelectSeparator />

                    <SelectGroup>
                      <SelectLabel class="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                        Finance
                      </SelectLabel>
                      <SelectItem value="JPM">JP Morgan Chase</SelectItem>
                      <SelectItem value="BAC">Bank of America</SelectItem>
                      <SelectItem value="WFC">Wells Fargo</SelectItem>
                      <SelectItem value="GS">Goldman Sachs</SelectItem>
                      <SelectItem value="MS">Morgan Stanley</SelectItem>
                      <SelectItem value="C">Citigroup</SelectItem>
                      <SelectItem value="AXP">American Express</SelectItem>
                      <SelectItem value="BLK">BlackRock</SelectItem>
                    </SelectGroup>

                    <SelectSeparator />

                    <SelectGroup>
                      <SelectLabel class="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                        Energy
                      </SelectLabel>
                      <SelectItem value="XOM">ExxonMobil</SelectItem>
                      <SelectItem value="CVX">Chevron</SelectItem>
                      <SelectItem value="COP">ConocoPhillips</SelectItem>
                      <SelectItem value="SLB">Schlumberger</SelectItem>
                      <SelectItem value="OXY">Occidental Petroleum</SelectItem>
                    </SelectGroup>

                    <SelectSeparator />

                    <SelectGroup>
                      <SelectLabel class="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                        Healthcare
                      </SelectLabel>
                      <SelectItem value="JNJ">Johnson & Johnson</SelectItem>
                      <SelectItem value="PFE">Pfizer</SelectItem>
                      <SelectItem value="MRK">Merck</SelectItem>
                      <SelectItem value="ABT">Abbott Laboratories</SelectItem>
                      <SelectItem value="UNH">UnitedHealth Group</SelectItem>
                    </SelectGroup>

                    <SelectSeparator />

                    <SelectGroup>
                      <SelectLabel class="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                        Consumer
                      </SelectLabel>
                      <SelectItem value="KO">Coca-Cola</SelectItem>
                      <SelectItem value="PG">Procter & Gamble</SelectItem>
                      <SelectItem value="WMT">Walmart</SelectItem>
                      <SelectItem value="MCD">McDonald's</SelectItem>
                      <SelectItem value="NKE">Nike</SelectItem>
                      <SelectItem value="PEP">PepsiCo</SelectItem>
                    </SelectGroup>

                    <SelectSeparator />

                    <SelectGroup>
                      <SelectLabel class="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                        ETFs (NYSE Arca)
                      </SelectLabel>
                      <SelectItem value="SPY">SPDR S&P 500</SelectItem>
                      <SelectItem value="DIA">SPDR Dow Jones</SelectItem>
                      <SelectItem value="IVV">iShares S&P 500</SelectItem>
                      <SelectItem value="VTI">Vanguard Total Market</SelectItem>
                      <SelectItem value="GLD">SPDR Gold Shares</SelectItem>
                    </SelectGroup>

                  </SelectContent>
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
                  @update:model-value="calculate"
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
                  @update:model-value="calculate"
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
          
          <div v-if="commisionVisible" class="flex md:flex-row flex-col w-fit gap-4 bg-slate-900 text-white p-4 rounded-md">
            <!-- Min Fee -->
            <Field>
              <FieldLabel for="minimum-fee">Minimum Fee</FieldLabel>
              <InputNumber
                v-model="minFee"
                id="minimumFee"
                mode="currency"
                currency="USD"
                locale="en-US"
                @update:model-value="calculate"
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
                @update:model-value="calculate"
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
                @update:model-value="calculate"
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
      <span class="text-blue-500 hover:underline hover:cursor-pointer" @click="commisionVisible = !commisionVisible" > 
        <i class="pi pi-pen-to-square"></i>
        Editar
      </span>
    </div>
    </form>
  </div>
</template>
