<template>
  <footer class="bg-white dark:bg-gray-800 shadow-lg mt-auto">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="text-gray-600 dark:text-gray-300 text-sm">
          © 2024 CTCマーケット. All rights reserved.
        </div>
        <div class="flex space-x-4 mt-4 md:mt-0">
          <a
            v-for="item in ['利用規約', 'プライバシー', 'お問い合わせ']"
            :key="item"
            href="#"
            class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
          >
            {{ item }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>