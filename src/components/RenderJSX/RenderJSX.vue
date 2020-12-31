<script>
export default {
  name: 'RenderJSX',
  props: {
    scope: {
      type: Object,
      default: null,
    },
    render: {
      type: Function,
      default: null,
    },
  },
  render(h, ctx) {
    return this.render(h, this.scope)
  },
}
</script>
