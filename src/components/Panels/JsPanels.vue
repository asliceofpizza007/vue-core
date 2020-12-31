<template lang="pug">
  div
    JsPanel(
      v-for="panel in panels"
      :key="panel.component + '-' + panel.id"
      :visible="panel.show"
      :options="panel.options"
      @close="closePanel(panel.component, panel.id)"
    )
      component.panel(
        :is="panel.component"
        v-bind.sync="panel.props"
        v-on="panel.events"
        :class="`fontSize-${fontSize}p`"
      )
</template>
<script>
import { cloneDeep } from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'JsPanels',
  computed: {
    ...mapState('app', {
      fontSize: state => state.fontSize,
    }),
    ...mapState('JsPanels', {
      JsPanels: state => state.panels,
    }),
    panels() {
      return cloneDeep(this.JsPanels)
    },
  },
  methods: {
    closePanel(component, id) {
      this.$store.dispatch('JsPanels/closePanel', { component, id })
    },
  },
}
</script>
