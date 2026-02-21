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
  profit.value = (totalSell - totalBuy) - totalCosts;
};

const resetForm = () => {
  quantity.value = 0;
  profit.value = 0;
  buyPrice.value = 0;
  valueInvested.value = 0;
}

// const formatCOP = (value: number | string) => {
//   const numeric = typeof value === 'string' 
//     ? parseFloat(value.replace(/[^0-9]/g, '')) 
//     : value;
    
//   return new Intl.NumberFormat('es-CO', {
//     style: 'decimal',
//     minimumFractionDigits: 0,
//   }).format(numeric);
// };

</script>

<template>
  <div class="w-full">
    <form class="flex w-full flex-col gap-4" @submit.prevent>
          <div class="flex flex-col gap-3">

            <div class="flex md:flex-row flex-col w-fit gap-4 bg-slate-900 text-white p-4 rounded-md">
              <Field>
                <FieldLabel for="minimum-fee">
                    Minimum Fee
                </FieldLabel>
                <Input
                  v-model="minFee"
                  @update:model-value="calculate"
                  type="number"
                  id="minimumFee"
                  placeholder="%"
                  required
              />
              </Field>
              <Field>
                <FieldLabel for="commission">
                    Commission (%)
                </FieldLabel>
                <Input
                    v-model="commissionRate"
                    @update:model-value="calculate"
                    type="number"
                    id="commission"
                    placeholder="%"
                    required
                />
              </Field>
              <Field>
                <FieldLabel for="vat">
                    VAT (%)
                </FieldLabel>
                <Input
                    v-model="vatRatePercentage"
                    @update:model-value="calculate"
                    type="number"
                    id="vat"
                    placeholder="%"
                    required
                />
              </Field>
            </div>

            <div class="flex md:flex-row flex-col gap-4 bg-slate-900 text-white p-4 rounded-md">
              
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
                        Local Stocks (BVC)
                      </SelectLabel>
                      <SelectItem value="ECOPETROL.CL">Ecopetrol</SelectItem>
                      <SelectItem value="PFCIBEST.CL">Bancolombia Pref.</SelectItem>
                      <SelectItem value="CIBEST.CL">Bancolombia</SelectItem>
                      <SelectItem value="ISA.CL">Interconexión Eléctrica (ISA)</SelectItem>
                      <SelectItem value="GEB.CL">Grupo Energía Bogotá</SelectItem>
                      <SelectItem value="PFGRUPSURA.CL">Grupo Sura Pref.</SelectItem>
                      <SelectItem value="GRUPOSURA.CL">Grupo Sura</SelectItem>
                      <SelectItem value="PFCEMARGOS.CL">Cementos Argos Pref.</SelectItem>
                      <SelectItem value="CEMARGOS.CL">Cementos Argos</SelectItem>
                      <SelectItem value="PFGRUPOARG.CL">Grupo Argos Pref.</SelectItem>
                      <SelectItem value="GRUPOARGOS.CL">Grupo Argos</SelectItem>
                      <SelectItem value="PFAVAL.CL">Grupo Aval Pref.</SelectItem>
                      <SelectItem value="BOGOTA.CL">Banco de Bogotá</SelectItem>
                      <SelectItem value="BVC.CL">Bolsa de Valores de Col.</SelectItem>
                      <SelectItem value="CELSIA.CL">Celsia</SelectItem>
                      <SelectItem value="TERPEL.CL">Terpel</SelectItem>
                      <SelectItem value="MINEROS.CL">Mineros</SelectItem>
                      <SelectItem value="CNEC.CL">Canacol Energy</SelectItem>
                    </SelectGroup>

                    <SelectSeparator />

                    <SelectGroup>
                      <SelectLabel class="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                        International (MGC)
                      </SelectLabel>
                      <SelectItem value="AAPL.CL">Apple Inc.</SelectItem>
                      <SelectItem value="AMZN.CL">Amazon.com</SelectItem>
                      <SelectItem value="NVDA.CL">NVIDIA</SelectItem>
                      <SelectItem value="MSFT.CL">Microsoft</SelectItem>
                      <SelectItem value="GOOGL.CL">Alphabet (Google)</SelectItem>
                      <SelectItem value="META.CL">Meta (Facebook)</SelectItem>
                      <SelectItem value="TSLA.CL">Tesla</SelectItem>
                      <SelectItem value="NU.CL">Nubank</SelectItem>
                      <SelectItem value="BRK-B.CL">Berkshire Hathaway</SelectItem>
                      <SelectItem value="JPM.CL">JP Morgan</SelectItem>
                      <SelectItem value="KO.CL">Coca-Cola</SelectItem>
                    </SelectGroup>

                    <SelectSeparator />

                    <SelectGroup>
                      <SelectLabel class="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
                        ETFs
                      </SelectLabel>
                      <SelectItem value="ICOLCAP.CL">iShares MSCI COLCAP</SelectItem>
                      <SelectItem value="CSPX.L">iShares S&P 500 (UCITS)</SelectItem>
                      <SelectItem value="EQAC.L">Invesco Nasdaq-100</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel for="price-now">
                    Price now
                </FieldLabel>
                <Input
                    v-model="priceNow"
                    type="text"
                    id="price-now"
                    placeholder="0"
                    readonly
                    :class="{ 'opacity-50': loading }"
                />
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
                  type="text"
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
                    type="text"
                    id="value-invested"
                    placeholder="0"
                    required
                />
              </Field>

              <Field>
                <FieldLabel for="brake-even">
                  Brake Even
                </FieldLabel>
                <Input
                v-model="breakEven"
                type="text"
                id="brake-even"
                placeholder="0"
                readonly
                />
              </Field>

              <Field>
                <FieldLabel for="profit">
                    Profit
                </FieldLabel>
                <Input
                    v-model="profit"
                    type="text"
                    id="profit"
                    placeholder="0"
                    readonly
                />
              </Field>

            </div>
            <h3 class="bg-slate-200 px-4 rounded-md font-bold">Commission(%) {{ commissionRate }} | VAT(%) {{ vatRatePercentage }} <button class="text-blue-500" >Edit</button></h3>
          </div>

          <Field orientation="horizontal">
            <Button type="submit">
                +
            </Button>
          </Field>

    </form>
  </div>
</template>
