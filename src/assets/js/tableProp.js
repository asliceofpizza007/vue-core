import columnJSX from '@js/columnJSX'

export default {
  // 編號
  id(width = 80, fixed = null) {
    return {
      prop: 'id',
      label: 'th.id',
      sortable: true,
      width,
      fixed,
    }
  },
  // 排序
  sequence(width = 90, fixed = null) {
    return {
      prop: 'sequence',
      label: 'th.sequence',
      sortable: true,
      width,
      fixed,
    }
  },
  // 名稱
  name(fixed = null, sortable = null) {
    return {
      prop: 'name',
      label: 'th.name',
      sortable,
      fixed,
    }
  },
  title(sortable = null, width = null, fixed = null) {
    return {
      prop: 'title',
      label: 'th.title',
      sortable,
      width,
      fixed,
    }
  },
  // 狀態
  isEnabled(width = null, sortable = true,) {
    return {
      prop: 'isEnabled',
      label: 'th.isEnabled',
      sortable,
      width,
      render: columnJSX.Status,
    }
  },
  // 風險等級
  riskLevel() {
    return {
      prop: 'riskLevel',
      label: 'th.riskLevel',
      render: columnJSX.RiskLevel,
    }
  },
  // 描述
  description(width = null, fixed = null) {
    return {
      prop: 'description',
      label: 'th.description',
      width,
      fixed,
    }
  },
  link(width = 100, type = 'Link') {
    return {
      prop: 'link',
      label: 'th.link',
      type,
      width,
    }
  },
  // 點擊數
  clickCount(width = null, sortable = true) {
    return {
      prop: 'clickCount',
      label: 'th.clickCount',
      sortable,
      width,
    }
  },
  // 閱讀人員
  readerCount(width = null) {
    return {
      prop: 'readerCount',
      label: 'th.readerCount',
      width,
      render: columnJSX.ReaderCount,
    }
  },
  // 發布狀況
  publishStatus(width = null) {
    return {
      prop: 'publishStatus',
      label: 'th.publishStatus',
      width,
      render: columnJSX.PublishState,
    }
  },
  // 上架時間
  publishedOn(width = 120) {
    return {
      prop: 'publishedOn',
      label: 'th.publishedOn',
      sortable: true,
      width,
      render: columnJSX.DateTime,
    }
  },
  // 下架時間
  finishedOn(width = 120) {
    return {
      prop: 'finishedOn',
      label: 'th.finishedOn',
      sortable: true,
      width,
      render: columnJSX.DateTime,
    }
  },
  // 更新時間
  updatedOn(width = null, sortable = true) {
    return {
      prop: 'updatedOn',
      label: 'th.updatedOn',
      sortable,
      width,
      render: columnJSX.DateTime,
    }
  },
  // 更新者
  updatedByName(width = null, sortable = null) {
    return {
      prop: 'updatedByName',
      label: 'th.updatedByName',
      type: null,
      sortable,
      width,
    }
  },
  // 建立時間
  createdOn(width = null, sortable = true) {
    return {
      prop: 'createdOn',
      label: 'th.createdOn',
      type: null,
      sortable,
      width,
    }
  },
  // 建立者
  createdByName(width = null, sortable = null) {
    return {
      prop: 'createdByName',
      label: 'th.createdByName',
      type: null,
      sortable,
      width,
    }
  },
  // 帳號
  account(width = null, sortable = true,) {
    return {
      prop: 'account',
      label: 'th.account',
      sortable,
      width,
    }
  },
}
