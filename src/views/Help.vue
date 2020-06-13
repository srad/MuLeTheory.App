<template>
  <div class="help">
    <h1>Help</h1>
    <hr/>
    <p>...</p>
  </div>
</template>

<script>
export default {
  name: "Help",
  data() {
    return {
      tNotFields: [
        {
          key: "x",
          class: "text-center",
        },
        {
          key: "notx",
          label: "&not;X",
          sortable: false,
          class: "text-center",
        },
      ],
      tNotItems: [{x: 0, notx: 1}, {x: 1, notx: 0}],
      tPrimaryFields: [
        {
          key: "x",
          class: "text-center",
        },
        {
          key: "y",
          class: "text-center",
        },
        {
          key: "xory",
          label: "X&or;Y",
          sortable: false,
          class: "text-center",
        },
        {
          key: "xandy",
          label: "X&and;Y",
          sortable: false,
          class: "text-center",
        },
      ],
      tPrimaryItems: [
        {x: 0, y: 0, xory: 0, xandy: 0},
        {x: 0, y: 1, xory: 1, xandy: 0},
        {x: 1, y: 0, xory: 1, xandy: 0},
        {x: 1, y: 1, xory: 1, xandy: 1},
      ],
      tSecundaryFields: [
        {
          key: "x",
          class: "text-center",
        },
        {
          key: "y",
          class: "text-center",
        },
        {
          key: "xrarry",
          label: "X&rarr;Y",
          sortable: false,
          class: "text-center",
        },
        {
          key: "xoplusy",
          label: "X&oplus;Y",
          sortable: false,
          class: "text-center",
        },
        {
          key: "xharry",
          label: "X&harr;Y",
          sortable: false,
          class: "text-center",
        },
      ],
      tSecundaryItems: [
        {x: 0, y: 0, xrarry: 1, xoplusy: 0, xharry: 1},
        {x: 0, y: 1, xrarry: 1, xoplusy: 1, xharry: 0},
        {x: 1, y: 0, xrarry: 0, xoplusy: 1, xharry: 0},
        {x: 1, y: 1, xrarry: 1, xoplusy: 0, xharry: 1},
      ],
    };
  },
};
</script>