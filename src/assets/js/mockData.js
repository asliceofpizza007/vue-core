const menuList = [
  {
    'id': 2,
    'menuCode': 'SystemGroup',
    'title': '系統管理',
    'menuType': 1,
    'openType': 1,
    'viewType': 4,
    'link': null,
    'iconName': 'glass',
    'iconColor': null,
    'sizeWidth': null,
    'sizeHeight': null,
    'i18n': {
      'zh-TW': null,
      'ja-JP': null,
    },
    'actions': null,
    'children': [
      {
        'id': 3,
        'menuCode': 'admins',
        'title': '管理員帳號管理',
        'menuType': 2,
        'openType': 3,
        'viewType': 4,
        'link': 'AdminManagement',
        'iconName': 'user-circle-o',
        'iconColor': null,
        'sizeWidth': null,
        'sizeHeight': null,
        'i18n': {
          'zh-TW': '管理員帳號管理',
          'ja-JP': 'null',
        },
        'actions': {
          'readList': true,
          'readSingle': true,
          'update': true,
        },
        'children': [

        ],
      },
      {
        'id': 5,
        'menuCode': 'systemMenus',
        'title': '系統選單管理',
        'menuType': 2,
        'openType': 3,
        'viewType': 4,
        'link': 'SystemNavSetting',
        'iconName': 'th-list',
        'iconColor': null,
        'sizeWidth': null,
        'sizeHeight': null,
        'i18n': {
          'zh-TW': '系統選單管理',
          'ja-JP': null,
        },
        'actions': {
          'create': true,
          'readList': true,
          'readSingle': true,
          'update': true,
          'delete': true,
        },
        'children': [

        ],
      },
      {
        'id': 4,
        'menuCode': 'groups',
        'title': '權限群組管理',
        'menuType': 2,
        'openType': 3,
        'viewType': 4,
        'link': 'PermissionGroup',
        'iconName': 'users',
        'iconColor': null,
        'sizeWidth': null,
        'sizeHeight': null,
        'i18n': {
          'zh-TW': '權限群組管理',
          'ja-JP': 'null',
        },
        'actions': {
          'create': true,
          'readList': true,
          'readSingle': true,
          'update': true,
          'delete': true,
        },
        'children': [

        ],
      },
    ],
  },
]

const userPreferences = {
  'userPreferences': '{"appPreferences":{"isSideBarCollapse":false,"isSideTabCollapse":false,"fontSize":"100","handoverMessageSort":"ASC","isUrlPublic":false,"isPrivate":false,"pageSizeSelect":{"normal":15,"short":10,"large":50}},"tabPreferences":{"tabs":[],"steps":0,"gap":0,"isRecordTabs":false}}',
}

const enumRefs = {
  'areaCode': [
    {
      'id': 1,
      'code': 'TC1',
    },
    {
      'id': 2,
      'code': 'TC2',
    },
    {
      'id': 3,
      'code': 'TP1',
    },
    {
      'id': 4,
      'code': 'TP2',
    },
    {
      'id': 5,
      'code': 'PUB',
    },
    {
      'id': 6,
      'code': 'TC3',
    },
    {
      'id': 7,
      'code': 'TC4',
    },
  ],
  'adPosition': [
    {
      'id': 1,
      'name': '\u9996\u9801\u9801\u5c3e1',
    },
    {
      'id': 2,
      'name': '\u9801\u9996\u9801\u5c3e2',
    },
    {
      'id': 3,
      'name': '\u5f71\u7247\u66ab\u505c',
    },
    {
      'id': 4,
      'name': '\u641c\u5c0b\u9801\u53f3\u50741',
    },
    {
      'id': 5,
      'name': '\u641c\u5c0b\u9801\u53f3\u50742',
    },
  ],
  'openType': [
    {
      'id': 1,
      'name': '\u540c\u9801',
    },
    {
      'id': 2,
      'name': '\u53e6\u958b',
    },
  ],
  'floatPosition': [
    {
      'id': 1,
      'name': '\u9996\u9801\u53f3\u5074',
    },
    {
      'id': 2,
      'name': '\u9996\u9801\u5de6\u5074',
    },
    {
      'id': 3,
      'name': '\u9996\u9801\u53f3\u4e0b\u65b9',
    },
    {
      'id': 4,
      'name': '\u9996\u9801\u5de6\u4e0b\u65b9',
    },
  ],
  'levelType': [
    {
      'id': 1,
      'name': '\u4e00\u822c\u6703\u54e1',
    },
    {
      'id': 2,
      'name': 'VIP\u6703\u54e1',
    },
  ],
  'slidePosition': [
    {
      'id': 1,
      'name': '\u4e3b\u9801',
    },
    {
      'id': 2,
      'name': '\u641c\u5c0b\u9801',
    },
  ],
  'visitScope': [
    {
      'id': 1,
      'name': '\u9996\u9801',
    },
    {
      'id': 2,
      'name': '\u641c\u5c0b\u9801',
    },
    {
      'id': 3,
      'name': '\u9996\u9801\u9801\u5c3e1',
    },
    {
      'id': 4,
      'name': '\u9996\u9801\u9801\u5c3e2',
    },
    {
      'id': 5,
      'name': '\u5f71\u7247\u66ab\u505c',
    },
    {
      'id': 6,
      'name': '\u641c\u5c0b\u9801\u53f3\u50741',
    },
    {
      'id': 7,
      'name': '\u641c\u5c0b\u9801\u53f3\u50742',
    },
    {
      'id': 8,
      'name': '\u9996\u9801\u53f3\u5074',
    },
    {
      'id': 9,
      'name': '\u9996\u9801\u5de6\u5074',
    },
    {
      'id': 10,
      'name': '\u9996\u9801\u53f3\u4e0b\u65b9',
    },
    {
      'id': 11,
      'name': '\u9996\u9801\u5de6\u4e0b\u65b9',
    },
    {
      'id': 12,
      'name': '\u9801\u9996\u7ba1\u7406',
    },
    {
      'id': 13,
      'name': '\u9801\u5c3e\u7ba1\u7406',
    },
  ],
}

const hiddenEmp = {
  'compManagers': [

  ],
  'departments': [
    {
      'departmentId': 2,
      'departmentName': '\u79d8\u66f8\u90e8',
      'deptManagers': [
        {
          'id': 101173,
          'name': 'Billy ',
          'class': 2,
        },
      ],
      'groups': [
        {
          'groupId': -19,
          'groupCode': '2+19',
          'groupName': '\u65e9\u73ed-10',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 101173,
              'name': 'Billy ',
              'class': 2,
            },
          ],
        },
        {
          'groupId': -44,
          'groupCode': '2+44',
          'groupName': '\u4e2d\u73ed-13',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 102330,
              'name': 'Nonno',
              'class': 0,
            },
          ],
        },
      ],
    },
    {
      'departmentId': 8,
      'departmentName': '\u8cc7\u8a0a\u90e8',
      'deptManagers': [
        {
          'id': 100096,
          'name': '\u4e0a\u4ec1',
          'class': 2,
        },
        {
          'id': 101159,
          'name': '\u5609\u50492',
          'class': 2,
        },
      ],
      'groups': [
        {
          'groupId': 17,
          'groupCode': '8-17',
          'groupName': '\u7cfb\u7d71\u7d44',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 100094,
              'name': '\u4e43\u4e88',
              'class': 0,
            },
            {
              'id': 100096,
              'name': '\u4e0a\u4ec1',
              'class': 2,
            },
            {
              'id': 101123,
              'name': '\u4f91\u7acb',
              'class': 3,
            },
            {
              'id': 101134,
              'name': 'Wilson',
              'class': 0,
            },
            {
              'id': 101135,
              'name': '\u6fdf\u745e',
              'class': 0,
            },
            {
              'id': 101136,
              'name': '\u4e43\u4e881',
              'class': 0,
            },
            {
              'id': 101137,
              'name': '\u4e43\u4e882',
              'class': 0,
            },
            {
              'id': 101158,
              'name': '\u5609\u50491',
              'class': 0,
            },
            {
              'id': 101159,
              'name': '\u5609\u50492',
              'class': 2,
            },
            {
              'id': 102245,
              'name': 'Mark',
              'class': 0,
            },
            {
              'id': 102259,
              'name': '\u5c0f\u9905',
              'class': 0,
            },
            {
              'id': 102275,
              'name': 'Alvin',
              'class': 0,
            },
            {
              'id': 102285,
              'name': '\u6e2c\u8a66\u54e1\u5de52',
              'class': 0,
            },
            {
              'id': 102302,
              'name': '\u5c0f\u5f37',
              'class': 0,
            },
            {
              'id': 102360,
              'name': '\u4f91\u7acb1',
              'class': 0,
            },
            {
              'id': 102361,
              'name': '\u4f91\u7acb2',
              'class': 0,
            },
            {
              'id': 102362,
              'name': '\u5609\u50493',
              'class': 3,
            },
            {
              'id': 102388,
              'name': '\u963f\u7fa4',
              'class': 0,
            },
          ],
        },
        {
          'groupId': 59,
          'groupCode': '8-59',
          'groupName': '\u6e2c\u8a66\u7d44',
          'groupManagers': [
            {
              'id': 101434,
              'name': 'Angela',
              'class': 1,
            },
          ],
          'employees': [
            {
              'id': 101434,
              'name': 'Angela',
              'class': 1,
            },
            {
              'id': 101931,
              'name': 'Amber',
              'class': 0,
            },
            {
              'id': 102081,
              'name': 'Pick',
              'class': 0,
            },
            {
              'id': 102204,
              'name': 'Yoyo',
              'class': 0,
            },
            {
              'id': 102317,
              'name': 'Sam',
              'class': 0,
            },
            {
              'id': 102347,
              'name': 'Darren',
              'class': 0,
            },
          ],
        },
        {
          'groupId': 62,
          'groupCode': '8-62',
          'groupName': '\u7cfb\u7d71\u5ba2\u670d\u7d44',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 101441,
              'name': 'Joanna',
              'class': 0,
            },
          ],
        },
        {
          'groupId': 56,
          'groupCode': '8-56',
          'groupName': '\u524d\u7aef\u7d44',
          'groupManagers': [
            {
              'id': 101131,
              'name': '\u5609\u5049',
              'class': 1,
            },
          ],
          'employees': [
            {
              'id': 101125,
              'name': '\u4f9d\u502b',
              'class': 0,
            },
            {
              'id': 101131,
              'name': '\u5609\u5049',
              'class': 1,
            },
            {
              'id': 101148,
              'name': '\u4f9d\u502b1',
              'class': 0,
            },
            {
              'id': 101149,
              'name': '\u4f9d\u502b2',
              'class': 0,
            },
            {
              'id': 102258,
              'name': 'Nick',
              'class': 0,
            },
            {
              'id': 102266,
              'name': '\u88d5\u4ecb',
              'class': 0,
            },
            {
              'id': 102270,
              'name': 'Ben',
              'class': 0,
            },
            {
              'id': 102305,
              'name': 'David',
              'class': 0,
            },
            {
              'id': 102306,
              'name': 'David1',
              'class': 0,
            },
          ],
        },
        {
          'groupId': 14,
          'groupCode': '8-14',
          'groupName': 'MIS\u7d44',
          'groupManagers': [
            {
              'id': 101618,
              'name': '\u9707\u6771',
              'class': 1,
            },
            {
              'id': 101828,
              'name': 'Jeffery',
              'class': 1,
            },
          ],
          'employees': [
            {
              'id': 101618,
              'name': '\u9707\u6771',
              'class': 1,
            },
            {
              'id': 101670,
              'name': 'Paul',
              'class': 0,
            },
            {
              'id': 101672,
              'name': '\u4f9d\u5b8f',
              'class': 0,
            },
            {
              'id': 101828,
              'name': 'Jeffery',
              'class': 1,
            },
            {
              'id': 101876,
              'name': '\u8056\u5143',
              'class': 0,
            },
            {
              'id': 101932,
              'name': '\u59f5\u59f5',
              'class': 0,
            },
            {
              'id': 101942,
              'name': '\u667a\u9e92',
              'class': 0,
            },
            {
              'id': 101990,
              'name': 'Charel',
              'class': 0,
            },
            {
              'id': 102199,
              'name': 'Elvis',
              'class': 0,
            },
            {
              'id': 102220,
              'name': 'Jeff',
              'class': 0,
            },
            {
              'id': 102223,
              'name': 'Eva',
              'class': 0,
            },
            {
              'id': 102246,
              'name': 'Frank',
              'class': 0,
            },
            {
              'id': 102304,
              'name': '\u6c11\u921e',
              'class': 0,
            },
            {
              'id': 102312,
              'name': '\u5c0f\u7def',
              'class': 0,
            },
            {
              'id': 102319,
              'name': '\u6e58\u6e58',
              'class': 0,
            },
            {
              'id': 102320,
              'name': '\u963f\u8ce2',
              'class': 0,
            },
            {
              'id': 102341,
              'name': 'Ghost',
              'class': 0,
            },
            {
              'id': 102363,
              'name': 'Tony',
              'class': 0,
            },
          ],
        },
        {
          'groupId': 50,
          'groupCode': '8-50',
          'groupName': '\u904a\u6232\u958b\u767c\u7d44',
          'groupManagers': [
            {
              'id': 101924,
              'name': '\u5927K',
              'class': 1,
            },
          ],
          'employees': [
            {
              'id': 101924,
              'name': '\u5927K',
              'class': 1,
            },
            {
              'id': 102051,
              'name': '\u5c0f\u53ee\u5679',
              'class': 0,
            },
            {
              'id': 102364,
              'name': 'Eric',
              'class': 0,
            },
            {
              'id': 102378,
              'name': 'Karen',
              'class': 0,
            },
            {
              'id': 102379,
              'name': '\u4efb\u5ef7',
              'class': 0,
            },
            {
              'id': 102389,
              'name': 'Neil',
              'class': 0,
            },
          ],
        },
        {
          'groupId': 53,
          'groupCode': '8-53',
          'groupName': '\u5f69\u7968\u7d44',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 102238,
              'name': 'Leon',
              'class': 0,
            },
          ],
        },
        {
          'groupId': -3,
          'groupCode': '8+3',
          'groupName': '\u65e9\u73ed-9',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 102265,
              'name': 'Nick2',
              'class': 0,
            },
            {
              'id': 102267,
              'name': '\u88d5\u4ecb2',
              'class': 0,
            },
            {
              'id': 102394,
              'name': 'Jesse',
              'class': 0,
            },
            {
              'id': 102396,
              'name': 'Henry',
              'class': 0,
            },
            {
              'id': 102400,
              'name': 'Steven',
              'class': 0,
            },
            {
              'id': 102401,
              'name': 'Hedy',
              'class': 0,
            },
            {
              'id': 102402,
              'name': '\u8ed2\u5b87',
              'class': 0,
            },
          ],
        },
        {
          'groupId': -46,
          'groupCode': '8+46',
          'groupName': '\u4e2d\u73ed-18',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 102284,
              'name': '\u6e2c\u8a66\u54e1\u5de5',
              'class': 0,
            },
          ],
        },
      ],
    },
    {
      'departmentId': 5,
      'departmentName': '\u4eba\u8cc7\u90e8',
      'deptManagers': [
        {
          'id': 101219,
          'name': 'Sandy',
          'class': 2,
        },
      ],
      'groups': [
        {
          'groupId': -3,
          'groupCode': '5+3',
          'groupName': '\u65e9\u73ed-9',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 101219,
              'name': 'Sandy',
              'class': 2,
            },
            {
              'id': 101608,
              'name': 'Nora',
              'class': 0,
            },
            {
              'id': 101761,
              'name': 'Elsa',
              'class': 0,
            },
            {
              'id': 101929,
              'name': 'Cheryl',
              'class': 0,
            },
            {
              'id': 102037,
              'name': 'Makayla',
              'class': 0,
            },
            {
              'id': 102133,
              'name': 'Annie',
              'class': 0,
            },
          ],
        },
      ],
    },
    {
      'departmentId': 15,
      'departmentName': '\u5e02\u5834\u71df\u904b\u90e8',
      'deptManagers': [
        {
          'id': 101220,
          'name': 'Ivy',
          'class': 2,
        },
        {
          'id': 101225,
          'name': '\u660c\u54e5',
          'class': 2,
        },
        {
          'id': 101324,
          'name': '\u5f3a\u54e5',
          'class': 2,
        },
        {
          'id': 101414,
          'name': '\u963f\u5e03',
          'class': 2,
        },
      ],
      'groups': [
        {
          'groupId': 62,
          'groupCode': '15-62',
          'groupName': '\u7cfb\u7d71\u5ba2\u670d\u7d44',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 101220,
              'name': 'Ivy',
              'class': 2,
            },
          ],
        },
        {
          'groupId': -3,
          'groupCode': '15+3',
          'groupName': '\u65e9\u73ed-9',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 101225,
              'name': '\u660c\u54e5',
              'class': 2,
            },
            {
              'id': 101324,
              'name': '\u5f3a\u54e5',
              'class': 2,
            },
            {
              'id': 101414,
              'name': '\u963f\u5e03',
              'class': 2,
            },
          ],
        },
      ],
    },
    {
      'departmentId': 3,
      'departmentName': '\u884c\u92b7\u90e8',
      'deptManagers': [

      ],
      'groups': [
        {
          'groupId': 76,
          'groupCode': '3-76',
          'groupName': 'SEO',
          'groupManagers': [
            {
              'id': 101426,
              'name': 'Lita',
              'class': 1,
            },
          ],
          'employees': [
            {
              'id': 101426,
              'name': 'Lita',
              'class': 1,
            },
            {
              'id': 101593,
              'name': 'Masaki',
              'class': 0,
            },
            {
              'id': 102213,
              'name': 'Ian',
              'class': 0,
            },
            {
              'id': 102256,
              'name': '\u5341\u4e8c',
              'class': 0,
            },
            {
              'id': 102326,
              'name': '\u963f\u5b97',
              'class': 0,
            },
            {
              'id': 102327,
              'name': 'Lino',
              'class': 0,
            },
            {
              'id': 102335,
              'name': '\u7c73\u62c9',
              'class': 0,
            },
            {
              'id': 102340,
              'name': 'Jim',
              'class': 0,
            },
            {
              'id': 102344,
              'name': 'Alin',
              'class': 0,
            },
            {
              'id': 102346,
              'name': '\u958e\u7a0b',
              'class': 0,
            },
            {
              'id': 102377,
              'name': 'Rachel',
              'class': 0,
            },
          ],
        },
        {
          'groupId': 86,
          'groupCode': '3-86',
          'groupName': '\u5bcc\u535a\u7d44(N)',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 101575,
              'name': 'Vin',
              'class': 0,
            },
            {
              'id': 101771,
              'name': 'Luini',
              'class': 0,
            },
            {
              'id': 102328,
              'name': 'Filex',
              'class': 0,
            },
            {
              'id': 102390,
              'name': '\u57f9\u6839',
              'class': 0,
            },
          ],
        },
        {
          'groupId': 81,
          'groupCode': '3-81',
          'groupName': '\u7f8e\u8853\u8a2d\u8a08\u7d44',
          'groupManagers': [
            {
              'id': 101668,
              'name': '\u963f\u5fd7',
              'class': 1,
            },
          ],
          'employees': [
            {
              'id': 101668,
              'name': '\u963f\u5fd7',
              'class': 1,
            },
            {
              'id': 101785,
              'name': 'Demon',
              'class': 0,
            },
            {
              'id': 102023,
              'name': 'Verna',
              'class': 0,
            },
            {
              'id': 102206,
              'name': 'Alen',
              'class': 0,
            },
            {
              'id': 102348,
              'name': 'Tracy',
              'class': 0,
            },
            {
              'id': 102371,
              'name': 'Weiwei',
              'class': 0,
            },
          ],
        },
        {
          'groupId': 73,
          'groupCode': '3-73',
          'groupName': '\u6578\u64da\u5206\u6790\u7d44',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 101709,
              'name': '\u9ad8\u5d69',
              'class': 0,
            },
            {
              'id': 101849,
              'name': '\u88d4\u55ac',
              'class': 0,
            },
          ],
        },
        {
          'groupId': 80,
          'groupCode': '3-80',
          'groupName': '\u4f01\u5283(\u512a\u535a)',
          'groupManagers': [
            {
              'id': 101790,
              'name': 'Marcus',
              'class': 1,
            },
          ],
          'employees': [
            {
              'id': 101790,
              'name': 'Marcus',
              'class': 1,
            },
            {
              'id': 102011,
              'name': 'Gordon',
              'class': 0,
            },
            {
              'id': 102014,
              'name': 'Jamie',
              'class': 0,
            },
            {
              'id': 102061,
              'name': '\u5c0f\u55b5',
              'class': 0,
            },
            {
              'id': 102100,
              'name': 'Naomi ',
              'class': 0,
            },
            {
              'id': 102343,
              'name': 'Ibbie',
              'class': 0,
            },
            {
              'id': 102387,
              'name': 'Lily',
              'class': 0,
            },
          ],
        },
        {
          'groupId': 77,
          'groupCode': '3-77',
          'groupName': '\u4f01\u5283(\u8fea\u62dc)',
          'groupManagers': [
            {
              'id': 102022,
              'name': 'Benny',
              'class': 1,
            },
          ],
          'employees': [
            {
              'id': 101808,
              'name': '\u5c0f\u96ef',
              'class': 0,
            },
            {
              'id': 102022,
              'name': 'Benny',
              'class': 1,
            },
            {
              'id': 102173,
              'name': 'Rei',
              'class': 0,
            },
            {
              'id': 102311,
              'name': '\u6167\u81fb',
              'class': 0,
            },
            {
              'id': 102367,
              'name': 'Joyce',
              'class': 0,
            },
            {
              'id': 102368,
              'name': 'Evan',
              'class': 0,
            },
            {
              'id': 102395,
              'name': '\u9594\u9594',
              'class': 0,
            },
          ],
        },
        {
          'groupId': 47,
          'groupCode': '3-47',
          'groupName': '\u6ce2\u97f3\u7d44',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 102323,
              'name': '\u65fb\u6bc5',
              'class': 0,
            },
          ],
        },
        {
          'groupId': -44,
          'groupCode': '3+44',
          'groupName': '\u4e2d\u73ed-13',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 102392,
              'name': 'Rose',
              'class': 0,
            },
            {
              'id': 102398,
              'name': 'Rick',
              'class': 0,
            },
            {
              'id': 102399,
              'name': '\u963f\u90a6',
              'class': 0,
            },
          ],
        },
      ],
    },
    {
      'departmentId': 9,
      'departmentName': '\u7e3d\u52d9\u7d44',
      'deptManagers': [
        {
          'id': 101600,
          'name': '\u5c0f\u7c73',
          'class': 2,
        },
      ],
      'groups': [
        {
          'groupId': -3,
          'groupCode': '9+3',
          'groupName': '\u65e9\u73ed-9',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 101600,
              'name': '\u5c0f\u7c73',
              'class': 2,
            },
            {
              'id': 101634,
              'name': '\u745e\u745e',
              'class': 0,
            },
            {
              'id': 101638,
              'name': 'Claire',
              'class': 0,
            },
            {
              'id': 101767,
              'name': 'Nina',
              'class': 0,
            },
          ],
        },
      ],
    },
    {
      'departmentId': 12,
      'departmentName': '\u5de5\u8b80\u751f',
      'deptManagers': [

      ],
      'groups': [
        {
          'groupId': -33,
          'groupCode': '12+33',
          'groupName': '\u4e2d\u73ed-17',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 101642,
              'name': '\u5f65\u4ef2',
              'class': 0,
            },
          ],
        },
      ],
    },
    {
      'departmentId': 16,
      'departmentName': '\u5927\u9678\u63a8\u5ee3\u7d44',
      'deptManagers': [

      ],
      'groups': [
        {
          'groupId': -3,
          'groupCode': '16+3',
          'groupName': '\u65e9\u73ed-9',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 101680,
              'name': '\u5f35\u975c',
              'class': 0,
            },
            {
              'id': 101995,
              'name': '\u5f35\u9038',
              'class': 0,
            },
            {
              'id': 102013,
              'name': '\u570b\u6bc5',
              'class': 0,
            },
            {
              'id': 102024,
              'name': '\u83c0\u921e',
              'class': 0,
            },
            {
              'id': 102115,
              'name': '\u829d\u7469',
              'class': 0,
            },
            {
              'id': 102119,
              'name': '\u7f8e\u7407',
              'class': 0,
            },
            {
              'id': 102126,
              'name': '\u7d18\u88d5',
              'class': 0,
            },
            {
              'id': 102138,
              'name': '\u5553\u660e',
              'class': 0,
            },
            {
              'id': 102176,
              'name': '\u4e0a\u5100',
              'class': 0,
            },
            {
              'id': 102177,
              'name': '\u744b\u502b',
              'class': 0,
            },
          ],
        },
      ],
    },
    {
      'departmentId': 6,
      'departmentName': '\u8ca1\u52d9\u90e8',
      'deptManagers': [

      ],
      'groups': [
        {
          'groupId': 74,
          'groupCode': '6-74',
          'groupName': '\u958b\u767c\u7d44',
          'groupManagers': [

          ],
          'employees': [
            {
              'id': 101138,
              'name': '\u4e0a\u4ec11-\u6392\u73ed',
              'class': 0,
            },
          ],
        },
      ],
    },
  ],
}

const groupOptions = [
  {
    'id': 1,
    'name': '未設定',
  },
  {
    'id': 2,
    'name': '系統管理員',
  },
  {
    'id': 3,
    'name': '開發人員',
  },
]

const admins = {
  'totalSize': 14,
  'list': [
    {
      'id': 102305,
      'name': 'David',
      'account': 'bck_20191201',
      'groupName': '開發人員',
      'isEnabled': true,
      'description': null,
      'updatedOn': '2020-12-31 09:52:38',
      'updatedByName': 'system',
    },
    {
      'id': 102245,
      'name': 'Mark',
      'account': 'bck_20190707',
      'groupName': '開發人員',
      'isEnabled': true,
      'description': null,
      'updatedOn': '2020-12-30 17:26:49',
      'updatedByName': '阿群',
    },
    {
      'id': 101131,
      'name': '嘉偉',
      'account': 'bck_20190401',
      'groupName': '系統管理員',
      'isEnabled': true,
      'description': null,
      'updatedOn': '2020-12-29 09:17:34',
      'updatedByName': 'system',
    },
    {
      'id': 102266,
      'name': '裕介',
      'account': 'bck_20190808',
      'groupName': '系統管理員',
      'isEnabled': true,
      'description': null,
      'updatedOn': '2020-12-28 14:28:13',
      'updatedByName': 'system',
    },
    {
      'id': 102258,
      'name': 'Nick',
      'account': 'bck_20190801',
      'groupName': '開發人員',
      'isEnabled': true,
      'description': null,
      'updatedOn': '2020-12-28 09:35:31',
      'updatedByName': 'system',
    },
    {
      'id': 102270,
      'name': 'Ben',
      'account': 'bck_20190811',
      'groupName': '開發人員',
      'isEnabled': true,
      'description': null,
      'updatedOn': '2020-12-17 10:46:07',
      'updatedByName': 'system',
    },
    {
      'id': 102275,
      'name': 'Alvin',
      'account': 'bck_20190902',
      'groupName': '開發人員',
      'isEnabled': true,
      'description': null,
      'updatedOn': '2020-12-07 18:14:56',
      'updatedByName': '阿群',
    },
    {
      'id': 102388,
      'name': '阿群',
      'account': 'bck_20200902',
      'groupName': '開發人員',
      'isEnabled': true,
      'description': null,
      'updatedOn': '2020-12-07 18:14:47',
      'updatedByName': '阿群',
    },
    {
      'id': 1101123,
      'name': '侑立',
      'account': 'cwd_20110204',
      'groupName': '開發人員',
      'isEnabled': true,
      'description': null,
      'updatedOn': '2020-11-30 15:18:00',
      'updatedByName': 'system',
    },
    {
      'id': 601133,
      'name': '測試用',
      'account': 'wpc_20999999',
      'groupName': '開發人員',
      'isEnabled': true,
      'description': null,
      'updatedOn': '2020-11-30 10:08:02',
      'updatedByName': 'system',
    },
  ],
}

const adminId = {
  'account': 'bck_20191201',
  'name': 'David',
  'groupId': 3,
  'description': null,
  'isEnabled': true,
  'updatedByName': 'system',
}

const systemMenus = {
  'totalSize': 16,
  'list': [
    {
      'id': 2,
      'title': '系統管理',
      'riskLevel': 3,
      'parentId': 1,
      'menuCode': 'SystemGroup',
      'iconName': 'glass',
      'menuType': 1,
      'openType': 1,
      'viewType': 4,
      'sizeWidth': null,
      'sizeHeight': null,
      'isEnabled': true,
      'updatedOn': '2020-11-05 16:44:41',
      'updatedByName': '裕介',
    },
    {
      'id': 3,
      'title': '管理員帳號管理',
      'riskLevel': 3,
      'parentId': 2,
      'menuCode': 'admins',
      'iconName': 'user-circle-o',
      'menuType': 2,
      'openType': 3,
      'viewType': 4,
      'sizeWidth': null,
      'sizeHeight': null,
      'isEnabled': true,
      'updatedOn': '2020-09-08 08:01:18',
      'updatedByName': 'system',
    },
    {
      'id': 5,
      'title': '系統選單管理',
      'riskLevel': 3,
      'parentId': 2,
      'menuCode': 'systemMenus',
      'iconName': 'th-list',
      'menuType': 2,
      'openType': 3,
      'viewType': 4,
      'sizeWidth': null,
      'sizeHeight': null,
      'isEnabled': true,
      'updatedOn': '2020-09-15 06:40:21',
      'updatedByName': 'system',
    },
    {
      'id': 4,
      'title': '權限群組管理',
      'riskLevel': 3,
      'parentId': 2,
      'menuCode': 'groups',
      'iconName': 'users',
      'menuType': 2,
      'openType': 3,
      'viewType': 4,
      'sizeWidth': null,
      'sizeHeight': null,
      'isEnabled': true,
      'updatedOn': '2020-09-08 08:01:18',
      'updatedByName': 'system',
    },
  ],
}

const systemMenuSequence = {
  'list': [
    {
      'id': 2,
      'title': '系統管理',
      'parentId': 1,
      'sequence': 1,
      'menuType': 1,
      'children': [
        {
          'id': 3,
          'title': '管理員帳號管理',
          'parentId': 2,
          'sequence': 2,
          'menuType': 2,
          'children': [

          ],
        },
        {
          'id': 5,
          'title': '系統選單管理',
          'parentId': 2,
          'sequence': 3,
          'menuType': 2,
          'children': [

          ],
        },
        {
          'id': 4,
          'title': '權限群組管理',
          'parentId': 2,
          'sequence': 4,
          'menuType': 2,
          'children': [

          ],
        },
      ],
    },
  ],
}

const routerOptions = [
  {
    'menuType': 3,
    'menuCode': 'isContractorHidden',
    'title': null,
  },
  {
    'menuType': 2,
    'menuCode': 'admins',
    'title': '管理員帳號管理',
  },
  {
    'menuType': 2,
    'menuCode': 'groups',
    'title': '權限群組管理',
  },
  {
    'menuType': 2,
    'menuCode': 'systemMenus',
    'title': '系統選單管理',
  },
]

const systemMenuId = {
  'title': '管理員帳號管理',
  'riskLevel': 3,
  'link': 'AdminManagement',
  'parentId': 2,
  'menuCode': 'admins',
  'iconName': 'user-circle-o',
  'menuType': 2,
  'openType': 3,
  'viewType': 4,
  'sizeWidth': null,
  'sizeHeight': null,
  'i18n': {
    'zh-TW': '管理員帳號管理',
    'ja-JP': 'null',
  },
  'isEnabled': true,
}

const groups = {
  'totalSize': 2,
  'list': [
    {
      'id': 2,
      'name': '系統管理員',
      'description': '最高權限',
      'isEnabled': true,
      'updatedOn': '2020-11-25 10:19:45',
      'updatedByName': '裕介',
    },
    {
      'id': 3,
      'name': '開發人員',
      'description': '開發測試',
      'isEnabled': true,
      'updatedOn': '2020-11-19 09:52:08',
      'updatedByName': 'Ben',
    },
  ],
}

const groupId = {
  'name': '系統管理員',
  'description': '最高權限',
  'isEnabled': true,
  'permissions': [
    {
      'systemMenuId': 2,
      'isVisible': true,
      'actions': null,
    },
    {
      'systemMenuId': 3,
      'isVisible': true,
      'actions': {
        'readList': true,
        'readSingle': true,
        'update': true,
      },
    },
    {
      'systemMenuId': 5,
      'isVisible': true,
      'actions': {
        'create': true,
        'readList': true,
        'readSingle': true,
        'update': true,
        'delete': true,
      },
    },
    {
      'systemMenuId': 4,
      'isVisible': true,
      'actions': {
        'create': true,
        'readList': true,
        'readSingle': true,
        'update': true,
        'delete': true,
      },
    },
    {
      'systemMenuId': 15,
      'isVisible': true,
      'actions': {
        'readList': true,
        'update': true,
      },
    },
    {
      'systemMenuId': 16,
      'isVisible': true,
      'actions': {
        'create': true,
        'readList': true,
        'readSingle': true,
        'update': true,
        'delete': true,
      },
    },
    {
      'systemMenuId': 6,
      'isVisible': true,
      'actions': null,
    },
    {
      'systemMenuId': 7,
      'isVisible': true,
      'actions': {
        'create': true,
        'readList': true,
        'readSingle': true,
        'update': true,
        'delete': true,
        'admin': true,
      },
    },
    {
      'systemMenuId': 9,
      'isVisible': true,
      'actions': {
        'create': true,
        'readList': true,
        'readSingle': true,
        'update': true,
        'delete': true,
      },
    },
    {
      'systemMenuId': 10,
      'isVisible': true,
      'actions': {
        'create': true,
        'readList': true,
        'readSingle': true,
        'update': true,
        'delete': true,
      },
    },
    {
      'systemMenuId': 11,
      'isVisible': true,
      'actions': {
        'create': true,
        'readList': true,
        'readSingle': true,
        'update': true,
        'delete': true,
      },
    },
    {
      'systemMenuId': 12,
      'isVisible': true,
      'actions': {
        'create': true,
        'readList': true,
        'readSingle': true,
        'update': true,
        'delete': true,
      },
    },
  ],
}

const permissions = [
  {
    'systemMenuId': 2,
    'parentId': 1,
    'title': '系統管理',
    'isVisible': false,
    'actions': null,
  },
  {
    'systemMenuId': 3,
    'parentId': 2,
    'title': '管理員帳號管理',
    'isVisible': false,
    'actions': {
      'readList': false,
      'readSingle': false,
      'update': false,
    },
  },
  {
    'systemMenuId': 5,
    'parentId': 2,
    'title': '系統選單管理',
    'isVisible': false,
    'actions': {
      'create': false,
      'readList': false,
      'readSingle': false,
      'update': false,
      'delete': false,
    },
  },
  {
    'systemMenuId': 4,
    'parentId': 2,
    'title': '權限群組管理',
    'isVisible': false,
    'actions': {
      'create': false,
      'readList': false,
      'readSingle': false,
      'update': false,
      'delete': false,
    },
  },
]

export {
  menuList,
  userPreferences,
  enumRefs,
  hiddenEmp,
  groupOptions,
  admins,
  adminId,
  systemMenus,
  systemMenuSequence,
  routerOptions,
  systemMenuId,
  groups,
  groupId,
  permissions
}
