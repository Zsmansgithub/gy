<template>
  <div class="my-container">
       <div class="customer-title">
            {{title}}
        </div>
      <div class="gy-form ">
            <p class="model_title"><i class="iconfont icon-gaishu"></i> 概述</p>
            <div class="gy-form-group">
                <span class="l is-required">企业名称</span>
                <input  type="text" placeholder="请填写" class="gy-input"  v-model="formData.customerName" @blur="customerNameChange()">
            </div>
            <!-- <div class="gy-form-group">
                <span  class="l is-required"> 客户状态</span>
                <el-select  :disabled="title === '新增潜在客户'" v-model="formData.customerStatus"  placeholder="请选择">
                    <el-option
                    v-for="item in  clientManagers"
                    :key="item.dictId"
                    :label="item.dictName"
                    :value="item.dictId">
                    </el-option>
                </el-select>
            </div> -->
             <div class="gy-form-group">
                <span class="l is-required"> 企业类型</span>
                <el-select   v-model="formData.customerTypeDictId"  placeholder="请选择">
                    <el-option
                    v-for="item in  customerType"
                    :key="item.dictId"
                    :label="item.dictName"
                    :value="item.dictId">
                    </el-option>
                </el-select>
            </div>
            <div class="gy-form-group">
                <span class="l is-required"> 企业属性</span>
                <el-select   v-model="formData.customerAttrDictId"  placeholder="请选择">
                    <el-option
                    v-for="item in  customerAttr"
                    :key="item.dictId"
                    :label="item.dictName"
                    :value="item.dictId">
                    </el-option>
                </el-select>
            </div>
            <div class="gy-form-group">
                <span class="l"> 企业规模</span>
                <el-select   v-model="formData.customerScaleDictId"  placeholder="请选择">
                    <el-option
                    v-for="item in  customerScale"
                    :key="item.dictId"
                    :label="item.dictName"
                    :value="item.dictId">
                    </el-option>
                </el-select>
            </div>
        </div>
    <div class="gy-form ">
        <p class="model_title"><i class="iconfont icon-xiangxixinxi"></i> 详细信息</p>
            <div class="gy-form-group">
                <span class="l is-required"> 人员规模</span>
                <el-select   v-model="formData.personScale"  placeholder="请选择">
                    <el-option
                    v-for="item in personScaleArr"
                    :key="item.dictId"
                    :label="item.dictName"
                    :value="item.dictId">
                    </el-option>
                </el-select>
            </div>
            <div class="gy-form-group">
                <span class="l"> 注册资金</span>
                <input  @change="dataToFixed('registeredCapital', 4)" type="number" placeholder="请填写" class="gy-input three-column"  v-model.number="formData.registeredCapital">万元
            </div>
            <div class="contact-address gy-form-group">
                    <span class="l is-required">总部地址</span>
                    <el-select @change="searchArea(2,formData.provinceId)"  v-model="formData.provinceId"  placeholder="省市">
                        <el-option
                        v-for="item in addressData.province"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                    <el-select @change="searchArea(3,formData.cityId)"  v-model="formData.cityId"  placeholder="城市">
                        <el-option
                        v-for="item in addressData.city"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                        <el-select   v-model="formData.areaId"  placeholder="区">
                        <el-option
                        v-for="item in addressData.area"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
            </div>
            <div class="gy-form-group">
                  <span class="l is-required"> 成立日期</span>
                  <el-date-picker
                  class="form-date"
                  v-model="formData.registrationDate"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions0">
                  </el-date-picker>
            </div>
            <div class="gy-form-group">
                <span class="l"> 区域</span>
                <input  type="text" placeholder="请输入" class="gy-input"  v-model="formData.region">
            </div>
             <div class="gy-form-group clearfix">
                <input  type="text" placeholder="联系地址" class="gy-input"  v-model="formData.address">
            </div>
             <div class="gy-form-group">
                <span class="l is-required"> 交易品种</span>
                <input  type="text" placeholder='请填写, 多种交易品种请用  ","  进行分隔' class="gy-input"  v-model="formData.products">
            </div>
            <div class="gy-form-group">
                <span class="l"> 产业链状态</span>
                <input  type="text" placeholder="请填写" class="gy-input"  v-model="formData.industrialChainsStatus">
            </div>
             <div class="gy-form-group">
                <span class="l"> 产业链分布</span>
                <input  type="text" placeholder="请填写" class="gy-input"  v-model="formData.industrialChainsArea">
            </div>
             <div class="clearfix  gy-form-group">
                <span class="l"> 年产量</span>
                <input  type="number"   @change="dataToFixed('annualYield', 4)" placeholder="请填写" class="gy-input three-column"  v-model.number="formData.annualYield">万吨
            </div>
            <div class="gy-form-group">
                <span class="l"> 原料</span>
                <input  type="text" placeholder="请填写" class="gy-input"  v-model="formData.material">
            </div>
            <div class="gy-form-group">
                <span class="l"> 年交易量</span>
                <input type="number" placeholder="请填写" class="gy-input three-column"   @change="dataToFixed('annualTurnover', 4)"  v-model.number="formData.annualTurnover">万吨
            </div>
            <div class="gy-form-group">
                <span class="l"> 年营业额</span>
                <input type="number" placeholder="请填写" class="gy-input three-column"  @change="dataToFixed('annualAmount', 4)" v-model.number="formData.annualAmount">万元
            </div>
            <div class="gy-form-group">
                <span class="l"> 上游关系</span>
                <input  type="text" placeholder="请输入" class="gy-input"  v-model="formData.upRelationship">
            </div>
            <div class="gy-form-group">
                <span class="l"> 下游关系</span>
                <input  type="text" placeholder="请输入" class="gy-input"  v-model="formData.downRelationship">
            </div>
            <!-- <div class="gy-form-group">
                <span class="l"> 会议期间</span>
                <input  type="text" placeholder="请输入" class="gy-input"  v-model="formData.meetingPeriod">
            </div> -->
            <div class="gy-form-group">
                <span class="l"> 邀请人</span>
                <input  type="text" placeholder="请输入" class="gy-input"  v-model="formData.inviter">
            </div>
            <div class="gy-form-group clearfix">
                <span class="l"> 现场签约</span>
                <el-select   v-model="formData.spotContract"  placeholder="请选择">
                    <el-option
                    v-for="item in spotContracttype"
                    :key="item.spotContractId"
                    :label="item.spotContName"
                    :value="item.spotContractId">
                    </el-option>
                </el-select>
            </div>
            <div class="gy-form-group">
                <span class="l"> 入驻意向</span>
                <el-select   v-model="formData.enterIntention"  placeholder="请选择">
                    <el-option
                    v-for="item in enterIntentiontype"
                    :key="item.enterIntentionId"
                    :label="item.enterIntentionName"
                    :value="item.enterIntentionId">
                    </el-option>
                </el-select>
            </div>
            <div class="gy-form-group">
                <span class="l"> ERP系统</span>
                <el-select   v-model="formData.erpSystem"  placeholder="请选择">
                    <el-option
                    v-for="item in erpSystemtype"
                    :key="item.erpSystemId"
                    :label="item.erpSystemName"
                    :value="item.erpSystemId">
                    </el-option>
                </el-select>
            </div>
            <div class="gy-form-group">
                <span class="l"> OA系统</span>
                <el-select   v-model="formData.oaSystem"  placeholder="请选择">
                    <el-option
                    v-for="item in oaSystemtype"
                    :key="item.oaSystemId"
                    :label="item.oaSystemName"
                    :value="item.oaSystemId">
                    </el-option>
                </el-select>
            </div>
             <div class="gy-form-group single-row clearfix">
                <span class="l"> 备注</span>
                 <textarea  class="gy-textarea" v-model="formData.remark" cols="30" rows="10" placeholder="请填写"></textarea>
            </div>
            <div class="gy-form-group">
                <span class="l"> 三证信息</span>
                    <el-upload
                        :limit="3"
                        accept="image/*"
                        action="api"
                        list-type="picture-card"
                        :file-list="imgList"
                        :on-remove="deleteAvatar"
                        :on-preview="showImg"
                        :http-request="uploadImg">
                        <i class="el-icon-plus"></i>
                    </el-upload>
            </div>
            <div @click="showImgUrl=''" v-if="showImgUrl" class="showAvatar">
                <img :src="showImgUrl" alt="">
            </div>
        </div>
        <div class="gy-form">
            <p class="model_title"><i class="iconfont icon-xiangxixinxi"></i> 引荐人</p>
            <div class="gy-form-group">
                <span class="l"> 来源</span>
                <el-select v-model="formData.referrerTypeDictId" @change="sourcechange"  placeholder="请选择">
                    <el-option
                    v-for="item in customerSource"
                    :key="item.dictId"
                    :label="item.dictName"
                    :value="item.dictId">
                    </el-option>
                </el-select>
            </div>
            <!-- 公司来源 -->
            <div v-if="formData.referrerTypeDictId === 56 || formData.referrerTypeDictId === 55">
                <div v-if="formData.referrerTypeDictId === 56" class="gy-form-group clearfix">
                    <span class="l"> 公司名称</span>
                    <input  type="text" placeholder="请输入" class="gy-input"  v-model="formData.referrerDesc.companyName">
                </div>
                <div v-if="formData.referrerTypeDictId === 55" class="gy-form-group clearfix">
                    <span class="l"> 公司名称</span>
                    <product-search :selected.sync="selectedProduct"></product-search>
                </div>
                <div class="gy-form-group clearfix">
                    <span class="l"> 引荐人</span>
                    <input  type="text" placeholder="请输入" class="gy-input"  v-model="formData.referrerDesc.contactName">
                </div>
                <div class="gy-form-group">
                    <span class="l"> 手机号</span>
                    <input  type="text" placeholder="请输入" class="gy-input"  v-model="formData.referrerDesc.phone">
                </div>
            </div>
            <div v-if="formData.referrerTypeDictId === 53 || formData.referrerTypeDictId === 54">
                <div class="gy-form-group clearfix">
                    <span class="l"> 引荐人</span>
                    <input  type="text" placeholder="请输入" class="gy-input"  v-model="formData.referrerDesc.companyName">
                </div>
                <div class="gy-form-group">
                    <span class="l"> 手机号</span>
                    <input  type="text" placeholder="请输入" class="gy-input"  v-model="formData.referrerDesc.phone">
                </div>
            </div>
        </div>
        <div class="gy-form">
            <p class="model_title"><i class="iconfont icon-xiangxixinxi"></i> 新增自定义字段</p>
            <div v-for="(item, index) in fieldsList" :key="index">
                <div v-if="isShowOrName || item.enName !== 'organizationName'" class="gy-form-group">
                    <span class="l">
                        <el-tooltip poper-class="test" :content="item.cnName" :disabled="(item.cnName && item.cnName.replace(/[^x00-xff]/g, 'aa').length > 12)? disabled : !disabled" placement="top" effect="light">
                            <span class="nowrap">{{item.cnName}}</span>
                        </el-tooltip>
                    </span>
                    <el-select v-if="item.fieldType ==3"  v-model="formData.extendInfos[index]"  placeholder="请选择">
                        <el-option
                        v-for="item1 in item.options"
                        :key="item1"
                        :label="item1"
                        :value="item1">
                        </el-option>
                    </el-select>
                    <input v-else type="text" placeholder="请输入" maxlength="20" class="gy-input"  v-model="item.value">
                </div>
            </div>
            <div class="contact-con">
                <div class="contact-tab">客户内部员工</div>
                <div class="add-contact"><button   @click="addContact"  class="gy-button-extra">新增</button></div>
                <table  class="gy-table">
                    <thead>
                        <tr>
                            <td>姓名</td>
                            <td>职务</td>
                            <td>移动电话</td>
                            <td>邮箱</td>
                            <td>是否联系人</td>
                            <td>备注</td>
                            <td width="100">操作</td>
                        </tr>
                    </thead>
                    <tbody v-if="formData.customerContacts.length !== 0">
                    <tr v-for="(item,index) in formData.customerContacts" :key="index">
                        <td>{{item.contactName}}</td>
                         <td>{{item.title}}</td>
                         <td class="align-r">{{item.mobile}}</td>
                         <td class="align-r">{{item.email}}</td>
                         <td>{{item.defaultContact?'是':'否'}}</td>
                         <td  :title='item.remark'><span class="nowrap">{{item.remark}}</span></td>
                        <td class="align-c"><button @click="editcontact(index)" class="gy-button-view">编辑</button><button @click="deleteContact(index)" class="gy-button-view add-margin">删除</button></td>
                    </tr>
                    </tbody>
                   <tbody v-else>
                        <tr>
                            <td colspan="7" class="null-td">没有找到可显示的数据...</td>
                        </tr>
                   </tbody>
               </table>
                 <div class="submit-con">
                    <div @click="sendFormData" class="gy-button-extra">保存</div>
                    <div @click="$router.go(-1)" class="gy-button-normal">取消</div>
                </div>
          </div>
      </div>
        <el-dialog width="900px"
                   :visible.sync="dialogVisible" :title="dialogTitle + '客户内部员工'" class="gy-dialog-title">
            <div class="add-dialog gy-form" style="overflow: hidden">
                <div class="gy-form-group">
                    <span class="l is-required">姓名</span>
                    <input  type="text" placeholder="请填写" class="gy-input"  v-model="preInfo.contactName">
                </div>
                <div class="gy-form-group ">
                    <span class="l is-required">部门</span>
                    <input  type="text" placeholder="请填写" class="gy-input"  v-model="preInfo.dept">
                </div>
                <div class="gy-form-group">
                    <span class="l is-required">职务</span>
                    <input  type="text" placeholder="请填写" class="gy-input"  v-model="preInfo.title">
                </div>
                <div class="gy-form-group">
                    <span class="l  is-required">移动电话</span>
                    <input  type="text" placeholder="请填写" class="gy-input"  v-model="preInfo.mobile">
                </div>
                 <div class="gy-form-group">
                    <span class="l">办公电话</span>
                    <input  type="text" placeholder="请填写" class="gy-input"  v-model="preInfo.phone">
                </div>
                 <div class="gy-form-group">
                    <span class="l">邮箱</span>
                    <input  type="text" placeholder="请填写" class="gy-input"  v-model="preInfo.email">
                </div>
                <div class="gy-form-group">
                    <span class="l">设为联系人</span>
                    <el-switch
                    v-model="preInfo.defaultContact"
                    active-value="1"
                    inactive-value="0">
                    </el-switch>
                </div>
                 <div class="gy-form-group single-row clearfix">
                    <span class="l">备注</span>
                    <textarea class="gy-textarea"  v-model="preInfo.remark" cols="30" rows="10" placeholder="请填写"></textarea>
                </div>
                 <div class="submit-con" style="margin-right:30px;">
                    <div @click='saveContactData' class="gy-button-extra">保存</div>
                    <div @click='cancelAdd' class="gy-button-normal">取消</div>
                </div>
            </div>
        </el-dialog>
  </div>
</template>
<script>
import productSearch from '@/components/productSearch';
export default {
    props: {
        title: String
    },
    components: {
        productSearch
    },
    data () {
        return {
            selectedProduct: {},
            disabled: false,
            formData: {
                address: '', // 地址
                annualAmount: '', // 年营业额
                annualTurnover: '', // 年交易量
                annualYield: '', // 年产量
                areaId: '', // 所属区县
                certificateFileUrl: '',
                cityId: '', // 城市
                provinceId: '', // 所属省份
                customerAttrDictId: '', // 企业属性
                industrialChainsStatus: '', // 产业链状态
                industrialChainsArea: '', // 产业链分布
                customerContacts: [],
                customerName: '', // 客户名称
                customerScaleDictId: '', // 企业规模
                referrerTypeDictId: '', // 来源
                customerStatus: '',
                customerTypeDictId: '', // 企业类型
                enName: '',
                fax: '',
                material: '', // 原料
                personScale: '', //  人员规模
                phone: '',
                products: '', // 交易品种
                registeredCapital: '', //  注册资金
                registrationDate: '', //  注册日期
                remark: '', // 备注
                meetingPeriod: '', // 会议期间
                inviter: '', // 邀请人
                region: '', // 区域
                erpSystem: '', // ERP系统  0 无；1 有
                oaSystem: '', // OA系统  0 无；1 有
                spotContract: '', //  现场签约 0 否；1 是
                enterIntention: '', // 入驻意向 0 否；1 是
                upRelationship: '', // 上游关系
                downRelationship: '', // 下游关系
                socialCode: '',
                website: '',
                referrerDesc: { // 来源
                    companyId: null, // 公司id
                    companyName: null, // 公司名称
                    contactName: null, // 联系人
                    phone: null // 电话
                },
                extendInfos: [],
                extendInfo: []
            },
            clientManagers: [{dictId: 0, dictName: '潜在客户'}, {dictId: 1, dictName: '客户'}], // 客户经理
            erpSystemtype: [{erpSystemId: 0, erpSystemName: '无'}, {erpSystemId: 1, erpSystemName: '有'}], // ERP系统
            oaSystemtype: [{oaSystemId: 0, oaSystemName: '无'}, {oaSystemId: 1, oaSystemName: '有'}], // OA系统
            spotContracttype: [{spotContractId: 0, spotContName: '否'}, {spotContractId: 1, spotContName: '是'}], // 现场签约
            enterIntentiontype: [{enterIntentionId: 0, enterIntentionName: '否'}, {enterIntentionId: 1, enterIntentionName: '是'}], // 入驻意向
            personScaleArr: [], // 人员规模
            customerType: [], // 企业类型
            customerAttr: [], // 企业属性
            customerScale: [], // 企业规模
            addressData: {
                province: [],
                city: [],
                area: []
            },
            customerSource: [], // 来源
            fieldsList: [], // 自定义字段
            preInfo: {
                contactName: '',
                dept: '',
                email: '',
                mobile: '',
                phone: '',
                remark: '',
                title: '',
                defaultContact: ''
            },
            dialogVisible: false,
            imgVisible: false,
            dialogTitle: '新增',
            currentIndex: 0,
            isReupload: true,
            imgList: [],
            showImgUrl: '',
            companyName: JSON.parse(localStorage.getItem('userInfo')).companyName,
            uploadFileUrl: this.$http.defaults.baseURL + this.$api.client.uploadFile,
            pickerOptions0: {
                disabledDate (time) {
                    return time.getTime() > Date.now();
                }
            },
            isShowOrName: this.$route.query.isShowOrName
        };
    },
    methods: {
        init () {
            this.getCompanyType();
            this.getCompanyAttr();
            this.getCustomerScale();
            this.getPersonScale();
            this.getCustomerSource();
            this.searchArea(1, 0);
            this.viewType();
            this.getFields();
        },
        // 校验公司是否存在
        customerNameChange () {
            if (this.formData.customerName === null || this.formData.customerName === '') {
                this.$message.error('公司名称不能为空，请输入!');
                return;
            }
            this.$http.get(this.$api.client.customerName + this.formData.customerName)
                .then(res => {
                    if (res.data.code === 0) {
                        if (res.data.data === 0) {
                            console.log(111);
                        } else {
                            this.$message.error('公司已经存在，请重新输入!');
                        }
                    }
                });
        },
        sourcechange (val) {
            // formData.referrerDesc.companyName = val.name;
            console.log(this.formData.referrerTypeDictId);
        },
        getFields () {
            this.$http.get(this.$api.role.obtainfields).then((res) => {
                console.log(res.data.data);
                this.fieldsList = res.data.data;
            });
        },
        viewType () {
            if (this.title === '新增潜在客户') {
                for (let i = 0; i < this.clientManagers.length; i++) {
                    if (this.clientManagers[i].dictName === '潜在客户') {
                        this.formData.customerStatus = this.clientManagers[i].dictId;
                        break;
                    }
                }
            }
        },
        getCompanyType () {
            this.$http.get(this.$api.client.companyType).then((res) => {
                if (res.data.code === 0) {
                    this.customerType = res.data.data;
                } else {
                    this.$message(res.data.message);
                }
            });
        },
        getCompanyAttr () {
            this.$http.get(this.$api.client.companyAttr).then((res) => {
                if (res.data.code === 0) {
                    this.customerAttr = res.data.data;
                } else {
                    this.$message(res.data.message);
                }
            });
        },
        getCustomerScale () {
            this.$http.get(this.$api.client.customerScale).then((res) => {
                if (res.data.code === 0) {
                    this.customerScale = res.data.data;
                } else {
                    this.$message(res.data.message);
                }
            });
        },
        getPersonScale () {
            this.$http.get(this.$api.client.personScale).then((res) => {
                if (res.data.code === 0) {
                    this.personScaleArr = res.data.data;
                } else {
                    this.$message(res.data.message);
                }
            });
        },
        getCustomerSource () {
            this.$http.get(this.$api.client.customerSource).then((res) => {
                if (res.data.code === 0) {
                    this.customerSource = res.data.data;
                    let customer = {
                        dictCategory: null,
                        dictId: null,
                        dictName: '无'
                    };
                    this.customerSource.push(customer);
                } else {
                    this.$message(res.data.message);
                }
            });
        },
        searchArea (type, id) {
            this.$http.get(this.$api.client.searchArea + id).then((res) => {
                if (res.data.code === 0) {
                    if (type === 1) {
                        this.addressData.province = res.data.data;
                        this.formData.cityId = '';
                        this.formData.areaId = '';
                    } else if (type === 2) {
                        this.addressData.city = res.data.data;
                        this.formData.areaId = '';
                        this.formData.cityId = '';
                        this.provinceCodeGet(this.formData.provinceId);
                    } else if (type === 3) {
                        this.formData.areaId = '';
                        this.addressData.area = res.data.data;
                    }
                } else {
                    this.$message(res.data.message);
                }
            });
        },
        provinceCodeGet (item) {
            this.$http.get(this.$api.customer.provinceCode + item).then(res => {
                if (res.data.code === 0) {
                    this.formData.region = res.data.data;
                }
            });
        },
        addContact () {
            this.dialogTitle = '新增';
            this.dialogVisible = true;
            this.preInfo = {
                contactName: '',
                dept: '',
                email: '',
                mobile: '',
                phone: '',
                remark: '',
                title: '',
                defaultContact: 0
            };
            console.log(this.preInfo, '2222');
            this.currentIndex = this.formData.customerContacts.length;
        },
        editcontact (index) {
            this.dialogTitle = '编辑';
            this.dialogVisible = true;
            this.currentIndex = index;
            this.preInfo = Object.assign({}, this.formData.customerContacts.slice(index, index + 1)[0]);
        },
        deleteContact (index) {
            this.formData.customerContacts.splice(index, 1);
        },
        saveContactData () {
            console.log(this.preInfo, '11111');
            if (!this.checkDialogData()) {
                return false;
            }
            if (this.currentIndex === this.formData.customerContacts.length) {
                this.formData.customerContacts.push(this.preInfo);
            } else {
                this.formData.customerContacts.splice(this.currentIndex, 1, this.preInfo);
            }
            this.dialogVisible = false;
        },
        cancelAdd () {
            this.dialogVisible = false;
        },
        handleAvatarSuccess (res, file, fileList) {
            this.imgList.push({url: res});
        },
        showImg (file) {
            this.showImgUrl = file.url;
        },
        deleteAvatar (file, fileList) {
            this.imgList = this.filterImg(this.imgList, file.url);
        },
        filterImg (arr, url) {
            let data = [];
            arr.forEach(e => {
                if (e.url !== url) {
                    data.push(e);
                }
            });
            return data;
        },
        uploadImg (file) {
            let that = this;
            let formData = new FormData();
            let headers = {
                'Content-Type': 'multipart/form-data'
            };
            formData.append('file', file.file);
            formData.append('storage', 'crm');
            that.$http.post(that.$api.client.uploadFile, formData, headers)
                .then(function (res) {
                    that.imgList.push({url: res.data.data});
                    that.isReupload = true;
                });
        },
        dataToFixed (value, n) {
            this.formData[value] = this.formData[value].toFixed(n);
        },
        checkFormData () {
            let flag = true;
            let data = [
                {value: this.formData.customerName, msg: '客户名称不能为空'},
                {value: this.formData.customerTypeDictId, msg: '企业类型不能为空'},
                {value: this.formData.customerAttrDictId, msg: '企业属性不能为空'},
                {value: this.formData.personScale, msg: '人员规模不能为空'},
                {value: this.formData.provinceId, msg: '省市不能为空'},
                {value: this.formData.cityId, msg: '城市不能为空'},
                {value: this.formData.areaId, msg: '区不能为空'},
                {value: this.formData.address, msg: '联系地址不能为空'},
                {value: this.formData.products, msg: '交易品种不能为空'},
                // {value: this.formData.referrerTypeDictId, msg: '来源不能为空'},
                {value: this.formData.registrationDate, msg: '成立日期不能为空'}
            ];
            for (let i = 0; i < data.length; i++) {
                if (!data[i].value && data[i].value !== 0) {
                    this.$message({message: data[i].msg, type: 'error'});
                    flag = false;
                    break;
                }
            }
            return flag;
        },
        checkDialogData () {
            let flag = true;
            let data = [
                {value: this.preInfo.contactName, msg: '姓名不能为空'},
                {value: this.preInfo.dept, msg: '部门不能为空'},
                {value: this.preInfo.title, msg: '职务不能为空'},
                {value: this.preInfo.mobile, msg: '移动号码不能为空'}
            ];
            for (let i = 0; i < data.length; i++) {
                if (!data[i].value && data[i].value !== 0) {
                    this.$message(data[i].msg);
                    flag = false;
                    break;
                }
            }
            return flag;
        },
        sendFormData () {
            if (!this.check()) {
                return false;
            }
            for (let i = 0; i < this.fieldsList.length; i++) {
                for (let j = 0; j < this.formData.extendInfos.length; j++) {
                    if (i === j) {
                        this.fieldsList[i].value = this.formData.extendInfos[j];
                    }
                }
            }
            this.formData.extendInfo = this.fieldsList;
            if (!this.checkFormData()) {
                return false;
            }
            this.imgList.length !== 0 && (this.formData.certificateFileUrl = JSON.stringify(this.imgList));
            console.log(this.formData);
            this.$http.post(this.$api.client.addCustomers, this.formData).then((res) => {
                if (res.data.code === 0) {
                    this.$router.go(-1);
                } else {
                    this.$message(res.data.message);
                }
            });
        },
        // 验证
        check () {
            if (this.formData.referrerDesc.phone && !(/^1[34578]\d{9}$/.test(this.formData.referrerDesc.phone))) {
                this.$message.error('请输入正确手机号');
                return false;
            }
            return true;
        }
    },
    watch: {
        dialogVisible (newValue, oldValue) {
            if (!newValue) {
                this.currentIndex = 0;
            }
        },
        selectedProduct: function (val) {
            console.log(val);
            this.formData.referrerDesc.companyName = val.name;
            this.formData.referrerDesc.companyId = val.id;
        }
    },
    created () {
        this.init();
    }
};

</script>
<style scoped lang="scss">
  .my-container {
      .gy-form-group{
        .nowrap {
            width: 90px;
            display: block;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            cursor: pointer;
        }
      }
      .model_title i{
          vertical-align: baseline;
      }
      .customer-title {
        padding: 3px 15px;
        font-size: 16px;
        color: #333333;
        font-weight: bold;
        border-bottom: 1px solid #E7ECF1;
      }
      .contact-con  {
          margin-top:20px ;
          padding-right:30px ;
          padding-left:13px ;
          display: inline-block;
          width: 100%;
          div {
              display: inline-block;
          }
          .add-margin {
              margin-left: 12px;
          }
          .contact-tab {
              border: 1px solid #f2f2f2;
              padding: 5px 15px;
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
          }
          .add-contact {
              float: right;
          }
         .nowrap {
            width: 200px;
            display: block;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
         }
      }
      .is-required::before {
            content: "*";
            color: #e0370f;
            font-size: 12px;
            font-weight: 400;
            position: absolute;
            left: 6px;
            top: 0;
      }
      .null-td {
        text-align: center;
     }
      .clearfix {
          content: "";
          display: block;
          clear: both;
      }
      .contact-address  .el-select {
          width: 32%;
      }
        .showAvatar {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,.8);
        z-index: 999999;
      }
        .showAvatar img{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
      .submit-con {
          float: right;
          margin-top:50px;
          div:nth-child(1) {
              margin-right:10px ;
          }
      }
       .form_save {
              background-color: #e0370f;
              font-size: 14px;
              font-weight: bold;
              color: #fff;
              margin-right:10px ;
        }
      input::-webkit-input-placeholder {
        color: #999;
        font-size: 14px;
      }
      .three-column {
         width: 93%;
      }
       .l {
          width: 105px;
      }
  }
</style>
<style lang="scss">
.gy-dialog-title .el-dialog__header {
    border-bottom: 1px solid #DCE0E4!important;
    padding: 15px!important;
}
.my-container .container-fluid .el-input__inner {
    font-size: 14px;
}
.my-container  .el-dialog__body {
    padding: 0;
}
</style>
