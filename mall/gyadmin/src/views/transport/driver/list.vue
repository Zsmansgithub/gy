<template>
  <div class="transport-wrap order transport-wrap-list">
    <div class="gy-h4">
      驾驶员/押运员管理
    </div>
    <div class="t">
      <ul class="tabs">
        <li class="all" :class="{'selected': tabIdx === -1}" @click="tabChange(-1,-1)"><a
                href="javascript:;">全部</a></li>
        <li v-for="(statusItem,index) in userStatusList"
            @click="tabChange(index,statusItem.initKeys)"
            :class="{'selected': tabIdx === index}" :key="index">
          <a href="javascript:;">
            {{statusItem.initValues}}
            (<span>{{statusItem.initCountValues}}</span>)</a>
        </li>
      </ul>
      <div class="search-add">
        <div class="se-left11">
          <input type="text" placeholder="请输入姓名/手机号" v-model="searchUserData.data.keywords">
          <i class="iconfont icon-search" @click="searchList"></i>
        </div>
        <div class="se-left2" @click="disflag = !disflag">
          <span>高级搜索</span>
          <i class="iconfont" :class="{'icon-arrow-down': !disflag, 'icon-arrow-up': disflag}"></i>
        </div>
      </div>
    </div>
    <div class="gy-form" v-if="disflag">
      <div class="gy-form-group height-new">
        <div class="l">承运商</div>
        <label>
          <input @click="blur11" placeholder="请选择" type="text" class="gy-input" v-model="companyNamenew" @keyup.enter="onelist1click">
        </label>
        <ul class="listul" v-show="onelist1Show">
          <li v-for="(item,index) in onelist1" :key="index" @click="onelist1select(item)" v-if="onelist1.length>0">
            {{item.companyName}}
          </li>
          <li class="none-tips" v-if="onelist1.length === 0">没有搜到相关公司</li>
        </ul>
        <div class="form-mySearch">
          <i class="iconfont icon-mySearch" @click="onelist1click"></i>
        </div>
      </div>
      <div class="gy-form-group">
        <span class="l">从业资格证有效期</span>
        <el-date-picker
                v-model="createDate"
                type="daterange"
                align="center"
                unlink-panels
                range-separator="至"
                start-placeholder = '开始日期'
                end-placeholder= '结束日期'
        >
        </el-date-picker>
      </div>
      <div class="gy-form-group height-new">
        <span class="l">人员类型</span>
        <el-select v-model="searchUserData.data.personnelType" placeholder="请选择">
          <el-option
                  v-for="item in personnelTypeItems"
                  :key="item.initKeys"
                  :label="item.initValues"
                  :value="item.initKeys">
          </el-option>
        </el-select>
        <div class="my_add">
          <i class="iconfont icon-search" @click="searchList"></i>
        </div>
      </div>
    </div>
    <span class="button-box">
        <router-link :to="{ name: 'driverAdd' }" class="gy-button-extra">添加</router-link>
    </span>
    <div>
      <table class="gy-table list bid-list">
        <thead>
        <tr>
          <td>承运商</td>
          <td>姓名</td>
          <td>手机号码</td>
          <td>人员类型</td>
          <td>身份证号码</td>
          <td>准驾车型</td>
          <td>从业资格证有效期至</td>
          <td>状态</td>
          <td>操作</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in userList" :key="item.id" v-if="userList !==null && userList.length > 0">
          <td>{{item.companyName}}</td>
          <td>{{item.username}}</td>
          <td><span>{{item.phone}}</span></td>
          <td><span v-text="explainPersonnelType(item.personnelType)"></span></td>
          <td>{{item.identityCode}}</td>
          <td>{{item.vehicleModel}}</td>
          <td>
            <span v-if="item.personnelType === 0 || item.personnelType === 1">{{item.validDate | date}}</span>
            <span v-if="item.personnelType === 2">{{item.escortQualificationValidDate | date}}</span>
          </td>
          <td><span v-text="explainValidType(item.valid)"></span></td>
          <td class="td-140 align-c">
            <span class="gy-button-view" @click="handleShowTransportUser(item.id)">查看</span>
            <span class="gy-button-view" @click="handleEditTransportUser(item.id)">编辑</span>
            <span class="gy-button-view" v-if="item.valid==1"
                  @click="handleDisableTransportUser(item.id)">禁用</span>
            <span class="gy-button-view" v-if="item.valid==0"
                  @click="handleEnableTransportUser(item.id)">启用</span>
          </td>
        </tr>
        <tr v-if="userList !=null && userList.length === 0">
          <td colspan="8" class="note">暂无数据</td>
        </tr>
        </tbody>
      </table>
      <div class="pagination-wrapper">
        <div class="departmentName">
          共 {{searchUserData.total}} 条记录
        </div>
        <div v-if="searchUserData != null && searchUserData.total>searchUserData.pageSize">
          <el-pagination
                  background
                  layout="prev, pager, next"
                  :current-page.sync="searchUserData.pageNum"
                  :page-size="searchUserData.pageSize"
                  :total="searchUserData.total"
                  @current-change="getList"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
    name: 'list',
    data () {
        return {
            tabIdx: -1,
            disflag: false,
            userList: null,
            createDate: null, // 存放时间
            companyNamenew: null, // 承运商
            onelist1Show: false,
            onelist1: [],
            searchUserData: {
                total: 0,
                pageNum: 1,
                pageSize: 10,
                data: {
                    valid: null,
                    keywords: null,
                    startTime: null,
                    endTime: null,
                    personnelType: null,
                    companyId: null
                }
            },
            personnelTypeItems: [
                {initKeys: '', initValues: '全部'},
                {initKeys: '1', initValues: '驾驶员'},
                {initKeys: '2', initValues: '押运员'},
                {initKeys: '0', initValues: '驾驶员/押运员'}
            ],
            statusCount: {},
            userStatusList: [
                {initKeys: '1', initValues: '已启用', initCountValues: ''},
                {initKeys: '0', initValues: '已禁用', initCountValues: ''}
            ]
        };
    },
    created () {
        this.getCount();
        this.getList();
    },
    methods: {
        // 查询数量
        getCount () {
            this.$http.post(this.$api.transport.transportUserStatus, this.searchUserData.data)
                .then(res => {
                    if (res.data.code === 0) {
                        this.statusCount = res.data.data;
                        this.userStatusList[0].initCountValues = this.statusCount.validCount;
                        this.userStatusList[1].initCountValues = this.statusCount.unValidCount;
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.message
                        });
                    }
                });
        },
        // 查询列表
        getList () {
            this.searchUserData.data.startTime = '';
            this.searchUserData.data.endTime = '';
            if (this.createDate) {
                this.searchUserData.data.startTime = this.createDate[0];
                this.searchUserData.data.endTime = this.createDate[1];
            }
            this.$http.post(this.$api.transport.transportUserList, this.searchUserData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.userList = res.data.data.list;
                        this.pageInfo = res.data.data;
                        this.searchUserData.total = res.data.data.total;
                        this.getCount();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.message
                        });
                    }
                });
        },
        // tab切换
        tabChange (tabIdx, status) {
            this.tabIdx = tabIdx;
            this.searchUserData.data.valid = null;
            if (status !== -1) {
                this.searchUserData.data.valid = status;
            }
            this.searchList();
        },
        // 搜索按钮
        searchList () {
            this.searchUserData.pageNum = 1;
            this.getList();
        },
        // 详细页面跳转
        handleShowTransportUser (id) {
            this.$router.push({name: 'driverDetail', query: {id: id}});
        },
        // 编辑页面跳转
        handleEditTransportUser (id) {
            this.$router.push({name: 'driverAdd', query: {id: id}});
        },
        // 禁用
        handleDisableTransportUser (id) {
            this.$http.post(this.$api.transport.transportUserDisable, {id: id})
                .then(res => {
                    if (res.data.code === 0) {
                        this.getCount();
                        this.getList();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.message
                        });
                    }
                });
        },
        // 启用
        handleEnableTransportUser (id) {
            this.$http.post(this.$api.transport.transportUserEnable, {id: id})
                .then(res => {
                    if (res.data.code === 0) {
                        this.getCount();
                        this.getList();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.message
                        });
                    }
                });
        },
        // 人员类型解析
        explainPersonnelType (personnelType) {
            if (personnelType === 1) {
                return '驾驶员';
            } else if (personnelType === 2) {
                return '押运员';
            } else if (personnelType === 0) {
                return '驾驶员/押运员';
            } else {
                return '未知';
            }
        },
        // 人员状态解析
        explainValidType (validType) {
            if (validType === 0) {
                return '已禁用';
            } else if (validType === 1) {
                return '已启用';
            } else {
                return '未知';
            }
        },
        // 搜索承运商
        onelist1click () {
            this.onelist1Show = true;
            this.$http.post(this.$api.orders.creatOrderCompanies2, {
                'companyTypeId': 2, // 1:交易公司  2：承运商
                'name': this.companyNamenew
            })
                .then((res) => {
                    this.onelist1 = res.data.data;
                }).catch(() => {
                    console.log('出错了');
                });
            this.searchUserData.data.companyId = '';
        },
        onelist1select (item) {
            this.companyNamenew = item.companyName;
            this.searchUserData.data.companyId = item.companyId;
            this.onelist1Show = false;
        },
        blur11 () {
            this.companyNamenew = '';
            this.onelist1Show = false;
            this.searchUserData.data.companyId = '';
        }
    }
};
</script>

<style lang="scss" scoped>
  .disabled {
    color: #e59640;
    border-color: #e59640;
  }

  .search-area {
    padding: 10px 20px
  }

  .select-plugin {
    width: 30%
  }

  .button-box {
    display: block;
    text-align: right;
    padding:20px 0 10px 0;
    .gy-button-extra{
      background-color: #e59640;
      border-color: #e59640;
    }
  }

  .td-180 {
    width: 180px;
  }

  .td-100 {
    width: 100px;
  }

  .td-126 {
    width: 126px;
  }

  .gy-button-view {
    margin-right: 6px;
  }

  .gy-button-view i {
    font-size: 12px;
    line-height: 8px;
    transform: scale(0.8);
    display: inline-block;
  }

  .sub-list {
    background-color: #fff;
    table {
      width: 90%;
      margin: 0 auto;
      td {
        background-color: #fff;
        border: none;
      }
    }
  }

  .link-im {
    color: $color-extra;
    margin-left: 10px;
  }

  .note {
    text-align: center;
    line-height: 40px;
    font-size: 14px;
  }
  .new_div{
    padding: 0 30px 20px;
    position: relative;
    .my_add{
      position: absolute;
      top: 3px;
      right: 11px;
    }
  }
  .transport-wrap-list{
    .t{
      overflow: hidden;
      padding:10px 0;
      .tabs{
        li{
          &.selected{
            a{
              color: #e59640;
            }
            &:after{
              background-color: #e59640;
              height: 2px;
            }
          }
          a:hover, a.gy-link:hover{
            color: #e59640;
          }
        }
      }
    }
    .search-add{
      float: right;
      overflow: hidden;
      .se-left11{
        float: left;
        width: 252px;
        margin-right: 5px;
        border-bottom: 1px solid #b5b5b5;
        input{
          border: none;
          width: 220px;
        }
      }
      .se-left2{
        float: left;
        display: inline-block;
        margin-left: 2px;
        i{
          vertical-align: top;
        }
      }
      .se-left2:hover{
        cursor: pointer;
      }
    }
    .gy-form{
      padding:0 0 0 14px;
      .gy-form-group{
        padding:8px 30px 8px 130px;
        .l{
          width:162px;
          top:8px;
        }
      }
      .gy-form-group:nth-child(even) {
        padding-left: 162px;
        .l {
          width: 162px;
          padding-left: 30px;
        }
      }
      .height-new{
        padding:8px 30px 8px 75px;
        height:46px;
      }
      .my_add{
        position: absolute;
        top: 8px;
        right: 11px;
      }
    }
    .t .search .se-left11{
      width:180px;
      input{
        width:155px;
      }
    }
    .listul {
      background-color: #fff;
      width: calc(100% - 122px);
      max-height: 300px;
      overflow: auto;
      position: absolute;
      top: 39px;
      z-index: 1000;
      border: 1px solid #e6eaea;
      border-top: none;
      li {
        padding: 5px 10px;
      }
      li:hover {
        cursor: pointer;
        background-color: #f5f7fa;
        color: #4a90e2;
      }
    }
    .form-mySearch{
      position: absolute;
      top: 8px;
      right: 37px;
      cursor: pointer;
    }
  }
</style>
<style lang="scss">
  .transport-wrap-list{
    .el-range-separator, .el-input__icon{
      line-height: 24px;
      padding:0;
    }
    .el-input__inner{
      height: 30px;
      font-size: 14px;
    }
  }
</style>
