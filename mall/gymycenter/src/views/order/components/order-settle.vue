<template>
    <div id="orderSttle">
        <div class="base-info" v-if="orderData.id">
            <dl v-if="userType === 'sell'">
                <dt>买家</dt>
                <dd>{{orderData.buyerCompanyName}}
                </dd>
            </dl>
            <dl v-else>
                <dt>卖家</dt>
                <dd>{{orderData.sellerCompanyName}}
                </dd>
            </dl>
            <dl>
                <dt>免仓期</dt>
                <dd>{{orderData.warehouseFreeDays}}天</dd>
            </dl>
            <dl>
                <dt>交付类型</dt>
                <dd>{{orderData.deliveryType === 1 ? '买家自提' : '卖家代运'}}</dd>
            </dl>
            <dl>
                <dt>是否分批</dt>
                <dd>{{orderData.isBatchDelivery === 0 ? '否' :'是'}}</dd>
            </dl>
            <dl>
                <dt>溢短装</dt>
                <dd>±{{orderData.shortOverflowRate}}%</dd>
            </dl>
            <dl>
                <dt>付款方式</dt>
                <dd>{{orderData.paymentType | paymentType}}</dd>
            </dl>
            <dl>
                <dt>保证金</dt>
                <dd>{{orderData.depositRatio}}%</dd>
            </dl>

            <dl>
                <dt>追加保证金</dt>
                <dd>跌{{orderData.depositRatioSubtract}}%补{{orderData.depositRatioAppend}}%</dd>
            </dl>
            <dl>
                <dt>发票</dt>
                <dd v-if="orderData.provideInvoiceType === null">
                    {{orderData.provideInvoiceText}}
                    <template v-if="orderImg.list.length > 0">
                        <span v-for="(item, index) in orderImg.list" :key="index">
                            <a v-if="item.fileTypeAlias === 'pdf'" :href="item.invoiceUrl" target="_Blank">
                                <img :src="pdfThumbnail">
                            </a>
                            <img v-else @click="showReceipt(item)" :src=icon2>
                        </span>
                    </template>
                </dd>
                <!--<dd>{{orderData.provideInvoiceType ? '交割月发票':'交割次月' }}<img @click="showReceipt" v-if="iconsTrue" :src=icons></dd>-->
                <dd v-else>{{orderData.provideInvoiceType === 0 ? '交割当月发票':'交割次月发票' }}
                    <template v-if="orderImg.list.length > 0">
                        <img @click="showReceipt()" :src=icon2>
                        <span v-for="(item, index) in orderImg.list" :key="index">
                            <a v-if="item.fileTypeAlias === 'pdf'" :href="item.invoiceUrl" target="_Blank">
                                <img :src="pdfThumbnail">
                            </a>
                        </span>
                    </template>
                </dd>
            </dl>
            <dl>
                <dt>货源</dt>
                <dd>{{orderData.skuOrigin}}</dd>
            </dl>
            <dl>
                <dt>质量标准</dt>
                <dd>{{orderData.qualityStandard}}</dd>
            </dl>
            <dl>
                <dt>包装标准</dt>
                <dd>
                    <template v-if="orderData.packagingStandard==0">
                        散水
                    </template>
                    <template v-else-if="orderData.packagingStandard==1">
                        桶装货
                    </template>
                    <template v-else-if="orderData.packagingStandard==2">
                        袋装货
                    </template>
                    <template v-if="orderData.packagingStandard==3">
                        原厂原包 {{orderData.orderExpandModel.packagingStandardVal}}
                    </template>
                    <template v-else-if="orderData.packagingStandard==4">
                        吨包 {{orderData.orderExpandModel.packagingStandardVal ?',' + orderData.orderExpandModel.packagingStandardVal + 'KG' : ''}}
                    </template>
                    <template v-else-if="orderData.packagingStandard==5">
                        灌包
                    </template>
                </dd>
            </dl>
            <dl>
                <dt>数量验收标准</dt>
                <dd>
                    <template v-if="orderData.acceptanceStandard">
                        签收数量
                    </template>
                    <template v-else>
                        出库数量
                    </template>
                </dd>
            </dl>
            <dl v-if="orderData.orderContractCode">
                <dt>合同编号</dt>
                <dd>{{orderData.orderContractCode}}
                        <!-- <span v-show="orderView.list.length > 0" v-for = "(item, index) in orderView.list" :key="index">
                            <a v-if="item.fileTypeAlias === 'pdf'" :href="item.filepath" target="_Blank">
                                <img :src="pdfThumbnail">
                            </a>
                            <img v-else @click="showContractViews(item)" :src=icon2>
                        </span> -->
                        <template v-if="orderView.list.length > 0">
                            <span v-for="(item, index) in orderView.list" :key="index">
                                <a v-if="item.fileTypeAlias === 'pdf'" :href="item.filepath" target="_Blank">
                                    <img :src="pdfThumbnail">
                                </a>
                                <img v-else @click="showContractViews(item)" :src=icon2>
                            </span>
                        </template>
                        </dd>
            </dl>
            <dl>
                <dt>卖方联系人</dt>
                <dd>{{orderData.sellerContact}}</dd>
            </dl>
            <dl>
                <dt>卖方联系方式</dt>
                <dd>{{orderData.sellerContactMobile}}</dd>
            </dl>
            <dl>
                <dt>买方联系人</dt>
                <dd>{{orderData.buyerContact}}</dd>
            </dl>
            <dl>
                <dt>买方联系方式</dt>
                <dd>{{orderData.buyerContactMobile}}</dd>
            </dl>
        </div>
        <!--查看合同-->
        <!--预览图片-->
        <el-dialog title="图片预览" :visible.sync="previewerImg.visible" width="600px" hight="1000px" class="settle-dialogsd">
            <el-carousel ref="previewerImg" trigger="click" :autoplay="false" v-show="previewerImg.list.length!=0">
                <el-carousel-item v-for="(item, index) in previewerImg.list" :key="index">
                    <img class="previewer-img-detail" :src="item.invoiceUrl" style="width: 100%;height: 100%">
                </el-carousel-item>
            </el-carousel>
            <img v-show="previewerImg.list.length==0" src="@/assets/images/fp.png" alt="" style="width: 100%;height: 100%">
        </el-dialog>
       <!-- 合同预览图片 -->
        <el-dialog title="图片预览" :visible.sync="showContractView.visible" width="600px" hight="1000px">
            <el-carousel ref="previewerImgOrder" trigger="click" :autoplay="false">
                <el-carousel-item v-for="(item, index) in showContractView.list" :key="index">
                    <img class="previewer-img-detail" :src="item.filepath" style="width: 100%;height: 100%">
                </el-carousel-item>
            </el-carousel>
            <!-- <img v-show="previewerImgOrder.list.length==0" src="@/assets/images/fp.png" alt="" style="width: 100%;height: 100%"> -->
        </el-dialog>

        <!-- 查看发票-->
        <!-- 预览图片 -->
        <el-dialog title="图片预览" :visible.sync="previewerImgs.visible" width="800px" height="800px">
            <el-carousel ref="previewerImgs" trigger="click" :autoplay="false">
                <el-carousel-item v-for="(item, index) in previewerImgs.list" :key="index">
                    <img class="previewer-img-detail" :src="item.url">
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
        <contract :show-contract.sync="showContract" :show-btn="showHandlechapter" :file="contractUrl"
                  @handlechapter="handleChapter" v-show="showContract">
        </contract>
    </div>

</template>

<script>
import contract from '@/components/contract';
export default {
    name: 'orderInfo',
    props: {
        orderData: Object,
        userType: {
            type: String,
            default: 'sell'
        },
        orderView: Object,
        orderImg: Object
    },
    data () {
        return {
            pdfThumbnail: require('@/assets/images/pdf.png'),
            icon: require('@/assets/images/icon-piao.png'),
            icon2: require('@/assets/images/newfp.png'),
            icons: '',
            iconsTrue: false,
            previewerImg: {
                visible: false,
                list: [],
                imglist: [],
                pdflist: []
            },
            previewerImgs: {
                visible: false,
                list: []
            },
            showContractView: {
                visible: false,
                list: []
            },
            prebiewImg: {
                list: []
            },
            orderId: '',
            showContract: false,
            contractUrl: null,
            showHandlechapter: false,
            enquiryData: {
                pageNum: 1,
                pageSize: 10,
                keywords: null,
                data: {}
            },
            signUnderLineData: {
                visible: false,
                list: []
            }
        };
    },
    components: {
        contract
    },
    watch: {
        orderData: {
            handler: function (newValue, oldValue) {
                // this.previewerImg.list = newValue.orderInvoiceModel;
            },
            deep: true
        }
    },
    mounted () {
        if (localStorage.getItem('userInfo')) {
            this.enquiryData.data.consignorId = JSON.parse(localStorage.getItem('userInfo')).companyId;
            this.currentPhone = JSON.parse(localStorage.getItem('userInfo')).phone;
        }
        // this.getInvoice();
        // this.previewerImg.list = this.orderData.orderInvoiceModel || [];
    },
    methods: {
        showReceipt () {
            // 查看发票
            var that = this;
            that.previewerImg.list = [];
            that.previewerImg.visible = true;
            that.orderImg.list.map(function (item) {
                if (item.invoiceUrl.indexOf('.pdf') === -1) {
                    that.previewerImg.list.push(item);
                } else {
                    that.previewerImg.pdflist.push(item);
                }
            });
        },
        showContractViews (item) {
            this.showContractView.list = [];
            this.showContractView.visible = true;
            this.showContractView.list.push(item);
        },
        // 查看合同
        showContracts () {
            this.handleChapter();
        },
        handleChapter () {
            this.$http.get(this.$api.order.contractCreate + '/' + this.orderData.id + '/contracts/getDocUrl')
                .then(res => {
                    if (res.data.code === 0) {
                        if (res.data.data.isOnline === 2) {
                            this.signUnderLineData.list = [];
                            res.data.data.filepath.map(item => {
                                this.signUnderLineData.list.push({
                                    filePath: item,
                                    url: item
                                });
                            });
                            this.signUnderLineData.visible = true;
                        } else {
                            this.contractUrl = res.data.data.filepath[0];
                            this.showContract = true;
                            this.showHandlechapter = false;
                        }
                    }
                    // this.contractUrl = res.data.data.filepath[0];
                });
        },
        getInvoice () {
            let that = this;
            console.log(that.orderData.id);
            that.orderId = that.orderData.id;
            that.$http.get(that.$api.invoice.sellerInvoiceImg + '/' + that.orderId)
                .then((res) => {
                    console.log(res.data.data);
                    res.data.data.map(function (item) {
                        if (item.invoiceUrl.indexOf('.pdf') === -1) {
                            that.previewerImg.list.push(item);
                        } else {
                            that.previewerImg.pdflist.push(item);
                        }
                    });
                });
        },
        showReceipts () {
            // 查看发票
            let that = this;
            that.previewerImg.visible = true;
            that.orderId = that.orderData.id;
            // that.$http.get(that.$api.invoice.sellerInvoiceImg + '/' + that.orderId)
            //     .then((res) => {
            //         console.log(res.data.data);
            //         res.data.data.map(function (item) {
            //             if (item.invoiceUrl.indexOf('.pdf') === -1) {
            //                 that.previewerImg.list.push(item);
            //             } else {
            //                 that.previewerImg.pdflist.push(item);
            //             }
            //         });
            //     });
        },
        // showReceipts () {
        //     // 查看发票
        //     let that = this;
        //     that.orderId = that.orderData.id;
        //     that.$http.get(that.$api.invoice.sellerInvoiceImg + '/' + that.orderId)
        //         .then((res) => {
        //             that.prebiewImg.list = res.data.data;
        //             console.log(res.data.data);
        //             console.log(that.orderData);
        //             // if (that.orderData.orderInvoiceList.length > 0) {
        //             //     that.iconsTrue = true;
        //             //     that.icons = res.data.data[0].invoiceUrl;
        //             //     console.log(that.icons);
        //             // }
        //         });
        // },
        /* eslint-disable */
            showPreviewer () {
                this.previewerImgs.visible = true;
                this.signUnderLineData.visible = false;
                this.previewerImgs.list = this.signUnderLineData.list;

            },
            // showContract () {
            //     // 卖方已盖章合同
            //     if (this.orderData.orderStatusHistoryModelList && this.orderData.orderStatusHistoryModelList.length > 0) {
            //         this.$emit('showContract');
            //     }
            // }
            /* eslint-enable */
    }
};
</script>
<style lang="scss" scoped>
    .icon-icon-fapiao:hover{
        cursor: pointer;
    }
    .base-info {
        font-size: 14px;
        overflow: hidden;
        padding: 0 30px;
    }
    .base-info dl {
        width: 50%;
        float: left;
        margin-bottom: 10px;
        dt {
            width: 110px;
            float: left;
            color:#333;
        }
        dd {
            float: left;
            color: #666;
            img {
                width: 30px;
                height: 20px;
                margin-left: 10px;
                border: 1px solid $color-border;
                border-radius: $border-radius-small;
                cursor: pointer;
            }
        }
        .previewer-img {
            img {
                width: 80px;
                margin-right: 10px;
            }
        }
    }
</style>

<style lang="scss">
    #orderSttle{
        .settle-dialogs{
            .el-dialog__header{
                padding: 20px 20px 10px;
            }
        }
        .previewer-img-detail {
            width: 100%;
        }
        .el-carousel__item {
            overflow: auto;
        }
        .el-carousel__container{
            height:500px
        }
    }
</style>
