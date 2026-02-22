<script setup lang="ts">
import { simulations, deleteSimulation } from '@/composables/useSimulations';
import { Trash2 } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

</script>

<template>
  <Table class=" rounded-md">
    <TableHeader>
      <TableRow>
        <TableHead>Company</TableHead>
        <TableHead>Now</TableHead>
        <TableHead>Quantity</TableHead>
        <TableHead>B Price</TableHead>
        <TableHead>Investment</TableHead>
        <TableHead>Break Even</TableHead>
        <TableHead>Profit</TableHead>
        <TableHead>Min Fee</TableHead>
        <TableHead>Commission</TableHead>
        <TableHead>VAT</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="row in simulations" :key="row.id">
        <TableCell>{{ row.company }}</TableCell>
        <TableCell>{{ row.priceNow }}</TableCell>
        <TableCell>{{ row.quantity }}</TableCell>
        <TableCell>{{ row.buyPrice }}</TableCell>
        <TableCell>{{ row.valueInvested }}</TableCell>
        <TableCell>{{ row.breakEven }}</TableCell>
        <TableCell>{{ row.profit }}</TableCell>
        <TableCell>{{ row.minFee }}</TableCell>
        <TableCell>{{ row.commissionRate }}</TableCell>
        <TableCell>{{ row.vatRate }}</TableCell>
        <TableCell>
          <Button variant="ghost" size="icon" @click="deleteSimulation(row.id)">
            <Trash2 class="h-4 w-4 text-red-500" />
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
