const {
  createApp,
  nextTick
} = Vue;



/* ================================================= */
/* COMPONENTS */
/* ================================================= */

const StatCard = {

  props: [
    "icon",
    "label",
    "value"
  ],

  template: `

  <div
    class="bg-card
           border border-white/5
           rounded-2xl p-4">

    <div
      class="w-9 h-9
             rounded-xl
             bg-sky-500/10
             text-sky-400
             flex items-center
             justify-center">

      <i
        :data-lucide="icon"
        class="w-4 h-4">
      </i>

    </div>

    <div class="text-2xl font-bold mt-3">
      {{ value }}
    </div>

    <div class="text-xs text-slate-500">
      {{ label }}
    </div>

  </div>

  `
};


const StatusRow = {

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


const Console = {

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



/* ================================================= */
/* APP */
/* ================================================= */

createApp({

  components: {
    StatCard,
    StatusRow,
    Console
  },


  data() {

    return {

      page: "home",

      newDev: "",

      devs: [],

      files: [],


      /* DEVICE CHECK */

      deviceLogs: [],

      deviceProcessing: false,

      deviceComplete: false,


      /* KICKER */

      kickLogs: [],

      kicking: false,


      /* TOAST */

      toast: {

        visible: false,

        message: ""

      },


      /* NAV */

      nav: [

        {
          id: "home",
          name: "Home",
          icon: "house"
        },

        {
          id: "device",
          name: "Device ID",
          icon: "fingerprint"
        },

        {
          id: "kicker",
          name: "Kicker",
          icon: "zap"
        },

        {
          id: "status",
          name: "Status",
          icon: "bar-chart-3"
        }

      ]

    };

  },


  computed: {


    totalKicks() {

      return this.devs.reduce(
        (sum, dev) =>
          sum + dev.kicks,
        0
      );

    },


    totalSuccess() {

      return this.devs.reduce(
        (sum, dev) =>
          sum + dev.success,
        0
      );

    },


    totalFails() {

      return this.devs.reduce(
        (sum, dev) =>
          sum + dev.fails,
        0
      );

    },


    totalErrors() {

      return this.devs.reduce(
        (sum, dev) =>
          sum + dev.errors,
        0
      );

    }

  },


  methods: {


    /* ================================================= */
    /* TOAST */
    /* ================================================= */

    showToast(message) {

      this.toast.message = message;

      this.toast.visible = true;


      clearTimeout(
        this.toastTimer
      );


      this.toastTimer =
        setTimeout(() => {

          this.toast.visible = false;

        }, 2300);

    },


    /* ================================================= */
    /* ADD DEVICE */
    /* ================================================= */

    addDev() {

      const value =
        this.newDev.trim();


      /*
       * Telegram-style toast
       * when nothing is entered.
       */

      if (!value) {

        this.showToast(
          "Please enter a Device ID"
        );

        return;

      }


      /*
       * Prevent duplicate devices.
       */

      if (
        this.devs.some(
          dev =>
            dev.value === value
        )
      ) {

        this.showToast(
          "Device is already added"
        );

        return;

      }


      const dev = {

        id:
          Date.now() +
          Math.random(),

        value,

        status: "Queued",

        progress: 0,

        stopped: false,

        kicks: 0,

        success: 0,

        fails: 0,

        errors: 0

      };


      this.devs.push(dev);

      this.newDev = "";


      this.kickLogs.push({

        text:
          `> added ${value}`,

        type: "info"

      });


      nextTick(() =>
        lucide.createIcons()
      );

    },


    /* ================================================= */
    /* KICKER */
    /* ================================================= */

    async launchKicker() {

      if (
        this.kicking ||
        !this.devs.length
      )
        return;


      this.kicking = true;

      this.kickLogs = [];


      this.kickLogs.push({

        text:
          "$ kicker initialized",

        type: "info"

      });


      for (const dev of this.devs) {

        /*
         * Skip devices stopped
         * from the Status page.
         */

        if (dev.stopped)
          continue;


        dev.status = "Working";

        dev.progress = 0;


        this.kickLogs.push({

          text:
            `> ${dev.value}`,

          type: "info"

        });


        /*
         * Simulated kick output.
         */

        const messages = [

          "kick",
          "kick",
          "kick",
          "kick",
          "kick"

        ];


        for (
          let i = 0;
          i < messages.length;
          i++
        ) {


          if (dev.stopped) {

            dev.status =
              "Stopped";

            break;

          }


          await this.sleep(
            400
          );


          this.kickLogs.push({

            text:
              `> ${messages[i]} ${dev.value}`,

            type: "normal"

          });


          dev.kicks++;


          dev.progress =
            Math.round(
              ((i + 1) /
              messages.length) *
              100
            );

        }


        if (!dev.stopped) {

          /*
           * Simulated successful
           * result.
           */

          dev.status =
            "Kicked";

          dev.success++;


          this.kickLogs.push({

            text:
              `> ${dev.value} success`,

            type: "success"

          });

        }

      }


      this.kicking = false;


      this.kickLogs.push({

        text:
          "$ kicker finished",

        type: "success"

      });


      await nextTick();

      lucide.createIcons();

    },


    /* ================================================= */
    /* STOP DEVICE */
    /* ================================================= */

    stopDev(dev) {

      if (
        dev.status !==
        "Working"
      )
        return;


      dev.stopped = true;

      dev.status =
        "Stopped";


      this.kickLogs.push({

        text:
          `> stop requested: ${dev.value}`,

        type: "error"

      });

    },


    /* ================================================= */
    /* DEVICE CHECK */
    /* ================================================= */

    async uploadFiles(event) {

      const selected =
        [...event.target.files];


      if (!selected.length)
        return;


      this.files.push(
        ...selected
      );


      this.deviceLogs = [];

      this.deviceComplete =
        false;

      this.deviceProcessing =
        true;


      for (const file of selected) {

        this.deviceLogs.push({

          text:
            `> ${file.name}`,

          type: "info"

        });

        await this.sleep(250);

      }


      const messages = [

        "initializing checker",
        "reading device data",
        "work",
        "work",
        "work",
        "validating identifier",
        "work",
        "work",
        "finalizing"

      ];


      for (const message of messages) {

        this.deviceLogs.push({

          text:
            `> ${message}...`,

          type: "normal"

        });


        await this.sleep(350);

      }


      this.deviceLogs.push({

        text:
          "> check completed",

        type: "success"

      });


      this.deviceProcessing =
        false;

      this.deviceComplete =
        true;


      nextTick(() =>
        lucide.createIcons()
      );

    },


    /* ================================================= */
    /* DOWNLOAD */
    /* ================================================= */

    downloadChecked() {

      const data =
        this.files
        .map(file =>
          file.name
        )
        .join("\n");


      const blob =
        new Blob(
          [
            "# Checked Devices\n\n",
            data
          ],
          {
            type:
              "text/plain"
          }
        );


      const url =
        URL.createObjectURL(
          blob
        );


      const a =
        document.createElement(
          "a"
        );

      a.href = url;

      a.download =
        "checked-devs.txt";

      a.click();


      URL.revokeObjectURL(
        url
      );

    },


    /* ================================================= */
    /* HELPERS */
    /* ================================================= */

    sleep(ms) {

      return new Promise(
        resolve =>
          setTimeout(
            resolve,
            ms
          )
      );

    },


    formatSize(bytes) {

      if (bytes < 1024)
        return bytes + " B";


      if (
        bytes <
        1024 * 1024
      )

        return (
          bytes / 1024
        ).toFixed(1) +
        " KB";


      return (
        bytes /
        (1024 * 1024)
      ).toFixed(1) +
      " MB";

    }

  },


  mounted() {

    lucide.createIcons();

  },


  updated() {

    lucide.createIcons();

  }

}).mount("#app");
