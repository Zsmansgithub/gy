<template>
    <div class="deal-make order">
        <div class="t">
            <ul class="tabs">
                <li class="all" :class="{'selected': tabIdx === -1}" @click="tabChange(-1)"><a href="javascript:;">全部</a></li>
                <li v-for="(tab, index) in statusList" :key="index" :class="{'selected': tabIdx === index}" @click="tabChange(index)"><a
                  href="javascript:;">{{tab.label}}(<span>{{tab.count}}</span>)</a></li>
            </ul>
            <div class="search">
                <div class="search-box">
                    <input type="search" placeholder="请输入品名/单号" v-model="listData.data.keywords" @keyup.13="getList">
                    <i class="iconfont icon-search" @click="getList"></i>
                </div>
                <span class="search-btn" @click="toggleSelect = !toggleSelect">高级搜索<i class="iconfont" :class="toggleSelect ? 'icon-arrow-up' : 'icon-arrow-down'"></i></span>
            </div>
        </div>
        <div v-if="toggleSelect" class="isshow gy-form">
            <div class="gy-form-group">
                <span class="l">买方公司</span>
                <div class="company-list">
                    <input placeholder="请输入" type="text" class="gy-input" v-model="listData.data.buyerCompanyName" @keyup.enter="handleSearchComapany(0)" @mousedown="listData.data.buyerCompanyId = '';listData.data.buyerCompanyName = ''">
                    <i class="iconfont icon-mySearch"  @click="handleSearchComapany(0)"></i>
                    <ul class="company-list"  v-show="showBuyerCompany">
                        <li v-for="(item, index) in buyerCompanyList" :key="index" @click="handleSelectComapany(item, 0)" v-if="buyerCompanyList.length > 0">
                            {{item.companyName}}
                        </li>
                        <li class="none-tips" v-if="buyerCompanyList.length === 0">没有搜到相关公司</li>
                    </ul>
                </div>
            </div>
            <div class="gy-form-group">
                <span class="l">卖方公司</span>
                <div class="company-list">
                    <input placeholder="请输入" type="text" class="gy-input" v-model="listData.data.sellerCompanyName" @keyup.enter="handleSearchComapany(1)" @mousedown="listData.data.sellerCompanyId = '';listData.data.sellerCompanyName = ''">
                    <i class="iconfont icon-mySearch"  @click="handleSearchComapany(1)"></i>
                    <ul class="company-list"  v-show="showSellerCompany">
                        <li v-for="(item, index) in sellerCompanyList" :key="index" @click="handleSelectComapany(item, 1)" v-if="sellerCompanyList.length > 0">
                            {{item.companyName}}
                        </li>
                        <li class="none-tips" v-if="sellerCompanyList.length === 0">没有搜到相关公司</li>
                    </ul>
                </div>
            </div>
            <div class="gy-form-group">
                <span class="l">撮合公司</span>
                <div class="company-list">
                    <input placeholder="请输入" type="text" class="gy-input" v-model="listData.data.dmkCompanyName" @keyup.enter="handleSearchComapany(2)" @mousedown="listData.data.dmkCompanyId = '';listData.data.dmkCompanyName = ''">
                    <i class="iconfont icon-mySearch"  @click="handleSearchComapany(2)"></i>
                    <ul class="company-list"  v-show="showDmkCompany">
                        <li v-for="(item, index) in dmkCompanyList" :key="index" @click="handleSelectComapany(item, 2)" v-if="dmkCompanyList.length > 0">
                            {{item.companyName}}
                        </li>
                        <li class="none-tips" v-if="dmkCompanyList.length === 0">没有搜到相关公司</li>
                    </ul>
                </div>
            </div>
            <div class="gy-form-group">
                <span class="l">交割库</span>
                <div class="company-list">
                    <input placeholder="请输入" type="text" class="gy-input" v-model="listData.data.deliveryWarehouseName" @keyup.enter="handleSearchWarehouse" @mousedown="listData.data.deliveryWarehouseId = '';listData.data.deliveryWarehouseName = ''">
                    <i class="iconfont icon-mySearch"  @click="handleSearchWarehouse"></i>
                    <ul class="company-list"  v-show="showWarehouse">
                        <li v-for="(item, index) in warehouseList" :key="index" @click="handleSelectWarehouse(item)" v-if="warehouseList.length > 0">
                            {{item.name}}
                        </li>
                        <li class="none-tips" v-if="warehouseList.length === 0">没有搜到相关交割库</li>
                    </ul>
                </div>
            </div>
            <div class="gy-form-group">
                <span class="l">创建时间</span>
                <el-date-picker
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  v-model="dateRange"
                  start-placeholder='开始时间'
                  end-placeholder='结束时间'>
                </el-date-picker>
            </div>
            <div class="gy-form-group last-group">
                <span class="l">交割时间</span>
                <el-date-picker
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  v-model="deliveryDateRange"
                  start-placeholder='开始时间'
                  end-placeholder='结束时间'>
                </el-date-picker>
                <i class="iconfont icon-search search_btn" @click="getList"></i>
            </div>
        </div>
        <div class="bid-body">
            <div class="export-box"><a href="javascript:;" class="gy-button-extra" @click="handleExport">导出</a></div>
            <table class="gy-table list">
                <thead>
                <tr class="title">
                    <td v-for="(td, index) in theadList" :key="index" :style='"width:" + td.width + "%"'>{{td.value}}</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in orderInfo.list" :key="index">
                    <td :colspan="theadList.length" class="item">
                        <div class="item-t">
                            <span class="fl"><strong>撮合订单号：</strong>{{item.dmkOrderSn}} <strong v-if="item.orderSn">交易订单号：</strong>{{item.orderSn}}</span>
                            <span class="fr">{{item.createdDate | date(1)}}</span>
                        </div>
                        <table class="gy-table">
                            <tr>
                                <td class="td-20">
                                    <div class="pro-info">
                                        <span class="img" :style="'background-image: url(' + item.skuImage + ')'"></span><span
                                        class="name">{{item.skuName}}<br>{{item.dmkOrderPriceStr + '元/吨'}}<br>{{item.dmkOrderQuantityStr}}吨</span>
                                    </div>
                                </td>
                                <td class="td-10">{{item.dmkCompanyName}}</td>
                                <td class="td-10">{{item.sellerCompanyName}}</td>
                                <td class="td-10">{{item.buyerCompanyName}}</td>
                                <td class="td-10 text-r">{{item.dmkOrderQuantityStr}}</td>
                                <td class="td-10 text-r">{{item.dmkOrderAmountStr}}</td>
                                <td class="td-10">{{item.deliveryWarehouseName}}</td>
                                <td class="td-10 text-r">{{item.deliveryDateStr}}</td>
                                <td class="td-5">{{statusValue[item.dmkOrderStatus]}}</td>
                                <td class="td-5 align-c">
                                    <router-link :to="{ name: 'dealMakeDetail', query: {id: item.id} }" class="gy-button-view">查看</router-link>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
            <span class="total-number">共 {{orderInfo.total}} 条记录</span>
        </div>
        <div class="pagination-box">
            <el-pagination
                background
                layout="prev, pager, next"
                :current-page.sync="orderInfo.pageNum"
                :page-size="listData.pageSize"
                :total="orderInfo.total"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
    </div>
</template>
<script>

export default {
    data () {
        return {
            tabIdx: -1,
            companyTypeId: null,
            buyerCompanyList: [],
            sellerCompanyList: [],
            dmkCompanyList: [],
            showBuyerCompany: false,
            showDmkCompany: false,
            showSellerCompany: false,
            warehouseName: null,
            showWarehouse: false,
            warehouseList: [],
            statusList: {},
            statusValue: ['待确认', '已确认', '已驳回', '已确认'],
            orderInfo: {},
            listData: {
                pageNum: 1,
                pageSize: 10,
                data: {
                    dmkOrderStatus: null,
                    keywords: null,
                    buyerCompanyId: null,
                    sellerCompanyId: null,
                    buyerCompanyName: null,
                    sellerCompanyName: null,
                    deliveryWarehouseId: null,
                    deliveryWarehouseName: null,
                    dmkCompanyId: null,
                    dmkCompanyName: null,
                    startTime: null,
                    endTime: null,
                    deliveryDateStart: null,
                    deliveryDateEnd: null
                }
            },
            theadList: [
                {
                    id: 1,
                    value: '商品',
                    width: '20'
                },
                {
                    id: 8,
                    value: '撮合公司',
                    width: '10'
                },
                {
                    id: 2,
                    value: '卖方公司',
                    width: '10'
                },
                {
                    id: 3,
                    value: '买方公司',
                    width: '10'
                },
                {
                    id: 4,
                    value: '数量(吨)',
                    width: '10'
                },
                {
                    id: 6,
                    value: '总金额(元)',
                    width: '10'
                },
                {
                    id: 9,
                    value: '交割库',
                    width: '10'
                },
                {
                    id: 10,
                    value: '交易时间',
                    width: '10'
                },
                {
                    id: 5,
                    value: '状态',
                    width: '5'
                },
                {
                    id: 7,
                    value: '操作',
                    width: '5'
                }
            ],
            toggleSelect: false,
            dateRange: null,
            deliveryDateRange: null
        };
    },
    props: {
        isMain: false
    },
    created () {
        this.init();
    },
    methods: {
        init () {
            this.companyTypeId = JSON.parse(localStorage.getItem('userInfo')).companyTypeId;
            this.getStatusCount();
            this.getList();
        },
        getStatusCount () {
            this.$http.post(this.$api.dealMake.status, this.listData.data)
                .then(res => {
                    this.statusList = res.data.data;
                }).catch(() => {
                    console.log('出错了');
                });
        },
        getList () {
            if (this.dateRange) {
                this.listData.data.startTime = this.dateRange[0];
                this.listData.data.endTime = this.dateRange[1];
            } else {
                this.listData.data.startTime = null;
                this.listData.data.endTime = null;
            }
            if (this.deliveryDateRange) {
                this.listData.data.deliveryDateStart = this.deliveryDateRange[0];
                this.listData.data.deliveryDateEnd = this.deliveryDateRange[1];
            } else {
                this.listData.data.deliveryDateStart = null;
                this.listData.data.deliveryDateEnd = null;
            }
            this.getStatusCount();
            this.$http.post(this.$api.dealMake.list, this.listData)
                .then(res => {
                    this.orderInfo = res.data.data;
                }).catch(() => {
                    console.log('出错了');
                });
        },
        handleExport () {
            if (this.dateRange) {
                this.listData.data.startTime = this.dateRange[0];
                this.listData.data.endTime = this.dateRange[1];
            } else {
                this.listData.data.startTime = null;
                this.listData.data.endTime = null;
            }
            if (this.deliveryDateRange) {
                this.listData.data.deliveryDateStart = this.deliveryDateRange[0];
                this.listData.data.deliveryDateEnd = this.deliveryDateRange[1];
            } else {
                this.listData.data.deliveryDateStart = null;
                this.listData.data.deliveryDateEnd = null;
            }
            this.$tools.downloadFile(this, this.$api.dealMake.export, this.listData.data, '撮合订单');
        },
        handleSearchComapany (type) {
            this.$http.post(this.$api.orders.creatOrderCompanies2, {
                companyTypeId: type === 2 ? 4 : 1,
                name: type === 0 ? this.listData.data.buyerCompanyName : (type === 1 ? this.listData.data.sellerCompanyName : this.listData.data.dmkCompanyName)
            })
                .then(res => {
                    switch (type) {
                    case 0:
                        this.showBuyerCompany = true;
                        this.buyerCompanyList = res.data.data;
                        break;
                    case 1:
                        this.showSellerCompany = true;
                        this.sellerCompanyList = res.data.data;
                        break;
                    case 2:
                        this.showDmkCompany = true;
                        this.dmkCompanyList = res.data.data;
                        break;
                    }
                }).catch(() => {
                    console.log('出错了');
                });
        },
        handleSelectComapany (item, type) {
            switch (type) {
            case 0:
                this.showBuyerCompany = false;
                this.listData.data.buyerCompanyName = item.companyName;
                this.listData.data.buyerCompanyId = item.companyId;
                break;
            case 1:
                this.showSellerCompany = false;
                this.listData.data.sellerCompanyName = item.companyName;
                this.listData.data.sellerCompanyId = item.companyId;
                break;
            case 2:
                this.showDmkCompany = false;
                this.listData.data.dmkCompanyName = item.companyName;
                this.listData.data.dmkCompanyId = item.companyId;
                break;
            }
        },
        handleSearchWarehouse () {
            this.$http.get(this.$api.dealMake.warehouse + this.listData.data.deliveryWarehouseName)
                .then(res => {
                    this.showWarehouse = true;
                    this.warehouseList = res.data.data;
                }).catch(() => {
                    console.log('出错了');
                });
        },
        handleSelectWarehouse (item) {
            this.showWarehouse = false;
            this.listData.data.deliveryWarehouseName = item.name;
            this.listData.data.deliveryWarehouseId = item.id;
        },
        tabChange (idx) {
            this.tabIdx = idx;
            this.listData.data.dmkOrderStatus = (idx === -1) ? null : idx;
            this.getList();
        },
        handleCurrentChange (p) {
            this.listData.pageNum = p;
            this.getList();
        }
    }
};
</script>
<style lang="scss" scoped>
    .deal-make{
        .company-list{
            position: relative;
            ul{
                background-color: #fff;
                width: 100%;
                max-height: 200px;
                overflow: auto;
                position: absolute;
                left: 0;
                top: 31px;
                z-index: 9;
                border: 1px solid $color-border;
                border-top: none;
                li{
                    padding: 5px 10px;
                    cursor: pointer;
                    &:hover{
                        background-color: #f5f7fa;
                        color: $color-extra;
                    }
                    &.none-tips{
                        font-size: $small-font;
                        text-align: center;
                    }
                }
            }
            .icon-mySearch{
                position: absolute;
                right: 7px;
                top: 0px;
            }
        }
    }
    .td-20 {
        width: 20%;
    }
    .td-10 {
        width: 10%;
    }
    .td-5 {
        width: 5%;
    }
    .gy-button-view {
        margin-right: 5px;
    }
    .deal-make .t .search {
        padding: 20px 0;
    }
    .isshow {
        padding-bottom: 20px;
    }
    .last-group {
        position: relative;
    }
    .search_btn{
        position: absolute;
        top: 0;
        right: 0;
    }
    .search-box {
        display: inline-block;
        width: 216px;
        border-bottom: 1px solid $color-light;
        input {
            width: 190px;
            height: 30px;
            color: #666;
            border: none;
            font-size: 14px;
        }
        button {
            display: inline-block;
            width: 60px;
            color: $color-main;
            border: none;
            background-color: #fff;
            text-align: right;
        }
        span {
            color: $color-light;
            padding-left: 20px
        }
    }
    .total-text {
        font-size: 14px;
    }
    .text-r {
        text-align: right;
    }
    .export-box{
        text-align: right;
        padding-bottom: 16px;
    }
</style>
<style lang="scss">
    .deal-make {
        .el-input__inner {
            height: 30px !important;
        }
        .el-range-separator {
            line-height: 24px !important;
        }
    }
</style>
