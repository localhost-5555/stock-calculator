// src/composables/useSimulations.ts
import { ref } from 'vue';

export interface Simulation {
  id: number;
  date: Date;
  company: string;
  code: string;
  priceNow: number;
  quantity: number;
  buyPrice: number;
  valueInvested: number;
  breakEven: number;
  profit: number;
  minFee: number;
  commissionRate: number;
  vatRate: number;
}

const loadFromStorage = (): Simulation[] => {
  try {
    const stored = localStorage.getItem('simulations');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (data: Simulation[]) => {
  localStorage.setItem('simulations', JSON.stringify(data));
};

export const updateStorage = (simulationId): Simulation[] => {
  console.log("Simulation Id: ",simulationId)
  try {
    const stored = localStorage.getItem('simulations');
    console.log("Update storage function is not functional yet")
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const updateSimulation = (id: number, updates: Partial<Simulation>) => {
  const index = simulations.value.findIndex(s => s.id === id);
  if (index === -1) return;

  const current = simulations.value[index];

  // Recalculate derived fields if core values changed
  const quantity = updates.quantity ?? current.quantity;
  const buyPrice = updates.buyPrice ?? current.buyPrice;
  const minFee = updates.minFee ?? current.minFee;
  const commissionRate = updates.commissionRate ?? current.commissionRate;
  const vatRate = updates.vatRate ?? current.vatRate;
  const priceNow = updates.priceNow ?? current.priceNow;

  const valueInvested = quantity * buyPrice;
  const commission = Math.max(minFee, valueInvested * (commissionRate / 100));
  const vat = commission * (vatRate / 100);
  const breakEven = (valueInvested + commission + vat) / quantity;
  const profit = (priceNow - breakEven) * quantity;

  simulations.value[index] = {
    ...current,
    ...updates,
    valueInvested,
    breakEven,
    profit,
  };

  saveToStorage(simulations.value);
};

export const simulations = ref<Simulation[]>(loadFromStorage());

export const addSimulation = (row: Omit<Simulation, 'id'>) => {
  const newRow = { ...row, id: Date.now() };
  simulations.value.unshift(newRow);
  saveToStorage(simulations.value);
};

export const deleteSimulation = (id: number) => {
  simulations.value = simulations.value.filter(row => row.id !== id);
  saveToStorage(simulations.value);
};