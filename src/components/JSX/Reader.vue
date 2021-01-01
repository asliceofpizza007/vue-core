<script>
import apiBulletins from '@api/apiBulletins'
import apiHandovers from '@api/apiHandovers'

export default {
  name: 'Reader',
  props: {
    row: {
      type: Object,
      default: null,
    },
  },
  computed: {
    getApi() {
      const apiMap = {
        BulletinManagement: apiBulletins.getBulletinsReaders,
        HandoverInfoManagement: apiHandovers.getHandoversReaders,
      }
      return apiMap[this.$route.name]
    },
  },
  methods: {
    showChooseMemberPanel() {
      const {
        id,
        title,
      } = this.row
      const listName = (title) ? `-${title}` : ''
      const settings = {
        component: 'MembersChoose',
        headerTitle: `編號 ${id} ${listName} - 閱讀人員`,
        contentSize: {
          width: '560px',
          height: '70%',
        },
        bgPanel: '#05517c',
      }

      const props = {
        apiProp: {
          api: this.getApi,
          id,
        },
        readOnly: true,
      }

      this.$store.dispatch('JsPanels/addPanel', { settings, props })
    },
  },
  render(h, ctx) {
    const {
      readerCount,
    } = this.row
    return (
      <div class="readerCount" onClick={this.showChooseMemberPanel}>
        <i class="el-icon-s-custom" />
        <p>
          { readerCount }
        </p>
      </div>
    )
  },
}
</script>
<style lang="scss" scoped>
  .readerCount {
    display: flex !important;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    color: #75aac1;

    > i {
      margin-right: 1px;
      font-size: 18px;
    }
  }
</style>
