import moment from 'moment'
import { Reader } from '@c/JSX'

const columnJSX = {
  Status: (h, scope) => {
    const {
      column,
      row,
    } = scope
    const val = row[column.property]
    return (
      <span class={val ? 'enable' : 'stopped'}>
        {val ? '啟用中' : '已停用'}
      </span>
    )
  },
  RiskLevel: (h, scope) => {
    const {
      column,
      row,
    } = scope
    const val = row[column.property]
    const map = {
      1: {
        label: '無',
        class: 'risk safe',
      },
      2: {
        label: '低',
        class: 'risk low',
      },
      3: {
        label: '中',
        class: 'risk medium',
      },
      4: {
        label: '高',
        class: 'risk hight',
      },
    }
    return (
      <span class={map[val].class}>
        {map[val].label}
      </span>
    )
  },
  PublishState: (h, scope) => {
    const {
      column,
      row,
    } = scope
    const val = row[column.property]
    const map = {
      0: {
        label: '',
        class: '',
      },
      1: {
        label: '未上架',
        class: 'notyet',
      },
      2: {
        label: '上架中',
        class: 'enable',
      },
      3: {
        label: '已下架',
        class: 'stopped',
      },
    }
    return (
      <span class={map[val].class}>
        {map[val].label}
      </span>
    )
  },
  DateTime: (h, scope) => {
    const {
      column,
      row,
    } = scope
    const val = row[column.property]
    if (moment(val, 'YYYY-MM-DD HH:mm:ss', true).isValid()) {
      const dateTime = val.split(' ')
      return (
        <div>
          <span>{ dateTime[0] }</span>
          <br />
          <span>{ dateTime[1] }</span>
        </div>
      )
    }
    return (
      <span>
        { val }
      </span>
    )
  },
  ReaderCount: (h, scope) => {
    const {
      row,
    } = scope
    return (
      <Reader row={row} />
    )
  },
}

export default columnJSX
