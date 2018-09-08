<template>
    <el-card class="card">
        <!-- 面包屑 -->
        <my-breadcrumb level1="商品列表" level2="商品分类"></my-breadcrumb>
        <!-- 表格 -->
        <el-button style="margin-top:10px;margin-bottom:10px;" type="success" plain>添加分类</el-button>
        <!-- 表格 -->
        <el-table
        border
        stripe
        :data="tableData"
        style="width: 100%">
        <!-- treekey 唯一标示
            parentKey 绑定到父级id的属性
            levelkey绑定到不同级别的属性
            indentSize 设置不同级别的缩进
            childkey 默认值是children，标示了子节点的属性
         -->
            <el-table-tree-column
                treeKey="cat_id"
                parentKey="cat_pid"
                levelKey="cat_level"
                :indentSize="20"
                prop="cat_name"
                label="分类名称"
                width="300">
            </el-table-tree-column>
            <el-table-column
                prop="cat_level"
                label="级别"
                width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.cat_level === 0">一级</span>
                    <span v-if="scope.row.cat_level === 1">二级</span>
                    <span v-if="scope.row.cat_level === 2">三级</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="cat_deleted"
                label="是否有效">
                <template slot-scope="scope">
                    {{ scope.row.cat_deleted ? '无效' : '有效' }}
                </template>
            </el-table-column>
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button size='mini' type="primary" icon="el-icon-edit" plain></el-button>
  			        <el-button  size='mini' type="danger" icon="el-icon-delete" plain></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
			style="margin-top:15px"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenum"
            :page-sizes="[5,10, 15, 20]"
            :page-size="pagesize"
            layout="total,sizes, prev, pager, next,jumper"
            :total="total">
        </el-pagination>
    </el-card>
</template>

<script>
// 配置tree grid局部组件
import ElTreeGrid from 'element-tree-grid';

export default {
    // 注册局部组件
    components: {
        'el-table-tree-column' : ElTreeGrid
    },
    data() {
        return {
            tableData:[],
            pagenum: 1,
            pagesize: 9,
            total: 0,
        };
    },
    created() {
        this.loadData();
    },
    methods: {
        // 获取数据
        async loadData() {
            const response = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
            const { meta: { msg, status} } = response.data;
            if(status === 200) {
                this.tableData = response.data.data.result;
                this.total = response.data.data.total;
            }
        },
        handleSizeChange(val) {
        // 页容量发生变化 val页容量
        this.pagesize = val;
        this.loadData();
        console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
        // 当页码发送改变执行
        this.pagenum = val;
        this.loadData();
        console.log(`当前页: ${val}`);
        },
    }
}
</script>

<style>

</style>
