<template>
    <div class="fuzzySearch">
        <input type="text" class="gy-input" v-model="contactName" @change="handleList(contactName)" @keyup.13="handleGetList">
        <ul v-show="showLi" v-clickOutside="handleHiddenList">
            <li v-if="showLis.length === 0">没有搜到联系人</li>
            <li v-else v-for="(item, index) in showLis" :key="index" @click="handleList(item)">{{item.contactName}}</li>
        </ul>
        <i class="iconfont icon-mySearch" @click="handleGetList"></i>
    </div>
</template>
<script>
const clickOutside = {
    bind (el, binding) {
        function documentHandler (e) {
            if (el.contains(e.target)) {
                return false;
            }
            if (binding.expression) {
                binding.value(e);
            }
        }
        el.vueClickOutside = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    unbind (el) {
        document.removeEventListener('click', el.vueClickOutside);
        delete el.vueClickOutside;
    }
};

export default {
    name: 'contacts-search',
    props: {
        contactData: Object,
        contactSel: Number
    },
    data () {
        return {
            showLis: [],
            showLi: false,
            contactName: '',
            lastTime: null
        };
    },
    directives: {
        clickOutside
    },
    mounted () {

    },
    methods: {
        getList (e) {
            this.lastTime = e.timeStamp;
            setTimeout(() => {
                if (this.lastTime === e.timeStamp && this.contactName && this.contactName.length > 2) {
                    this.handleGetList();
                }
            }, 500);
        },
        // 模糊搜索   搜索所有
        handleGetList () {
            let compony = null;
            this.contactSel === 1 ? compony = this.contactData.sellerCompanyId : compony = this.contactData.buyerCompanyId;
            let prarms = {
                companyId: compony,
                contactName: this.contactName
            };
            this.$http.post(this.$api.matchmak.contacts, prarms).then(res => {
                this.showLis = res.data.data;
                this.showLi = true;
            });
        },
        handleList (event) {
            event instanceof Object ? this.contactName = event.contactName : this.contactName = event;
            this.contactSel === 1 ? this.$emit('updateselectedsell', event) : this.$emit('updateselectedbuy', event);
            this.showLi = false;
        },
        handleHiddenList () {
            this.showLi = false;
        }
    }
};
</script>

<style lang="scss" scoped>
    .fuzzySearch{
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
            right: 0;
            top: 0;
        }
    }
</style>
