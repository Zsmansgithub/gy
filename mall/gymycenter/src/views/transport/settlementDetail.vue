<template>
    <div class="transport-wrap order">
        <h2>运输结算单</h2>
        <h3><i class="iconfont icon-info"></i>基础信息</h3>
        <div class="gy-form">
            <div class="gy-form-group">
                <span class="l">品名</span>
                <span v-for="item in chargeInfo.consignmentNoteItemList" :key="item.id">{{item.skuName}}</span>
            </div>
            <div class="gy-form-group">
                <span class="l">数量</span>
                <span v-for="item in chargeInfo.consignmentNoteItemList" :key="item.id">{{item.skuQuantity + item.infUnitOfMeasureName}}</span>
            </div>
            <div class="gy-form-group cl">
                <span class="l">运费</span>
                <span v-for="item in chargeInfo.consignmentNoteItemList" :key="item.id">{{item.freightUnitPrice + '元/' + item.infUnitOfMeasureName}}</span>
            </div>
            <div class="gy-form-group">
                <span class="l">损耗限制</span>
                <span v-for="item in chargeInfo.consignmentNoteItemList" :key="item.id">{{item.damageRate}}‰</span>
            </div>
            <div class="gy-form-group">
                <span class="l">货值</span>
                <span v-for="item in chargeInfo.consignmentNoteItemList" :key="item.id">{{item.skuPrice + '元/' + item.infUnitOfMeasureName}}</span>
            </div>
            <div class="gy-form-group">
                <span class="l">期望支付方式</span>
                <label><input type="radio" :disabled="companyTypeId !== 2 || isView" v-model="chargeData.freightPaymentType"
                              name="payway" value="0">在线支付</label>
                <label><input type="radio" :disabled="companyTypeId !== 2 || isView" v-model="chargeData.freightPaymentType"
                              name="payway" value="1">线下支付</label>
            </div>
            <div class="gy-form-group">
                <span class="l">装货量</span>
                <span v-if="companyTypeId !== 2 || isView">{{quantityLoading}}吨</span>
                <input v-else type="text" v-model="quantityLoading" @keyup="transportCost">
                <span v-if="companyTypeId === 2 && !isView" class="unit" v-for="item in chargeInfo.consignmentNoteItemList" :key="item.id">{{item.infUnitOfMeasureName}}</span>
            </div>
            <div class="gy-form-group">
                <span class="l">卸货量</span>
                <span v-if="companyTypeId !== 2 || isView">{{quantityUnloading}}吨</span>
                <input v-else type="text" v-model="quantityUnloading" @keyup="transportCost">
                <span v-if="companyTypeId === 2 && !isView" class="unit" v-for="item in chargeInfo.consignmentNoteItemList" :key="item.id">{{item.infUnitOfMeasureName}}</span>
            </div>
            <div class="gy-form-group">
                <span class="l">非合理损耗</span>
                {{wastage}}<span v-for="item in chargeInfo.consignmentNoteItemList" :key="item.id">{{item.infUnitOfMeasureName}}</span>
            </div>
            <div class="gy-form-group">
                <span class="l">运费金额</span>
                <span v-if="companyTypeId !== 2 || isView">{{chargeData.carriageFee}}元</span>
                <input v-else type="text" v-model="chargeData.carriageFee" @keyup="countTotalCharge">
                <span v-if="companyTypeId === 2 && !isView" class="unit">元</span>
            </div>
            <div class="gy-form-group">
                <span class="l">合同编号</span>
                <span>{{chargeInfo.consignmentContractCode}}</span>
            </div>
            <div class="gy-form-group">
                <span class="l">备注</span>
                <span v-if="companyTypeId !== 2 || isView">{{chargeData.settleRemark}}</span>
                <textarea v-else class="gy-textarea" v-model="chargeData.settleRemark"></textarea>
            </div>
        </div>
        <h3><i class="iconfont icon-info"></i>运输详情</h3>
        <div class="trace-data">
            <table class="gy-table">
                <thead>
                <tr>
                    <td>序号</td>
                    <td>调度单号</td>
                    <td>车辆</td>
                    <td>调度量</td>
                    <td>装货量</td>
                    <td>卸货量</td>
                    <td>实际卸货量</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(list, index) in traceDetail.list" :key="index">
                    <td>{{index + 1}}</td>
                    <td>{{ list.dispatchNoteCode }}</td>
                    <td>{{list.licensePlateNumber}}</td>
                    <td class="align-r">{{list.quantityPlanned || 0}}吨</td>
                    <td class="align-r">{{list.quantityLoading || 0}}吨</td>
                    <td class="align-r">{{list.quantityUnloading || 0}}吨</td>
                    <td class="align-r">{{list.actualQuantityUnloading || 0}}吨</td>
                </tr>
                <tr v-if="traceDetail.list.length === 0">
                    <td colspan="7" class="align-c">没有找到可显示的数据...</td>
                </tr>
                <tr class="summation">
                    <td>合计</td>
                    <td></td>
                    <td></td>
                    <td class="align-r">{{summations.quantityPlanned || 0}}吨</td>
                    <td class="align-r">{{summations.quantityLoading || 0}}吨</td>
                    <td class="align-r">{{summations.quantityUnloading || 0}}吨</td>
                    <td class="align-r">{{summations.actualQuantityUnloading || 0}}吨</td>
                </tr>
                </tbody>
            </table>
            <div class="trace-total">共 {{traceDetail.total}} 条记录</div>
            <!-- 分页 -->
            <el-pagination
              background
              layout="prev, pager, next"
              :current-page.sync="traceDetail.pageNum"
              :page-size="traceDetail.pageSize"
              :total="traceDetail.total"
              @current-change="getTraceDetail">
            </el-pagination>
        </div>
        <h3><i class="iconfont icon-info"></i>其他费用</h3>
        <div class="gy-form other-charge" v-for="(item, index) in chargeData.consignmentChargesList" :key="index">
            <div class="gy-form-group">
                <span class="l">运费项目</span>
                <input type="text" class="gy-input" v-model="item.costItem" :disabled="companyTypeId !== 2 || isView">
            </div>
            <div class="gy-form-group">
                <span class="l">费用金额</span>
                <input type="text" class="gy-input" v-model="item.costCharge" @keyup="countTotalCharge"
                       :disabled="companyTypeId !== 2 || isView">
                <span class="unit">元</span>
            </div>
            <i class="iconfont icon-minus" @click="remove(index)"></i>
        </div>
        <span class="add-box" v-show="companyTypeId === 2">
            <i class="iconfont icon-add" @click="add"></i>
        </span>
        <p class="total">总运费：<strong>{{chargeData.freightFee}}元</strong></p>
        <div class="gy-form-button" style="padding-bottom: 20px;" v-if="!isView">
            <button class="gy-button-extra" @click="chargeSend" v-if="companyTypeId === 2">提交</button>
            <button class="gy-button-extra" @click="chargeConfirm" v-if="companyTypeId !== 2">确认</button>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            companyTypeId: null,
            chargeId: null,
            chargeData: {
                freightFee: null,
                carriageFee: null,
                freightPaymentType: 0,
                id: null,
                settleRemark: null,
                consignmentNoteItemList: [
                    {
                        quantityUnloading: null,
                        quantityLoading: null,
                        id: null
                    }
                ],
                consignmentChargesList: []
            },
            quantityLoading: 0,
            quantityUnloading: 0,
            chargeInfo: {
                consignmentNoteItemList: []
            },
            isView: false,
            wastageValue: null,
            traceDetail: {
                list: []
            },
            searchForm: {
                pageNum: 1,
                pageSize: 10,
                data: {
                    lgsConsignmentNoteId: this.$route.query.orderId
                }
            },
            summations: {}
        };
    },
    created () {
        localStorage.getItem('userInfo') && (this.companyTypeId = JSON.parse(localStorage.getItem('userInfo')).companyTypeId);
        this.chargeId = this.$route.query.orderId;
        this.chargeData.id = this.chargeId;
        this.isView = this.$route.query.view === true;
        this.getChargeInfo();
        this.getTraceDetail();
    },
    computed: {
        wastage () {
            let load = this.quantityLoading;
            let unload = this.quantityUnloading;
            let scale = this.chargeData.consignmentNoteItemList[0].damageRate / 1000;
            let result = load - unload - load * scale;
            result = result > 0 ? result : 0;
            result = this.$tools.toFixedFn(result, 3);
            return result;
        }
    },
    watch: {
        quantityUnloading: {
            handler (newValue, oldValue) {
                oldValue && (this.quantityUnloading = this.quantityUnloading.replace(/-/g, ''));
            }
        }
    },
    methods: {
        getChargeInfo () {
            this.$http.get(this.$api.transport.newCharge + '/' + this.chargeId)
                .then(res => {
                    this.chargeInfo = res.data.data;
                    this.chargeData.carriageFee = this.chargeInfo.carriageFee;
                    this.chargeData.settleRemark = this.chargeInfo.settleRemark;
                    this.chargeData.freightPaymentType = this.chargeInfo.freightPaymentType;
                    this.chargeInfo.consignmentChargesList.forEach(item => {
                        this.chargeData.consignmentChargesList.push(item);
                    });
                    this.chargeData.consignmentNoteItemList = this.chargeInfo.consignmentNoteItemList;
                    this.quantityLoading = this.chargeData.consignmentNoteItemList[0].quantityLoading;
                    this.quantityUnloading = this.chargeData.consignmentNoteItemList[0].quantityUnloading;
                    this.countTotalCharge();
                    this.transportCost();
                });
        },
        getTraceDetail () {
            this.$http.post(this.$api.transport.pageInfo, this.searchForm)
                .then(res => {
                    this.traceDetail = res.data.data;
                    this.getSummations();
                });
        },
        getSummations () {
            this.$http.get(`${this.$api.transport.transportTotal}/${this.chargeId}`)
                .then(res => {
                    this.summations = res.data.data;
                });
        },
        transportCost () {
            let cost = Number(this.quantityUnloading) * Number(this.chargeInfo.consignmentNoteItemList[0].freightUnitPrice) - Number(this.wastage) * Number(this.chargeInfo.consignmentNoteItemList[0].skuPrice);
            this.chargeData.carriageFee = this.chargeInfo.carriageFee ? this.chargeInfo.carriageFee : this.$tools.toFixedFn(cost, 2);
            this.countTotalCharge();
        },
        add () {
            !this.isView && this.chargeData.consignmentChargesList.push(
                {
                    costCharge: null,
                    costItem: null,
                    currencyId: 1
                }
            );
        },
        remove: function (idx) {
            if (!this.isView) {
                this.chargeData.consignmentChargesList.splice(idx, 1);
                this.countTotalCharge();
            }
        },
        countTotalCharge () {
            let otherCharge = 0;
            if (this.chargeData.consignmentChargesList.length === 0) {
                this.chargeData.freightFee = this.chargeData.carriageFee;
                return;
            }
            this.chargeData.consignmentChargesList.forEach(item => {
                otherCharge = Number(otherCharge) + Number(item.costCharge);
            });
            this.chargeData.freightFee = this.$tools.toFixedFn(Number(this.chargeData.carriageFee) + otherCharge, 2);
        },
        chargeSend () {
            this.chargeData.consignmentNoteItemList[0].quantityLoading = this.quantityLoading;
            this.chargeData.consignmentNoteItemList[0].quantityUnloading = this.quantityUnloading;
            if (this.chargeData.freightFee < 0) {
                this.$alert('结算金额不能为负数，请仔细检查后再重新发起结算。', '提示')
                    .then(() => {
                        console.log(1);
                    });
                return;
            }
            this.$http.post(this.$api.transport.newCharge, this.chargeData)
                .then(res => {
                    if (res.data.code === 0) {
                        this.$router.push({name: 'transparentSettlement'});
                        return;
                    }
                    this.$alert(res.data.message, '出错了', {type: 'error'});
                });
        },
        chargeConfirm () {
            this.$http.put(this.$api.transport.newOrder, {
                consignmentNoteStatus: 7,
                id: this.chargeId
            }).then((res) => {
                if (res.data.code === 0) {
                    this.$alert('确认成功', '提示', {type: 'success'})
                        .then(() => {
                            this.$router.push({name: 'transparentOrder'});
                        });
                    return;
                }
                this.$alert(res.data.message, '出错了', {type: 'error'});
            });
        }
    }
};
</script>
<style lang="scss" scoped>
    .unit {
        position: absolute;
        right: 40px;
        top: 10px;
    }

    .add-box {
        text-align: right;
        display: block;
        position: relative;
        i {
            position: absolute;
            cursor: pointer;
            right: 10px;
            top: -25px;
            font-size: 20px;
            color: $color-minor;
        }
    }

    .other-charge {
        padding-top: 10px;
        padding-bottom: 0;
        position: relative;
        .gy-form-group {
            padding-bottom: 0;
        }
        i {
            position: absolute;
            cursor: pointer;
            right: 10px;
            top: 50%;
            font-size: 20px;
            margin-top: -18px;
            color: $color-minor;
        }
    }

    .total {
        text-align: right;
        color: $color-title;
        line-height: 50px;
        padding-right: 40px;
        strong {
            font-size: 16px;
            font-weight: normal;
        }
    }
    .trace-data{
        padding: 0 16px 20px;
        .trace-total{
            font-size: 12px;
            margin: 20px 0;
        }
        .summation {
            td {
                background-color: #edf3f7 !important;
                color: #666666;
                font-weight: bold;
                border-bottom: 1px solid #f2f2f2;
                padding: 10px;
                line-height: 20px;
                font-size: 12px;
            }
        }
    }
</style>
