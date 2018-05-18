import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        projectlist: [], //porject列
        fenleilist: [], //分类块儿
        fllist: [],
        xuanzhong: false,
        danqian: '', //当前点击的
    },
    mutations: {
        getAllData(store, data) {
            store.fenleilist = data;
            //获取project项
            for (let i = 0; i < store.fenleilist.length; i++) {
                store.projectlist.push(store.fenleilist[i].cont); //加入到左侧
            }
        },
        //触发porject列
        changeProjectlist(store, data) {
            //将其加入到porject列中
            store.projectlist.push(data);
            let bbb = {
                cont: data,
                ar: []
            }
            store.fenleilist.push(bbb);
        },
        changeFenlei(store, data) {

            for (var i = 0; i < store.fenleilist.length; i++) {
                console.log(store.fenleilist[i].cont)
                if (store.fenleilist[i].cont == data[0]) {
                    console.log("找到 : " + store.fenleilist[i].cont)
                    let array = {
                        title: data[1],
                        fenlei: []
                    }
                    store.fenleilist[i].ar.push(array);
                    break;
                }
            }
            console.log(store.fenleilist)
        },
        //点击添加内容时候会触发这个方法
        addfenlei(store, data) {
            //data[2] == 当前选中/ data[0] = 当前title / data[1]= 当前内容
            console.log(data)
            for (let i = 0; i < store.fenleilist.length; i++) {
                if (data[2] == store.fenleilist[i].cont) {
                    for (let j = 0; store.fenleilist[i].ar.length; j++) {
                        if (store.fenleilist[i].ar[j].title == data[0]) {
                            store.fenleilist[i].ar[j].fenlei.push(data[1]);
                        }
                    }
                }
            }
            //打印
            console.log(store.fenleilist)
            console.log(data)
        },
        a(store, data) {
            store.danqian = data;
        },
        aaaa(store, data) {
            store.fenleilist = data;
        },
        bbbb(store, data) {
            store.projectlist = data;
        },
        //这里接收拖放事件 表示被拖放目标放入拖放目标div中 并且删除原列表内容增加到拖放目标列表中
        dragAndDrop(store, data) {
            //  nowPitchProjectTitle    表示当前project项标题
            // 	placeTheTitle               拖放到的分类标题
            // 	DragAndDropTitle            拖拽元素标题
            // 	DragAndDropContent              拖拽元素内容
            // formerClassify				原拖放标题
            console.log(data)

            let fenlei = {
                title: data.DragAndDropTitle,
                content: data.DragAndDropContent
            }
            for (let i = 0; i < store.fenleilist.length; i++) {
                if (store.fenleilist[i].cont == data.nowPitchProjectTitle) {
                    for (let j = 0; j < store.fenleilist[i].ar.length; j++) {
                        if (store.fenleilist[i].ar[j].title == data.formerClassify) {
                            for (let k = 0; k < store.fenleilist[i].ar[j].fenlei.length; k++) {
                                if (store.fenleilist[i].ar[j].fenlei[k].title == data.DragAndDropTitle) {
                                    store.fenleilist[i].ar[j].fenlei.splice(k, 1) //删除
                                }
                            }
                            // store.fenleilist[i].ar.splice(j, 1) //删除
                        }
                    }
                }
            }
            for (let i = 0; i < store.fenleilist.length; i++) {
                if (store.fenleilist[i].cont == data.nowPitchProjectTitle) {
                    for (let j = 0; j < store.fenleilist[i].ar.length; j++) {
                        if (store.fenleilist[i].ar[j].title == data.placeTheTitle) {
                            store.fenleilist[i].ar[j].fenlei.push(fenlei);
                        }
                    }
                }
            }
        }
    }
})