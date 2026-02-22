// src/composables/useSimulations.ts
import { ref } from 'vue';

export interface Simulation {
  id: number;
  company: string;
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

export const simulations = ref<Simulation[]>(loadFromStorage());

export const addSimulation = (row: Omit<Simulation, 'id'>) => {
  const newRow = { ...row, id: Date.now() };
  simulations.value.push(newRow);
  saveToStorage(simulations.value);
};

export const deleteSimulation = (id: number) => {
  simulations.value = simulations.value.filter(row => row.id !== id);
  saveToStorage(simulations.value);
};