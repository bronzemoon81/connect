<template>
  <div v-if="showUpdateNotification" class="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">Yeni Güncelleme Mevcut</h3>
        <p class="text-sm text-gray-600 mt-1">Yeni bir sürüm indirildi. Uygulamayı yeniden başlatmak için tıklayın.</p>
      </div>
      <button
        @click="installUpdate"
        class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Güncelle
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ipcRenderer } from 'electron';

const showUpdateNotification = ref(false);

onMounted(() => {
  ipcRenderer.on('update-available', () => {
    // Güncelleme mevcut olduğunda bildirim göster
    showUpdateNotification.value = true;
  });

  ipcRenderer.on('update-downloaded', () => {
    // Güncelleme indirildiğinde bildirim göster
    showUpdateNotification.value = true;
  });
});

const installUpdate = () => {
  ipcRenderer.send('install-update');
};
</script> 