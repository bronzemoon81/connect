<template>
  <div class="h-full w-full bg-primary dark:bg-darkmode-600">
    <div class="container h-screen flex flex-col items-center py-4 md:py-24">
      <!-- BEGIN: Error Page -->
      <div
        class="error-page flex-1 flex flex-col lg:flex-row items-center justify-center text-center lg:text-left"
      >
        <div class="-intro-x lg:mr-20">
          <img
            class="h-48 lg:h-auto"
            src="@/assets/images/error-illustration.svg"
          />
        </div>
        <div class="text-white mt-10 lg:mt-0">
          <div class="intro-x text-8xl font-medium">404</div>
          <div class="intro-x text-xl lg:text-3xl font-medium mt-5">
            Oops. This page has gone missing.
          </div>
          <div class="intro-x text-lg mt-3">
            You may have mistyped the address or the page may have moved.
          </div>
          <router-link
            :to="{ path: '/' }"
            class="intro-x inline-block btn btn-lg border border-white mt-10"
          >
            Back to Home
          </router-link>
        </div>
      </div>
      <!-- END: Error Page -->
    </div>
  </div>
</template>
