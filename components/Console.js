export default {
  props: [
    "logs",
    "processing"
  ],

  template: `
  <div
    class="mt-4
           rounded-2xl
           overflow-hidden
           border border-white/5
           bg-[#080d12]">

    <!-- TERMINAL HEADER -->

    <div
      class="h-9 px-3
             flex items-center
             border-b border-white/5">

      <div class="flex gap-1.5 mr-3">

        <span
          class="w-2.5 h-2.5
                 rounded-full
                 bg-red-400/70">
        </span>

        <span
          class="w-2.5 h-2.5
                 rounded-full
                 bg-yellow-400/70">
        </span>

        <span
          class="w-2.5 h-2.5
                 rounded-full
                 bg-green-400/70">
        </span>

      </div>

      <span
        class="text-[11px]
               text-slate-500
               font-mono">

        console ~

      </span>

    </div>


    <!-- TERMINAL -->

    <div
      class="h-56
             overflow-y-auto
             p-3
             font-mono
             text-[11px]
             leading-5">

      <div
        v-if="!logs.length"
        class="text-slate-600">

        waiting for input...

      </div>


      <div
        v-for="(log,index) in logs"
        :key="index"
        :class="
          log.type === 'success'
          ? 'text-green-400'
          : log.type === 'error'
          ? 'text-red-400'
          : log.type === 'info'
          ? 'text-sky-400'
          : 'text-slate-300'
        ">

        {{ log.text }}

      </div>


      <span
        v-if="processing"
        class="inline-block
               w-1.5 h-3
               bg-green-400
               animate-pulse">
      </span>

    </div>

  </div>
  `
};
