<template lang="pug">
  .panelContent(v-loading="loading")
    .contentWrapper
      el-form.contentInner(
        ref="editForm"
        :model="formData"
        :rules="rules"
      )
        el-form-item(
          label="片商"
          prop="companyName"
        )
          el-select(v-model="formData.companyName" clearable
            ref="firstColumn"
          )
            el-option(
              v-for="company in companyList"
              :key="company.id"
              :label="company.name"
              :value="company.id"
            )
        el-form-item(
          label="影片片名"
          prop="name"
          :rules="[{ required: true, message: '↑此項必填' },{max: 255, message: '最多只能255個字'}]"
        )
          el-input(
            v-model="formData.name"
          )
        el-form-item(
          label="影片描述"
          prop="description"
          :rules="[{ required: true, message: '↑此項必填' },{max: 500, message: '最多只能500個字'}]"
        )
          el-input(
            v-model="formData.description"
          )
        el-form-item(
          label="設定平台"
          prop="platformIdSet"
        )
          el-checkbox-group(
            v-model="formData.platformIdSet"
            label="number"
            @change="platformCheck"
          )
            el-checkbox(
              v-for="item in platform"
              :key="item.id"
              :label="item.id"
            ) {{ item.name }}
        el-form-item(
          label="影片上下架"
          prop="isEnabled"
        )
          el-radio-group(v-model="formData.isEnabled")
            el-radio(:label="true") 上架
            el-radio(:label="false") 下架
        el-form-item(
          label="設定影片是否付費"
          prop="isFree"
        )
          el-radio-group(v-model="formData.isFree")
            el-radio(:label="true") 免費
            el-radio(:label="false") 付費
        el-form-item(
          label="影片標籤"
          prop="tagNames"
          :rules="[{ required: true, message: '↑此項必填' }]"
        )
          el-select(
            v-model="formData.tagNames"
            placeholder="請填入搜尋標籤"
            filterable
            multiple
            allow-create
            style="width:100%"
          )
            el-option(
              v-for="tag in filterTags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.name"
            )
        el-form-item(
          label="演員"
          prop="actorNames"
          :rules="[{ required: true, message: '↑此項必填' },{max: 500, message: '最多只能500個字'}]"
        )
          el-input(
            type="texarea"
            v-model="formData.actorNames"
            placeholder="以逗號(',')分隔"
          )
        el-form-item(label="圖片管理")
          ImgUploader(
            v-for="(type, key) in condiction"
            :key="key"
            v-model="formData.imageFileSet[key]"
            :size="type.size"
            :title="type.title"
            :fileSize="type.fileSize"
          )
    .buttonWrapper
      el-button(
        type="danger"
        @click="closePanel"
      ) 取消
      el-button(
        v-if="action !== 'view'"
        type="success"
        @click="checkValidate"
      ) 儲存
</template>
<script>
import debounce from 'lodash/debounce'
import apiVideo from '@api/apiVideo'
import apiProducer from '@api/apiProducer'
import apiTags from '@api/apiTags'
import { PanelMixin } from '@/mixins'
import ImgUploader from './subComponents/ImgUploader'

export default {
  name: 'EditVideo',
  components: {
    ImgUploader,
  },
  mixins: [PanelMixin],
  props: {
    id: {
      type: Number,
      default: null,
    },
    action: {
      type: String,
      default: null,
    },
    platform: {
      type: Array,
      default: null,
    },
    parent: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      uploadingCount: 0,    // 正在上傳中的圖片數量
      formData: {
        imageFileSet: {
          cover: '',
          slide: '',
        },
        name: null,
        companyName: null,
        platformIdSet: [],
        tagNames: [],
        actorNames: null,
        description: null,
        isEnabled: null,
        isFree: null,
      },
      condiction: {
        cover: {
          size: {
            w: 140,
            h: 200,
          },
          title: '封面圖片(單檔上傳)',
        },
        slide: {
          size: {
            w: 140,
            h: 200,
          },
          title: '滑入圖片(單檔上傳)',
        },
      },
      companyList: [],
      tagList: [],
      searchTag: '',
      loading: true,
    }
  },
  computed: {
    filterTags() {
      if (!this.searchTag) {
        return this.tagList
      }
      return this.tagList.filter(tag => {
        return tag.name.indexOf(this.searchTag) > -1
      })
    },
    getFileSet() {
      const files = []
      Object.keys(this.formData.imageFileSet).forEach(item => {
        files.push({
          key: item,
          path: this.formData.imageFileSet[item],
        })
      })
      return files
    },
  },
  created() {
    this.getTagList()
    this.getProducerList()
  },
  methods: {
    async getTagList() {
      const res = await apiTags.getTagList()
      this.tagList = res.list
    },
    // 取得片商列表
    async getProducerList() {
      const res = await apiProducer.getProducerList()
      this.companyList = res.list
      this.getVideo()
    },
    // 取得單筆影片資料
    async getVideo() {
      try {
        const res =  await apiVideo.getVideo(this.id)
        Object.keys(this.formData).forEach(key => {
          if (res[key] !== null && typeof res[key] !== 'undefined') {
            this.formData[key] = res[key]
          }
        })
        // 去除重複的值
        this.formData.platformIdSet = [...(new Set(this.formData.platformIdSet))]
      } catch {
        // pass
      }
      this.loading = false
    },
    checkValidate() {
      this.$refs.editForm.validate(valid => {
        if (!this.uploadingCount && valid) {
          this.updateVideo()
        } else if (this.uploadingCount) {
          this.$message({
            message: '資料上傳中',
            type: 'error',
          })
        }
      })
    },
    // 更新影片
    updateVideo: debounce(async function () {
      try {
        await apiVideo.updateVideo(this.formDataPayload, this.id)
        this.$message({
          message: '資料更新成功',
          type: 'success',
        })
        this.$emit('refresh-page')
        this.closePanel()
      } catch {
        // pass
      }
    }, 600),
    platformCheck(value) {
      const platformId = this.platform.map(res => {
        return res.id
      })
      value.forEach((item, index) => {
        if (platformId.indexOf(item) < 0) {
          this.formData.platformIdSet.splice(index, 1)
        }
      })
    },
    closePanel() {
      this.$parent.$emit('close')
    },
  },
}
</script>
<style lang="scss" scoped>
.el-form-item /deep/ {
  .el-form-item__label {
    width: 150px !important;
  }
}
</style>
