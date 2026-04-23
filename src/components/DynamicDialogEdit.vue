<template>
  <div>
    <p>Coming soon.</p>
    <Button label="Close" @click="closeWithData">Save</Button>
  </div>
</template>
  
<script setup>
import Button from './ui/button/Button.vue';
import { inject } from 'vue';

// Access dialog ref to close it
const dialogRef = inject('dialogRef');

const closeWithData = () => {
  dialogRef.value.close({ success: true });
};
</script>
  