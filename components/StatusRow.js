export default {
  props: [
    "icon",
    "title",
    "description",
    "badge"
  ],

  template: `
  <div
    class="flex items-center
           justify-between py-3
           border-b border-white/5
           last:border-0">

    <div class="flex items-center gap-3">

      <div
        class="w-9 h-9
               rounded-xl
               bg-white/[.04]
               flex items-center
               justify-center">

        <i
          :data-lucide="icon"
          class="w-4 h-4">
        </i>

      </div>

      <div>

        <div class="text-sm font-medium">
          {{ title }}
        </div>

        <div class="text-[11px] text-slate-500">
          {{ description }}
        </div>

      </div>

    </div>

    <span
      class="text-[10px]
             font-bold
             px-2 py-1
             rounded-full
             bg-green-500/10
             text-green-400">

      {{ badge }}

    </span>

  </div>
  `
};
